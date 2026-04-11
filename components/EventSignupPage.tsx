"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Reveal from "@/components/Reveal";
import { useLocalEvents } from "@/components/useLocalEvents";
import { useLocalRsvps } from "@/components/useLocalRsvps";
import { defaultEvents, getGoogleMapsHref } from "@/lib/events";
import {
  DEGREE_OPTIONS,
  createEmptyRsvp,
  getRsvpDisplayName,
  normalizeRsvp,
  type EventRsvp,
} from "@/lib/rsvps";

type EventSignupPageProps = {
  eventId: string;
};

const requiredFieldLabels = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email address",
  degreeOption: "Where you fit in",
} satisfies Record<string, string>;

type RsvpDraft = Omit<EventRsvp, "id" | "createdAt">;

function buildDraft(eventId: string): RsvpDraft {
  const fallback = createEmptyRsvp(eventId);

  return {
    eventId,
    firstName: fallback.firstName,
    lastName: fallback.lastName,
    email: fallback.email,
    degreeOption: fallback.degreeOption,
    degreeOther: fallback.degreeOther,
  };
}

export default function EventSignupPage({ eventId }: EventSignupPageProps) {
  const { events, isReady: areEventsReady } = useLocalEvents();
  const { isReady: areRsvpsReady, addRsvp } = useLocalRsvps();
  const [draft, setDraft] = useState<RsvpDraft>(() => buildDraft(eventId));
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedRsvp, setSubmittedRsvp] = useState<EventRsvp | null>(null);
  const pageReady = areEventsReady && areRsvpsReady;

  const previewEvent = useMemo(
    () =>
      events.find((item) => item.id === eventId) ??
      defaultEvents.find((item) => item.id === eventId) ??
      null,
    [eventId, events],
  );

  const event = useMemo(
    () =>
      pageReady
        ? events.find((item) => item.id === eventId) ?? null
        : previewEvent,
    [eventId, events, pageReady, previewEvent],
  );

  const locationHref = getGoogleMapsHref(event?.locationMapValue);
  const capacityBadgeClasses =
    event?.capacityStatus === "medium"
      ? "border-[rgba(255,166,87,0.5)] bg-[rgba(255,242,231,0.9)] text-[rgb(184,96,18)] shadow-[0_16px_32px_-22px_rgba(255,166,87,0.9),inset_0_1px_0_rgba(255,255,255,0.75)]"
      : "border-[rgba(111,215,146,0.42)] bg-[rgba(237,255,243,0.9)] text-[rgb(28,122,69)] shadow-[0_16px_32px_-22px_rgba(111,215,146,0.9),inset_0_1px_0_rgba(255,255,255,0.75)]";
  const capacityBadgeLabel =
    event?.capacityStatus === "medium" ? "Medium Capacity" : "High Capacity";
  const backButtonClassName =
    "glass-button interactive-button inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[1.3px] text-chevo-dark";

  function updateField<K extends keyof RsvpDraft>(key: K, value: RsvpDraft[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleInputChange(
    key: keyof RsvpDraft,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const nextValue =
      event.target instanceof HTMLInputElement &&
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    if (key === "degreeOption") {
      setDraft((current) => ({
        ...current,
        degreeOption: nextValue as string,
        degreeOther: nextValue === "Other" ? current.degreeOther : "",
      }));
      return;
    }

    updateField(key, nextValue as RsvpDraft[typeof key]);
  }

  function validateDraft() {
    const missingFields = Object.entries(requiredFieldLabels)
      .filter(([field]) => !draft[field as keyof typeof draft].toString().trim())
      .map(([, label]) => label);

    if (draft.degreeOption === "Other" && !draft.degreeOther.trim()) {
      missingFields.push("Did we miss you?");
    }

    if (!missingFields.length) {
      return "";
    }

    return `Add values for: ${missingFields.join(", ")}.`;
  }

  function handleSubmit(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();

    if (!pageReady) {
      setErrorMessage("Still loading the local RSVP workspace. Try again.");
      return;
    }

    if (!event) {
      setErrorMessage("This event could not be found.");
      return;
    }

    const validationMessage = validateDraft();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    const nextRsvp = normalizeRsvp(
      {
        ...draft,
        eventId: event.id,
      },
      0,
    );

    const result = addRsvp(nextRsvp);

    if (result.status === "duplicate") {
      setErrorMessage(
        "An RSVP with this email already exists for this event. If you need to update it, clear it locally in the admin dashboard first.",
      );
      return;
    }

    setSubmittedRsvp(result.rsvp);
    setErrorMessage("");
    setDraft(buildDraft(event.id));
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-chevo-bg font-grotesk">
        <section className="mx-auto max-w-[900px] px-6 pt-20 pb-20 text-center lg:px-8">
          <div className="glass-panel rounded-[32px] px-8 py-14">
            <p className="text-xs font-bold uppercase tracking-[1.6px] text-chevo-muted-text">
              Event not found
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-2.2px] text-chevo-dark">
              This event isn&apos;t available right now
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-chevo-text-muted">
              The event may have been removed locally or the link may no longer
              match the current event list.
            </p>
            <div className="mt-8">
              <Link
                href="/events"
                className={backButtonClassName}
              >
                Back to Events
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <section className="mx-auto max-w-[980px] px-6 pt-16 pb-20 lg:px-8">
        <div className="mb-8">
          <Link
            href="/events"
            className={backButtonClassName}
          >
            Back to Events
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          <Reveal className="glass-panel rounded-[30px] px-8 py-8 sm:px-10 sm:py-10">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <h1 className="text-4xl font-bold tracking-[-2px] text-chevo-dark sm:text-[42px] sm:leading-[46px]">
                    {event.title}
                  </h1>
                </div>

                <div
                  className={`inline-flex items-center justify-center rounded-[20px] border px-4 py-3 text-sm font-bold uppercase tracking-[1.2px] ${capacityBadgeClasses}`}
                >
                  {capacityBadgeLabel}
                </div>
              </div>

              <p className="max-w-4xl text-base leading-7 text-chevo-text-muted">
                {event.description}
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="glass-inset rounded-2xl px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                    Date
                  </p>
                  <p className="mt-2 text-lg font-semibold text-chevo-dark">
                    {event.dateLabel}
                  </p>
                </div>
                <div className="glass-inset rounded-2xl px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                    Time
                  </p>
                  <p className="mt-2 text-lg font-semibold text-chevo-dark">
                    {event.timeLabel}
                  </p>
                </div>
                <div className="glass-inset rounded-2xl px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                    Location
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-lg font-semibold text-chevo-dark">
                      {event.location}
                    </p>
                    {locationHref ? (
                      <a
                        href={locationHref}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${event.location} in Google Maps`}
                        className="interactive-link inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-lg"
                      >
                        📍
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="glass-inset rounded-2xl px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                    Capacity
                  </p>
                  <p className="mt-2 text-lg font-semibold text-chevo-dark">
                    {event.capacityLabel}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="glass-panel rounded-[30px] px-8 py-8 sm:px-10 sm:py-10">
              {!pageReady ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[1.6px] text-chevo-muted-text">
                      Loading signup
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-[-1.8px] text-chevo-dark">
                      Checking the local RSVP workspace
                    </h2>
                    <p className="mt-3 text-base leading-7 text-chevo-text-muted">
                      We&apos;re confirming the latest local event state before
                      opening the RSVP form so the details stay accurate.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="glass-inset min-h-[88px] rounded-2xl" />
                    <div className="glass-inset min-h-[88px] rounded-2xl" />
                    <div className="glass-inset min-h-[88px] rounded-2xl sm:col-span-2" />
                  </div>
                </div>
              ) : submittedRsvp ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[1.6px] text-chevo-red">
                      RSVP received
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-[-1.8px] text-chevo-dark">
                      You&apos;re on the list for {event.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-chevo-text-muted">
                      We&apos;ve saved your RSVP locally for now. Once Supabase
                      is connected, this same flow can be switched over to a
                      shared backend.
                    </p>
                  </div>

                  <div className="glass-inset rounded-[24px] px-5 py-5">
                    <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                      RSVP summary
                    </p>
                    <p className="mt-3 text-sm leading-6 text-chevo-dark">
                      Name:{" "}
                      <span className="font-semibold">
                        {getRsvpDisplayName(submittedRsvp)}
                      </span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-chevo-dark">
                      Email: <span className="font-semibold">{submittedRsvp.email}</span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-chevo-dark">
                      Where you fit in:{" "}
                      <span className="font-semibold">
                        {submittedRsvp.degreeOption === "Other" &&
                        submittedRsvp.degreeOther
                          ? submittedRsvp.degreeOther
                          : submittedRsvp.degreeOption}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmittedRsvp(null)}
                      className="interactive-button rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-3 text-sm font-bold uppercase tracking-[1.3px] text-white"
                    >
                      Add another RSVP
                    </button>
                    <Link
                      href="/events"
                      className={backButtonClassName}
                    >
                      Back to Events
                    </Link>
                  </div>
                </div>
              ) : event.status === "past" ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[1.6px] text-chevo-muted-text">
                      Event closed
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-[-1.8px] text-chevo-dark">
                      This session has already happened
                    </h2>
                    <p className="mt-3 text-base leading-7 text-chevo-text-muted">
                      RSVPs are closed for past events, but we&apos;re keeping
                      the page live so the context and details stay easy to
                      reference.
                    </p>
                  </div>

                  <div className="glass-inset rounded-[24px] px-5 py-5">
                    <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                      Want updates on the next one?
                    </p>
                    <p className="mt-3 text-sm leading-6 text-chevo-dark">
                      Join the mailing list to hear about the next workshop,
                      social, or build session.
                    </p>
                    <div className="mt-5">
                      <a
                        href="https://mailchi.mp/82be5e27abf3/chevocollective"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interactive-button inline-flex items-center justify-center rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-3 text-sm font-bold uppercase tracking-[1.3px] text-white"
                      >
                        Join the mailing list
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[1.6px] text-chevo-red">
                      RSVP Form
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-[-1.8px] text-chevo-dark">
                      Save your spot
                    </h2>
                    <p className="mt-3 text-base leading-7 text-chevo-text-muted">
                      Keep this light and simple. We only ask for the details we
                      need to plan the room and keep you updated.
                    </p>
                  </div>

                  {errorMessage ? (
                    <div className="rounded-2xl border border-chevo-red/20 bg-[rgba(255,99,74,0.08)] px-4 py-3 text-sm font-medium text-chevo-red">
                      {errorMessage}
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          First Name
                        </span>
                        <input
                          name="firstName"
                          value={draft.firstName}
                          onChange={(event) => handleInputChange("firstName", event)}
                          autoComplete="given-name"
                          required
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="Jane"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Last Name
                        </span>
                        <input
                          name="lastName"
                          value={draft.lastName}
                          onChange={(event) => handleInputChange("lastName", event)}
                          autoComplete="family-name"
                          required
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="Doe"
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Email Address (personal)
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={draft.email}
                          onChange={(event) => handleInputChange("email", event)}
                          autoComplete="email"
                          required
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="you@myuct.ac.za"
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Where do you fit in?
                        </span>
                        <select
                          name="degreeOption"
                          value={draft.degreeOption}
                          onChange={(event) => handleInputChange("degreeOption", event)}
                          required
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                        >
                          <option value="">Select an option</option>
                          {DEGREE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Did we miss you? 🤔 (If you chose other)
                        </span>
                        <input
                          name="degreeOther"
                          value={draft.degreeOther}
                          onChange={(event) =>
                            handleInputChange("degreeOther", event)
                          }
                          disabled={draft.degreeOption !== "Other"}
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="Enter your degree or faculty"
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="interactive-button inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-3.5 text-sm font-bold uppercase tracking-[1.3px] text-white"
                    >
                      Submit RSVP
                    </button>
                  </form>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
