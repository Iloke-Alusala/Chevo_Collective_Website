"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import { useLocalEvents } from "@/components/useLocalEvents";
import { useLocalRsvps } from "@/components/useLocalRsvps";
import { defaultEvents } from "@/lib/events";
import { createEmptyRsvp, normalizeRsvp, type EventRsvp } from "@/lib/rsvps";

type EventSignupPageProps = {
  eventId: string;
};

const requiredFieldLabels = {
  fullName: "Full name",
  email: "Email address",
  facultyOrDegree: "Faculty or degree",
} satisfies Record<string, string>;

type RsvpDraft = Omit<EventRsvp, "id" | "createdAt">;

function buildDraft(eventId: string): RsvpDraft {
  const fallback = createEmptyRsvp(eventId);

  return {
    eventId,
    fullName: fallback.fullName,
    email: fallback.email,
    phone: fallback.phone,
    studentNumber: fallback.studentNumber,
    facultyOrDegree: fallback.facultyOrDegree,
    yearOfStudy: fallback.yearOfStudy,
    dietaryRequirements: fallback.dietaryRequirements,
    accessibilityNeeds: fallback.accessibilityNeeds,
    notes: fallback.notes,
    newsletterOptIn: fallback.newsletterOptIn,
  };
}

export default function EventSignupPage({ eventId }: EventSignupPageProps) {
  const { events, isReady: areEventsReady } = useLocalEvents();
  const { rsvps, isReady: areRsvpsReady, addRsvp } = useLocalRsvps();
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

  const existingRsvpCount = useMemo(
    () =>
      pageReady ? rsvps.filter((item) => item.eventId === eventId).length : null,
    [eventId, pageReady, rsvps],
  );

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

    updateField(key, nextValue as RsvpDraft[typeof key]);
  }

  function validateDraft() {
    const missingFields = Object.entries(requiredFieldLabels)
      .filter(([field]) => !draft[field as keyof typeof draft].toString().trim())
      .map(([, label]) => label);

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
                className="interactive-button inline-flex items-center justify-center rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-3 text-sm font-bold uppercase tracking-[1.3px] text-white"
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
      <section className="mx-auto max-w-[1120px] px-6 pt-16 pb-20 lg:px-8">
        <div className="mb-8">
          <Link
            href="/events"
            className="interactive-link text-sm font-semibold text-chevo-red"
          >
            Back to events
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="glass-panel overflow-hidden rounded-[30px]">
            <div className="relative aspect-[16/12] overflow-hidden">
              <SmartImage
                src={event.imageUrl}
                alt={event.title}
                priority
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="space-y-6 p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="glass-chip rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[1px] text-[#640600]">
                  {event.category}
                </span>
                <span className="glass-chip rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1px] text-chevo-dark">
                  {event.organizer}
                </span>
                <span className="glass-chip rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1px] text-chevo-slate">
                  {event.status}
                </span>
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-[-2px] text-chevo-dark">
                  {event.title}
                </h1>
                <p className="mt-4 text-base leading-7 text-chevo-text-muted">
                  {event.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
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
                  <p className="mt-2 text-lg font-semibold text-chevo-dark">
                    {event.location}
                  </p>
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

              <div className="glass-inset rounded-2xl px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                  Local preview stats
                </p>
                {existingRsvpCount === null ? (
                  <p className="mt-2 text-base font-semibold text-chevo-dark">
                    Checking local RSVP count...
                  </p>
                ) : (
                  <p className="mt-2 text-base font-semibold text-chevo-dark">
                    {existingRsvpCount} RSVP{existingRsvpCount === 1 ? "" : "s"} recorded on this browser
                  </p>
                )}
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
                      Name: <span className="font-semibold">{submittedRsvp.fullName}</span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-chevo-dark">
                      Email: <span className="font-semibold">{submittedRsvp.email}</span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-chevo-dark">
                      Newsletter:{" "}
                      <span className="font-semibold">
                        {submittedRsvp.newsletterOptIn ? "Yes" : "No"}
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
                      className="interactive-button rounded-full border border-white/70 bg-white/75 px-6 py-3 text-sm font-bold uppercase tracking-[1.3px] text-chevo-dark"
                    >
                      Back to events
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
                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Full name
                        </span>
                        <input
                          name="fullName"
                          value={draft.fullName}
                          onChange={(event) => handleInputChange("fullName", event)}
                          autoComplete="name"
                          required
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="Your name"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Email address
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

                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Phone
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={draft.phone}
                          onChange={(event) => handleInputChange("phone", event)}
                          autoComplete="tel"
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="+27 ..."
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Student number
                        </span>
                        <input
                          name="studentNumber"
                          value={draft.studentNumber}
                          onChange={(event) =>
                            handleInputChange("studentNumber", event)
                          }
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="Optional"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Faculty or degree
                        </span>
                        <input
                          name="facultyOrDegree"
                          value={draft.facultyOrDegree}
                          onChange={(event) =>
                            handleInputChange("facultyOrDegree", event)
                          }
                          required
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="Electrical Engineering"
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Year of study
                        </span>
                        <select
                          name="yearOfStudy"
                          value={draft.yearOfStudy}
                          onChange={(event) =>
                            handleInputChange("yearOfStudy", event)
                          }
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                        >
                          <option value="">Select a year</option>
                          <option value="1st year">1st year</option>
                          <option value="2nd year">2nd year</option>
                          <option value="3rd year">3rd year</option>
                          <option value="4th year">4th year</option>
                          <option value="Postgrad">Postgrad</option>
                          <option value="Other">Other</option>
                        </select>
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Dietary requirements
                        </span>
                        <input
                          name="dietaryRequirements"
                          value={draft.dietaryRequirements}
                          onChange={(event) =>
                            handleInputChange("dietaryRequirements", event)
                          }
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="Optional"
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Accessibility needs
                        </span>
                        <input
                          name="accessibilityNeeds"
                          value={draft.accessibilityNeeds}
                          onChange={(event) =>
                            handleInputChange("accessibilityNeeds", event)
                          }
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="Optional"
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                          Anything you want from this event?
                        </span>
                        <textarea
                          name="notes"
                          value={draft.notes}
                          onChange={(event) => handleInputChange("notes", event)}
                          rows={4}
                          className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                          placeholder="Optional notes, questions, or context"
                        />
                      </label>
                    </div>

                    <label className="glass-inset flex items-start gap-3 rounded-2xl px-4 py-4">
                      <input
                        type="checkbox"
                        name="newsletterOptIn"
                        checked={draft.newsletterOptIn}
                        onChange={(event) =>
                          handleInputChange("newsletterOptIn", event)
                        }
                        className="mt-1 h-4 w-4 accent-chevo-red"
                      />
                      <span className="text-sm leading-6 text-chevo-dark">
                        Add me to the Chevo mailing list as well so I hear about
                        future workshops, socials, and project nights.
                      </span>
                    </label>

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
