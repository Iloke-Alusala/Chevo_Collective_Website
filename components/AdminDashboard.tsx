"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import EventCard from "@/components/EventCard";
import Reveal from "@/components/Reveal";
import { useLocalEvents } from "@/components/useLocalEvents";
import { useLocalRsvps } from "@/components/useLocalRsvps";
import {
  createEmptyEvent,
  createEventId,
  defaultEvents,
  getDefaultCtaLabel,
  getEventPagePath,
  normalizeEvent,
  type EventItem,
  type EventStatus,
} from "@/lib/events";
import { getRsvpDisplayName } from "@/lib/rsvps";

type InventoryFilter = "all" | EventStatus;

const requiredFieldLabels: Record<
  keyof Pick<
    EventItem,
    "title" | "description" | "dateLabel" | "timeLabel" | "location" | "imageUrl"
  >,
  string
> = {
  title: "Title",
  description: "Description",
  dateLabel: "Date",
  timeLabel: "Time",
  location: "Location",
  imageUrl: "Image URL",
};

const requiredFields = Object.keys(requiredFieldLabels) as Array<
  keyof typeof requiredFieldLabels
>;
const initialSelectedId = defaultEvents[0]?.id ?? "new";

function buildDraft(source?: Partial<EventItem>) {
  const normalized = normalizeEvent(
    {
      ...createEmptyEvent(),
      ...source,
    },
    0,
  );

  return {
    ...normalized,
    ctaLabel: getDefaultCtaLabel(normalized.status),
    ctaHref: getEventPagePath(normalized.id),
  };
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminDashboard() {
  const { events, isReady, upsertEvent, deleteEvent, resetEvents } =
    useLocalEvents();
  const {
    rsvps,
    isReady: areRsvpsReady,
    deleteRsvp,
    deleteRsvpsForEvent,
    pruneRsvps,
  } = useLocalRsvps();

  const [selectedId, setSelectedId] = useState<string>(initialSelectedId);
  const [draft, setDraft] = useState<EventItem>(() =>
    buildDraft(defaultEvents[0]),
  );
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inventoryFilter, setInventoryFilter] =
    useState<InventoryFilter>("all");
  const [searchValue, setSearchValue] = useState("");

  const dashboardReady = isReady && areRsvpsReady;

  const sortedEvents = useMemo(() => {
    const positions = new Map(events.map((event, index) => [event.id, index]));

    return [...events].sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === "upcoming" ? -1 : 1;
      }

      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1;
      }

      return (positions.get(left.id) ?? 0) - (positions.get(right.id) ?? 0);
    });
  }, [events]);

  const rsvpCountsByEvent = useMemo(() => {
    const counts = new Map<string, number>();

    rsvps.forEach((rsvp) => {
      counts.set(rsvp.eventId, (counts.get(rsvp.eventId) ?? 0) + 1);
    });

    return counts;
  }, [rsvps]);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return sortedEvents.filter((event) => {
      const matchesFilter =
        inventoryFilter === "all" || event.status === inventoryFilter;
      const matchesSearch =
        !normalizedSearch ||
        [
          event.title,
          event.category,
          event.location,
          event.organizer,
          event.dateLabel,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [inventoryFilter, searchValue, sortedEvents]);

  const selectedEvent = useMemo(
    () => sortedEvents.find((event) => event.id === selectedId) ?? null,
    [selectedId, sortedEvents],
  );

  const selectedEventRsvps = useMemo(
    () =>
      selectedId === "new"
        ? []
        : rsvps
            .filter((rsvp) => rsvp.eventId === selectedId)
            .sort(
              (left, right) =>
                new Date(right.createdAt).getTime() -
                new Date(left.createdAt).getTime(),
            ),
    [rsvps, selectedId],
  );

  const customDegreeCount = useMemo(
    () =>
      selectedEventRsvps.filter(
        (rsvp) => rsvp.degreeOption === "Other" && rsvp.degreeOther,
      ).length,
    [selectedEventRsvps],
  );

  const publicPath = selectedId === "new" ? "" : getEventPagePath(draft.id);

  useEffect(() => {
    if (!dashboardReady || selectedId === "new") {
      return;
    }

    const matchingEvent = sortedEvents.find((event) => event.id === selectedId);

    if (!matchingEvent) {
      setSelectedId("new");
      setDraft(buildDraft());
      return;
    }

    setDraft(buildDraft(matchingEvent));
  }, [dashboardReady, selectedId, sortedEvents]);

  function clearMessages() {
    setFeedback("");
    setErrorMessage("");
  }

  function beginNewDraft() {
    clearMessages();
    setSelectedId("new");
    setDraft(buildDraft());
  }

  function selectEvent(nextId: string) {
    clearMessages();
    setSelectedId(nextId);

    if (nextId === "new") {
      setDraft(buildDraft());
      return;
    }

    const matchingEvent = sortedEvents.find((event) => event.id === nextId);

    if (matchingEvent) {
      setDraft(buildDraft(matchingEvent));
    }
  }

  function updateDraft<K extends keyof EventItem>(key: K, value: EventItem[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function validateDraft() {
    const missingFields = requiredFields
      .filter((field) => !draft[field].trim())
      .map((field) => requiredFieldLabels[field]);

    if (!missingFields.length) {
      return "";
    }

    return `Add values for: ${missingFields.join(", ")}.`;
  }

  function saveDraft() {
    const validationMessage = validateDraft();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      setFeedback("");
      return;
    }

    const nextId = selectedId === "new" ? createEventId() : draft.id;
    const nextStatus = draft.status === "past" ? "past" : "upcoming";
    const nextEvent = buildDraft({
      ...draft,
      id: nextId,
      status: nextStatus,
      ctaLabel: getDefaultCtaLabel(nextStatus),
      ctaHref: getEventPagePath(nextId),
    });

    upsertEvent(nextEvent);
    setSelectedId(nextEvent.id);
    setDraft(nextEvent);
    setErrorMessage("");
    setFeedback(
      selectedId === "new"
        ? "Event created locally."
        : "Event changes saved locally.",
    );
  }

  function duplicateDraft() {
    const duplicatedEvent = buildDraft({
      ...draft,
      id: createEventId(),
      title: draft.title ? `${draft.title} Copy` : "Untitled Event Copy",
      featured: false,
    });

    upsertEvent(duplicatedEvent);
    setSelectedId(duplicatedEvent.id);
    setDraft(duplicatedEvent);
    setErrorMessage("");
    setFeedback("Event duplicated locally.");
  }

  function removeSelectedEvent() {
    if (selectedId === "new") {
      setDraft(buildDraft());
      setErrorMessage("");
      setFeedback("Cleared the unsaved draft.");
      return;
    }

    deleteRsvpsForEvent(selectedId);
    deleteEvent(selectedId);
    setSelectedId("new");
    setDraft(buildDraft());
    setErrorMessage("");
    setFeedback("Event and its local RSVPs were deleted.");
  }

  function restoreSeedEvents() {
    const seededEvents = resetEvents();
    pruneRsvps(seededEvents.map((event) => event.id));
    setSelectedId(seededEvents[0]?.id ?? "new");
    setDraft(buildDraft(seededEvents[0] ?? createEmptyEvent()));
    setErrorMessage("");
    setFeedback("Restored the default local event seed and pruned stale RSVPs.");
  }

  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-12 lg:px-8">
        <Reveal className="glass-panel rounded-[32px] px-8 py-10 sm:px-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <span className="glass-chip inline-flex rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-[1.8px] text-chevo-red">
                  Local Admin Mode
                </span>
                <h1 className="text-4xl font-bold tracking-[-2.4px] text-chevo-dark sm:text-5xl">
                  Event Dashboard
                </h1>
                <p className="max-w-2xl text-base leading-7 text-chevo-text-muted">
                  Create events, keep the public cards tidy, and review local
                  RSVPs from the same workspace. The public RSVP route is
                  generated automatically for each saved event.
                </p>
              </div>

              <div className="glass-inset rounded-2xl px-5 py-4 text-sm text-chevo-slate">
                <p className="font-semibold text-chevo-dark">
                  {dashboardReady
                    ? `${sortedEvents.length} events and ${rsvps.length} local RSVPs ready`
                    : "Syncing local dashboard"}
                </p>
                <p className="mt-1 text-chevo-muted-text">
                  Browser-persisted for now, ready to swap to Supabase later.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-inset rounded-[24px] px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                  Upcoming events
                </p>
                <p className="mt-3 text-3xl font-bold text-chevo-dark">
                  {events.filter((event) => event.status === "upcoming").length}
                </p>
              </div>
              <div className="glass-inset rounded-[24px] px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                  Past events
                </p>
                <p className="mt-3 text-3xl font-bold text-chevo-dark">
                  {events.filter((event) => event.status === "past").length}
                </p>
              </div>
              <div className="glass-inset rounded-[24px] px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                  Total RSVPs
                </p>
                <p className="mt-3 text-3xl font-bold text-chevo-dark">
                  {rsvps.length}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto px-6 pb-20 lg:px-8">
        {!dashboardReady ? (
          <Reveal delay={50}>
            <div className="glass-panel mx-auto max-w-[1440px] rounded-[30px] px-8 py-12">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-chevo-dark">
                  Loading local event workspace
                </h2>
                <p className="mt-3 text-sm leading-6 text-chevo-text-muted">
                  Pulling your saved events and RSVPs into the dashboard before
                  we render the editor.
                </p>
              </div>

              <div className="mt-8 grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
                <div className="glass-inset min-h-[520px] rounded-[28px]" />
                <div className="glass-inset min-h-[760px] rounded-[28px]" />
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="mx-auto grid max-w-[1440px] gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
            <Reveal delay={50}>
              <aside className="glass-panel rounded-[30px] p-6">
                <div className="flex items-start justify-between gap-4 border-b border-white/60 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-chevo-dark">
                      Event Inventory
                    </h2>
                    <p className="mt-1 text-sm text-chevo-text-muted">
                      Search, filter, and jump straight into editing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={beginNewDraft}
                    className="interactive-button rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-4 py-2 text-xs font-bold uppercase tracking-[1.2px] text-white"
                  >
                    New Event
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                      Search
                    </span>
                    <input
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                      placeholder="Search by title, category, or venue"
                    />
                  </label>

                  <div className="glass-inset inline-flex rounded-full p-1.5">
                    {(["all", "upcoming", "past"] as InventoryFilter[]).map(
                      (filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setInventoryFilter(filter)}
                          className={`interactive-button rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[1.2px] ${
                            inventoryFilter === filter
                              ? "bg-gradient-to-r from-chevo-red to-chevo-orange text-white"
                              : "text-chevo-text-muted"
                          }`}
                        >
                          {filter}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-5 max-h-[620px] space-y-3 overflow-y-auto pr-1">
                  {filteredEvents.length ? (
                    filteredEvents.map((event) => {
                      const isSelected = selectedId === event.id;
                      const rsvpCount = rsvpCountsByEvent.get(event.id) ?? 0;

                      return (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => selectEvent(event.id)}
                          className={`glass-inset w-full rounded-2xl border px-4 py-4 text-left transition-all duration-[var(--duration-base)] ease-[var(--ease-emphasized)] ${
                            isSelected
                              ? "border-chevo-red/30 bg-white/90 shadow-[0_18px_30px_rgba(255,99,74,0.12)]"
                              : "border-white/40 hover:border-chevo-red/20 hover:bg-white/88"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-sm font-bold text-chevo-dark">
                                {event.title}
                              </span>
                              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[1.1px] text-chevo-muted-text">
                                <span>{event.status}</span>
                                <span>{event.dateLabel}</span>
                                <span>{event.location}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              {event.featured ? (
                                <span className="glass-chip rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1.2px] text-chevo-red">
                                  Featured
                                </span>
                              ) : null}
                              <span className="text-[11px] font-semibold uppercase tracking-[1.1px] text-chevo-slate">
                                {rsvpCount} RSVP{rsvpCount === 1 ? "" : "s"}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="glass-inset rounded-2xl px-4 py-5 text-sm leading-6 text-chevo-text-muted">
                      No events match this filter yet.
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3 border-t border-white/60 pt-5">
                  <button
                    type="button"
                    onClick={restoreSeedEvents}
                    className="interactive-button rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[1.2px] text-chevo-dark"
                  >
                    Reset Seed
                  </button>
                </div>
              </aside>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_380px]">
                <section className="glass-panel rounded-[30px] p-6 sm:p-8">
                  <div className="flex flex-col gap-6 border-b border-white/60 pb-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-chevo-dark">
                          {selectedId === "new" ? "Create Event" : "Edit Event"}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-chevo-text-muted">
                          Keep the public cards and RSVP route consistent from
                          one editor. The public path is created automatically.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={saveDraft}
                          className="interactive-button rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-5 py-2.5 text-xs font-bold uppercase tracking-[1.3px] text-white"
                        >
                          Save Event
                        </button>
                        {selectedId !== "new" ? (
                          <button
                            type="button"
                            onClick={duplicateDraft}
                            className="interactive-button rounded-full border border-white/70 bg-white/75 px-5 py-2.5 text-xs font-bold uppercase tracking-[1.3px] text-chevo-dark"
                          >
                            Duplicate
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={beginNewDraft}
                          className="interactive-button rounded-full border border-white/70 bg-white/75 px-5 py-2.5 text-xs font-bold uppercase tracking-[1.3px] text-chevo-dark"
                        >
                          New Blank
                        </button>
                        <button
                          type="button"
                          onClick={removeSelectedEvent}
                          className="interactive-button rounded-full border border-white/70 bg-white/75 px-5 py-2.5 text-xs font-bold uppercase tracking-[1.3px] text-chevo-dark"
                        >
                          {selectedId === "new" ? "Clear Draft" : "Delete"}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="glass-inset rounded-[24px] px-5 py-4">
                        <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                          Public RSVP route
                        </p>
                        {publicPath ? (
                          <div className="mt-3">
                            <Link
                              href={publicPath}
                              className="interactive-link text-sm font-semibold text-chevo-red"
                            >
                              {publicPath}
                            </Link>
                          </div>
                        ) : (
                          <p className="mt-3 text-sm leading-6 text-chevo-text-muted">
                            Save this event first and the public RSVP route will
                            appear here.
                          </p>
                        )}
                      </div>

                      <div className="glass-inset rounded-[24px] px-5 py-4">
                        <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                          Current editor state
                        </p>
                        <p className="mt-3 text-sm leading-6 text-chevo-dark">
                          {selectedId === "new"
                            ? "You are working on a new unsaved draft."
                            : `Editing ${selectedEvent?.title ?? "selected event"}.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {feedback ? (
                    <div className="glass-inset mt-6 rounded-2xl px-4 py-3 text-sm font-medium text-chevo-dark">
                      {feedback}
                    </div>
                  ) : null}

                  {errorMessage ? (
                    <div className="mt-6 rounded-2xl border border-chevo-red/20 bg-[rgba(255,99,74,0.08)] px-4 py-3 text-sm font-medium text-chevo-red">
                      {errorMessage}
                    </div>
                  ) : null}

                  <div className="mt-8 space-y-8">
                    <section>
                      <h3 className="text-lg font-bold text-chevo-dark">
                        Basic Info
                      </h3>
                      <div className="mt-4 grid gap-5 md:grid-cols-2">
                        <label className="block md:col-span-2">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Title
                          </span>
                          <input
                            value={draft.title}
                            onChange={(event) =>
                              updateDraft("title", event.target.value)
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                            placeholder="Building my own AI Agent"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Category
                          </span>
                          <select
                            value={draft.category}
                            onChange={(event) =>
                              updateDraft("category", event.target.value)
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          >
                            <option value="Workshop">Workshop</option>
                            <option value="Social">Social</option>
                            <option value="Talk">Talk</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Organizer
                          </span>
                          <input
                            value={draft.organizer}
                            onChange={(event) =>
                              updateDraft("organizer", event.target.value)
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                            placeholder="Chevo"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Status
                          </span>
                          <select
                            value={draft.status}
                            onChange={(event) =>
                              updateDraft(
                                "status",
                                event.target.value as EventItem["status"],
                              )
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Public CTA
                          </span>
                          <div className="glass-inset rounded-2xl px-4 py-3 text-sm font-semibold text-chevo-dark">
                            {getDefaultCtaLabel(draft.status)}
                          </div>
                        </label>
                      </div>

                      <label className="glass-inset mt-5 flex items-center justify-between rounded-2xl px-4 py-4">
                        <span>
                          <span className="block text-sm font-semibold text-chevo-dark">
                            Featured event
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-chevo-text-muted">
                            Only one event can be featured per status.
                          </span>
                        </span>
                        <input
                          type="checkbox"
                          checked={draft.featured}
                          onChange={(event) =>
                            updateDraft("featured", event.target.checked)
                          }
                          className="h-4 w-4 accent-chevo-red"
                        />
                      </label>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold text-chevo-dark">
                        Schedule & Capacity
                      </h3>
                      <div className="mt-4 grid gap-5 md:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Date
                          </span>
                          <input
                            value={draft.dateLabel}
                            onChange={(event) =>
                              updateDraft("dateLabel", event.target.value)
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                            placeholder="June 1"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Time
                          </span>
                          <input
                            value={draft.timeLabel}
                            onChange={(event) =>
                              updateDraft("timeLabel", event.target.value)
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                            placeholder="18:00 - 20:00"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Location
                          </span>
                          <input
                            value={draft.location}
                            onChange={(event) =>
                              updateDraft("location", event.target.value)
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                            placeholder="Snape LT1"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Maps link / coordinates
                          </span>
                          <input
                            value={draft.locationMapValue}
                            onChange={(event) =>
                              updateDraft("locationMapValue", event.target.value)
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                            placeholder="-33.957, 18.461 or https://maps.google.com/..."
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Capacity / detail
                          </span>
                          <input
                            value={draft.capacityLabel}
                            onChange={(event) =>
                              updateDraft("capacityLabel", event.target.value)
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                            placeholder="40 seats"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Capacity status
                          </span>
                          <select
                            value={draft.capacityStatus}
                            onChange={(event) =>
                              updateDraft(
                                "capacityStatus",
                                event.target.value as EventItem["capacityStatus"],
                              )
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          >
                            <option value="high">High capacity</option>
                            <option value="medium">Medium capacity</option>
                          </select>
                        </label>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold text-chevo-dark">
                        Description & Media
                      </h3>
                      <div className="mt-4 grid gap-5">
                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Description
                          </span>
                          <textarea
                            value={draft.description}
                            onChange={(event) =>
                              updateDraft("description", event.target.value)
                            }
                            rows={5}
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                            placeholder="Describe the event clearly and specifically."
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                            Image URL
                          </span>
                          <input
                            value={draft.imageUrl}
                            onChange={(event) =>
                              updateDraft("imageUrl", event.target.value)
                            }
                            className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                            placeholder="https://..."
                          />
                        </label>
                      </div>
                    </section>
                  </div>
                </section>

                <div className="space-y-8">
                  <section className="glass-panel rounded-[30px] p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4 border-b border-white/60 pb-5">
                      <div>
                        <h2 className="text-2xl font-bold text-chevo-dark">
                          Live Preview
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-chevo-text-muted">
                          This is the same card component used on the public
                          events page.
                        </p>
                      </div>

                      <span className="glass-chip rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-[1.6px] text-chevo-red">
                        {draft.featured ? "Featured" : "Standard"}
                      </span>
                    </div>

                    <div className="mt-8">
                      <EventCard
                        event={buildDraft({
                          ...draft,
                          ctaLabel: getDefaultCtaLabel(draft.status),
                          ctaHref: publicPath || draft.ctaHref,
                        })}
                        variant={draft.featured ? "featured" : "standard"}
                      />
                    </div>
                  </section>

                  <section className="glass-panel rounded-[30px] p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4 border-b border-white/60 pb-5">
                      <div>
                        <h2 className="text-2xl font-bold text-chevo-dark">
                          RSVPs
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-chevo-text-muted">
                          Local signups for the currently selected event.
                        </p>
                      </div>

                      {selectedId !== "new" ? (
                        <span className="text-xs font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                          {selectedEventRsvps.length} RSVP
                          {selectedEventRsvps.length === 1 ? "" : "s"}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-6 space-y-4">
                      {selectedId === "new" ? (
                        <div className="glass-inset rounded-2xl px-4 py-5 text-sm leading-6 text-chevo-text-muted">
                          Save this event first and its RSVP page will be
                          created automatically.
                        </div>
                      ) : !selectedEventRsvps.length ? (
                        <div className="space-y-4">
                          <div className="glass-inset rounded-2xl px-4 py-5 text-sm leading-6 text-chevo-text-muted">
                            No one has RSVP&apos;d locally for this event yet.
                          </div>
                          <Link
                            href={publicPath}
                            className="interactive-link text-sm font-semibold text-chevo-red"
                          >
                            Open public RSVP page
                          </Link>
                        </div>
                      ) : (
                        <>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="glass-inset rounded-2xl px-4 py-4">
                              <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                                Total RSVPs
                              </p>
                              <p className="mt-2 text-2xl font-bold text-chevo-dark">
                                {selectedEventRsvps.length}
                              </p>
                            </div>
                            <div className="glass-inset rounded-2xl px-4 py-4">
                              <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                                Custom degrees
                              </p>
                              <p className="mt-2 text-2xl font-bold text-chevo-dark">
                                {customDegreeCount}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {selectedEventRsvps.map((rsvp) => (
                              <div
                                key={rsvp.id}
                                className="glass-inset rounded-2xl px-4 py-4"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-bold text-chevo-dark">
                                      {getRsvpDisplayName(rsvp)}
                                    </p>
                                    <p className="mt-1 text-sm text-chevo-text-muted">
                                      {rsvp.email}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[1.1px] text-chevo-muted-text">
                                      {rsvp.degreeOption ? (
                                        <span>
                                          {rsvp.degreeOption === "Other" &&
                                          rsvp.degreeOther
                                            ? rsvp.degreeOther
                                            : rsvp.degreeOption}
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => deleteRsvp(rsvp.id)}
                                    className="interactive-button rounded-full border border-white/70 bg-white/75 px-3 py-2 text-[11px] font-bold uppercase tracking-[1.1px] text-chevo-dark"
                                  >
                                    Remove
                                  </button>
                                </div>

                                {rsvp.degreeOption === "Other" && rsvp.degreeOther ? (
                                  <div className="mt-4 space-y-2 text-sm leading-6 text-chevo-text-muted">
                                    <p>Custom degree entry: {rsvp.degreeOther}</p>
                                  </div>
                                ) : null}

                                <p className="mt-4 text-[11px] font-bold uppercase tracking-[1.1px] text-chevo-muted-text">
                                  Submitted {formatTimestamp(rsvp.createdAt)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </section>
    </div>
  );
}
