"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import EventCard from "@/components/EventCard";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import { defaultEvents, type EventStatus } from "@/lib/events";

const tagOptions = [
  { value: "all", label: "All tags" },
  { value: "workshop", label: "Workshop" },
  { value: "social", label: "Social" },
  { value: "talks", label: "Talks" },
] as const;

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventStatus>("upcoming");
  const [activeTag, setActiveTag] = useState("all");
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const tagMenuRef = useRef<HTMLDivElement | null>(null);
  const selectedTagLabel =
    tagOptions.find((option) => option.value === activeTag)?.label ?? "All tags";

  useEffect(() => {
    if (!isTagMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        tagMenuRef.current &&
        !tagMenuRef.current.contains(event.target as Node)
      ) {
        setIsTagMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsTagMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTagMenuOpen]);

  const upcomingEvents = useMemo(
    () =>
      defaultEvents.filter(
        (event) => {
          const normalizedCategory = event.category.trim().toLowerCase();
          const tagMatch =
            activeTag === "all"
              ? true
              : activeTag === "talks"
                ? normalizedCategory === "talk" ||
                  normalizedCategory === "talks"
                : normalizedCategory === activeTag;

          return event.status === "upcoming" && tagMatch;
        },
      ),
    [activeTag],
  );
  const pastEvents = useMemo(
    () =>
      defaultEvents.filter(
        (event) => {
          const normalizedCategory = event.category.trim().toLowerCase();
          const tagMatch =
            activeTag === "all"
              ? true
              : activeTag === "talks"
                ? normalizedCategory === "talk" ||
                  normalizedCategory === "talks"
                : normalizedCategory === activeTag;

          return event.status === "past" && tagMatch;
        },
      ),
    [activeTag],
  );

  const featuredUpcomingEvent =
    upcomingEvents.find((event) => event.featured) ?? upcomingEvents[0];
  const standardUpcomingEvents = featuredUpcomingEvent
    ? upcomingEvents.filter((event) => event.id !== featuredUpcomingEvent.id)
    : [];

  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <section className="mx-auto max-w-[1280px] px-6 pt-16 pb-4 lg:px-8">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <div
            className="motion-panel-enter lg:col-span-7"
            style={{ animationDelay: "40ms" }}
          >
            <div className="flex flex-col gap-4 pb-8">
              <h1 className="text-6xl leading-none font-bold tracking-[-4.8px] sm:text-8xl lg:text-[96px]">
                <span className="text-chevo-dark">Chevo</span>
                <br />
                <span className="text-chevo-orange">Events</span>
              </h1>
              <p className="max-w-[560px] pt-4 text-lg leading-[29px] text-chevo-text-muted">
                Workshops, socials, and presentations, all in one place. These
                are the current public Chevo events available right now.
              </p>
            </div>
          </div>

          <div
            className="motion-panel-enter lg:col-span-5"
            style={{ animationDelay: "140ms" }}
          >
            <div className="relative flex items-end justify-center">
              <div className="ambient-orb pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-xl bg-gradient-to-br from-chevo-red to-chevo-orange opacity-30 blur-[32px]" />
              <div className="glass-panel interactive-media relative rotate-2 overflow-hidden rounded-[28px]">
                <div className="relative aspect-[4/5] max-h-[500px] w-full">
                  <SmartImage
                    src="https://api.builder.io/api/v1/image/assets/TEMP/93fc97193583200a61fd70b8fa239ac5cd8eaf6f?width=934"
                    alt="Creative workshop"
                    priority
                    sizes="(min-width: 1024px) 32vw, 100vw"
                    className="aspect-[4/5] h-auto max-h-[500px] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="glass-inset inline-flex w-full rounded-full p-1 lg:w-auto">
            <button
              type="button"
              aria-pressed={activeTab === "upcoming"}
              onClick={() => setActiveTab("upcoming")}
              className={`interactive-button flex-1 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.4px] lg:flex-none ${
                activeTab === "upcoming"
                  ? "bg-gradient-to-r from-chevo-red to-chevo-orange text-white shadow-[0_10px_18px_rgba(177,44,25,0.16)]"
                  : "text-chevo-text-muted hover:text-chevo-dark"
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              aria-pressed={activeTab === "past"}
              onClick={() => setActiveTab("past")}
              className={`interactive-button flex-1 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.4px] lg:flex-none ${
                activeTab === "past"
                  ? "bg-gradient-to-r from-chevo-red to-chevo-orange text-white shadow-[0_10px_18px_rgba(177,44,25,0.16)]"
                  : "text-chevo-text-muted hover:text-chevo-dark"
              }`}
            >
              Past
            </button>
          </div>

          <div ref={tagMenuRef} className="relative w-full sm:w-auto sm:min-w-[160px]">
            <button
              type="button"
              aria-expanded={isTagMenuOpen}
              aria-haspopup="listbox"
              aria-label="Filter events by tag"
              onClick={() => setIsTagMenuOpen((current) => !current)}
              className="glass-inset interactive-button flex w-full items-center justify-between gap-3 rounded-full px-4 py-1 text-left"
            >
              <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-chevo-dark">
                {selectedTagLabel}
              </span>
              <span
                className={`pointer-events-none text-[10px] text-chevo-muted-text transition-transform duration-300 ${
                  isTagMenuOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isTagMenuOpen ? (
              <div className="glass-dropdown-panel absolute top-[calc(100%+0.5rem)] right-0 z-30 w-full rounded-[20px] p-1.5">
                <ul role="listbox" aria-label="Event tags" className="space-y-0.5">
                  {tagOptions.map((option, index) => {
                    const isActive = option.value === activeTag;

                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          style={{ animationDelay: `${index * 48}ms` }}
                          onClick={() => {
                            setActiveTag(option.value);
                            setIsTagMenuOpen(false);
                          }}
                          className={`glass-dropdown-option dropdown-ladder-item interactive-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[1.15px] ${
                            isActive
                              ? "bg-[rgba(255,255,255,0.92)] text-chevo-dark shadow-[0_14px_24px_-20px_rgba(26,28,29,0.3)]"
                              : "text-chevo-text-muted"
                          }`}
                        >
                          <span>{option.label}</span>
                          {isActive ? (
                            <span className="text-chevo-orange">•</span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
        <div key={activeTab} id="events-panel" className="motion-panel-enter">
          {activeTab === "upcoming" ? (
            upcomingEvents.length ? (
              <div className="flex flex-col gap-8">
                {featuredUpcomingEvent ? (
                  <Reveal>
                    <EventCard event={featuredUpcomingEvent} variant="featured" />
                  </Reveal>
                ) : null}

                {standardUpcomingEvents.map((event, index) => (
                  <Reveal key={event.id} delay={90 + index * 70}>
                    <EventCard event={event} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-[28px] px-8 py-14 text-center text-lg font-medium text-chevo-muted-text">
                No upcoming events are live right now. Check back soon.
              </div>
            )
          ) : pastEvents.length ? (
            <div className="flex flex-col gap-8">
              {pastEvents.map((event, index) => (
                <Reveal key={event.id} delay={60 + index * 70}>
                  <EventCard
                    event={event}
                    variant={event.featured ? "featured" : "standard"}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-[28px] px-8 py-14 text-center text-lg font-medium text-chevo-muted-text">
              Past event recaps will appear here once the first sessions wrap.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-chevo-red to-chevo-orange px-10 py-16 text-center sm:px-16">
            <div className="ambient-orb ambient-orb-slow pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/10 blur-[32px]" />

            <div className="relative flex flex-col items-center gap-6">
              <h2 className="text-4xl font-black uppercase tracking-[-2.4px] text-white sm:text-5xl">
                Propose an Event
              </h2>
              <p className="max-w-[672px] text-base leading-7 text-white/90 sm:text-lg">
                Got an idea for a workshop, talk, or build session? We&apos;re
                always looking for new ways to grow the community.
              </p>
              <a
                href="mailto:chevocollective@gmail.com"
                className="interactive-button inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-bold uppercase tracking-[1.4px] text-chevo-red shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] hover:bg-white/90"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
