"use client";

import Link from "next/link";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import EventCard from "@/components/EventCard";
import {
  buildAdminEventDraft,
  buildPreviewEventFromDraft,
  createEmptyAdminEventDraft,
  DATABASE_EVENT_TYPES,
  validateAdminEventDraft,
  type AdminEventDraft,
  type DatabaseEventRecord,
} from "@/lib/admin-events";
import { slugifyText } from "@/lib/events";

type AdminEventEditorProps = {
  mode: "create" | "edit";
  initialEvent?: DatabaseEventRecord | null;
  initialSuccessMessage?: string;
};

function buildInitialDraft(initialEvent?: DatabaseEventRecord | null) {
  return initialEvent ? buildAdminEventDraft(initialEvent) : createEmptyAdminEventDraft();
}

export default function AdminEventEditor({
  mode,
  initialEvent = null,
  initialSuccessMessage = "",
}: AdminEventEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState<AdminEventDraft>(() =>
    buildInitialDraft(initialEvent),
  );
  const [hasTouchedSlug, setHasTouchedSlug] = useState(
    Boolean(initialEvent?.slug),
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(initialSuccessMessage);

  const previewEvent = useMemo(() => buildPreviewEventFromDraft(draft), [draft]);

  function updateDraft<K extends keyof AdminEventDraft>(
    key: K,
    value: AdminEventDraft[K],
  ) {
    setDraft((current) => {
      const nextDraft = {
        ...current,
        [key]: value,
      };

      if (key === "title" && !hasTouchedSlug) {
        nextDraft.slug = slugifyText(String(value));
      }

      return nextDraft;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationMessage = validateAdminEventDraft(draft);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    const endpoint =
      mode === "create"
        ? "/api/admin/events"
        : `/api/admin/events/${encodeURIComponent(draft.id)}`;
    const method = mode === "create" ? "POST" : "PATCH";

    startTransition(async () => {
      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draft),
        });

        const payload = (await response.json()) as {
          error?: string;
          event?: DatabaseEventRecord;
        };

        if (!response.ok || !payload.event) {
          setErrorMessage(payload.error || "We could not save this event.");
          return;
        }

        if (mode === "create") {
          router.push(`/admin/events/${payload.event.id}?saved=created`);
          return;
        }

        setDraft(buildAdminEventDraft(payload.event));
        setSuccessMessage("Event changes saved to the database.");
      } catch {
        setErrorMessage(
          "The save request failed before it reached Supabase. Try again.",
        );
      }
    });
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_420px]">
      <section className="glass-panel rounded-[30px] p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-white/60 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
              {mode === "create" ? "Create event" : "Edit event"}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-1.8px] text-chevo-dark">
              {mode === "create" ? "Create Event" : draft.title || "Edit Event"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-chevo-text-muted">
              Save event records to the database and preview the public-facing
              event card before anything goes live later.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/events"
              className="glass-button interactive-button inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[1.3px] text-chevo-dark"
            >
              View All Events
            </Link>
          </div>
        </div>

        {successMessage ? (
          <div className="glass-inset mt-6 rounded-2xl px-4 py-3 text-sm font-medium text-chevo-dark">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-chevo-red/20 bg-[rgba(255,99,74,0.08)] px-4 py-3 text-sm font-medium text-chevo-red">
            {errorMessage}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-chevo-dark">Basic Info</h2>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Title
                </span>
                <input
                  value={draft.title}
                  onChange={(nextEvent) => updateDraft("title", nextEvent.target.value)}
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                  placeholder="Building my own AI Agent"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Slug
                </span>
                <input
                  value={draft.slug}
                  onChange={(nextEvent) => {
                    setHasTouchedSlug(true);
                    updateDraft("slug", slugifyText(nextEvent.target.value));
                  }}
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                  placeholder="ai-agent-workshop"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Event Type
                </span>
                <select
                  value={draft.eventType}
                  onChange={(nextEvent) =>
                    updateDraft("eventType", nextEvent.target.value as AdminEventDraft["eventType"])
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                >
                  {DATABASE_EVENT_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Organizer
                </span>
                <input
                  value={draft.organizerName}
                  onChange={(nextEvent) =>
                    updateDraft("organizerName", nextEvent.target.value)
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                  placeholder="Chevo"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Description
                </span>
                <textarea
                  value={draft.description}
                  onChange={(nextEvent) =>
                    updateDraft("description", nextEvent.target.value)
                  }
                  rows={5}
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                  placeholder="Describe the event clearly and specifically."
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-chevo-dark">
              Schedule & Capacity
            </h2>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Event date & time
                </span>
                <input
                  type="datetime-local"
                  value={draft.eventDatetime}
                  onChange={(nextEvent) =>
                    updateDraft("eventDatetime", nextEvent.target.value)
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Date label
                </span>
                <input
                  value={draft.dateLabel}
                  onChange={(nextEvent) =>
                    updateDraft("dateLabel", nextEvent.target.value)
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                  placeholder="June 1"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Time label
                </span>
                <input
                  value={draft.timeLabel}
                  onChange={(nextEvent) =>
                    updateDraft("timeLabel", nextEvent.target.value)
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                  placeholder="18:00 - 20:00"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Capacity detail
                </span>
                <input
                  value={draft.capacityLabel}
                  onChange={(nextEvent) =>
                    updateDraft("capacityLabel", nextEvent.target.value)
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
                  onChange={(nextEvent) =>
                    updateDraft(
                      "capacityStatus",
                      nextEvent.target.value as AdminEventDraft["capacityStatus"],
                    )
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                >
                  <option value="high">High capacity</option>
                  <option value="medium">Medium capacity</option>
                </select>
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Location text
                </span>
                <input
                  value={draft.locationText}
                  onChange={(nextEvent) =>
                    updateDraft("locationText", nextEvent.target.value)
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                  placeholder="Snape LT1"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Maps link / coordinates
                </span>
                <input
                  value={draft.googleMapsValue}
                  onChange={(nextEvent) =>
                    updateDraft("googleMapsValue", nextEvent.target.value)
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                  placeholder="-33.957, 18.461 or https://maps.google.com/..."
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-chevo-dark">
              Media & Publishing
            </h2>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                  Image URL
                </span>
                <input
                  value={draft.imageUrl}
                  onChange={(nextEvent) =>
                    updateDraft("imageUrl", nextEvent.target.value)
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                  placeholder="https://..."
                />
              </label>

              <label className="glass-inset flex items-center justify-between rounded-2xl px-4 py-4 md:col-span-2">
                <span>
                  <span className="block text-sm font-semibold text-chevo-dark">
                    Featured event
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-chevo-text-muted">
                    Supabase enforces one featured event per upcoming/past side.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={draft.isFeatured}
                  onChange={(nextEvent) =>
                    updateDraft("isFeatured", nextEvent.target.checked)
                  }
                  className="h-4 w-4 accent-chevo-red"
                />
              </label>
            </div>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-white/60 pt-6">
            <button
              type="submit"
              disabled={isPending}
              className="interactive-button inline-flex items-center justify-center rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-3 text-sm font-bold uppercase tracking-[1.3px] text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Event"
                  : "Save Changes"}
            </button>
            <Link
              href="/admin"
              className="glass-button interactive-button inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[1.3px] text-chevo-dark"
            >
              Back to Admin
            </Link>
          </div>
        </form>
      </section>

      <aside className="glass-panel rounded-[30px] p-6 sm:p-8">
        <div className="border-b border-white/60 pb-5">
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
            Live preview
          </p>
          <h2 className="mt-2 text-2xl font-bold text-chevo-dark">
            Public Event Card
          </h2>
          <p className="mt-3 text-sm leading-6 text-chevo-text-muted">
            This mirrors the public `Events` page card layout. New database
            events won&apos;t appear on the public site until we switch public
            event reads over in a later phase.
          </p>
          <p className="mt-2 text-xs leading-5 text-chevo-muted-text">
            The call-to-action is disabled here so the preview stays in the
            editor instead of navigating away.
          </p>
        </div>

        <div className="mt-8">
          <EventCard
            event={previewEvent}
            variant={draft.isFeatured ? "featured" : "standard"}
            disableCta
          />
        </div>
      </aside>
    </div>
  );
}
