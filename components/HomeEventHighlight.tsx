"use client";

import Link from "next/link";
import { useMemo } from "react";
import { defaultEvents, getEventAnchorPath } from "@/lib/events";

export default function HomeEventHighlight() {
  const featuredUpcomingEvent = useMemo(() => {
    const upcomingEvents = defaultEvents.filter(
      (event) => event.status === "upcoming",
    );

    return upcomingEvents.find((event) => event.featured) ?? upcomingEvents[0];
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      <span className="text-xs font-bold uppercase tracking-[3.6px] text-chevo-red">
        By Students, For Students
      </span>

      <h2 className="text-4xl leading-tight font-bold tracking-[-1.4px] sm:text-5xl lg:text-[56px] lg:leading-[56px]">
        <span className="text-chevo-dark">&quot;A lab where </span>
        <span className="text-chevo-orange">cooler stuff</span>
        <span className="text-chevo-dark"> actually gets built.&quot;</span>
      </h2>

      <p className="pt-4 text-lg leading-[29px] text-chevo-text-muted">
        We&apos;re UCT students who got tired of waiting for the curriculum to
        catch up. The Chevo Collective is our answer, a hands-on community
        where you can build an LLM, a drone, or a rover without waiting for
        permission.
      </p>

      <div className="grid gap-6 pt-6 sm:grid-cols-2">
        <div className="glass-inset rounded-[24px] px-5 py-5">
          <p className="text-3xl leading-10 font-bold text-chevo-dark">
            {featuredUpcomingEvent
              ? `FIRST EVENT ${featuredUpcomingEvent.dateLabel.toUpperCase()}`
              : "FIRST EVENT LOADING"}
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
            {featuredUpcomingEvent
              ? featuredUpcomingEvent.title
              : "Preparing featured event"}
          </p>

          <div className="mt-5">
            {featuredUpcomingEvent ? (
              <Link
                href={getEventAnchorPath(featuredUpcomingEvent.slug)}
                className="interactive-button inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-5 py-3 text-xs font-bold uppercase tracking-[1.2px] text-white"
              >
                Sign Up Now
              </Link>
            ) : (
              <span className="inline-flex rounded-full border border-chevo-red/10 bg-white/70 px-5 py-3 text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                Loading event
              </span>
            )}
          </div>
        </div>

        <div className="glass-inset rounded-[24px] px-5 py-5">
          <p className="text-3xl leading-10 font-bold text-chevo-dark">
            OPEN TO UCT STUDENTS
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
            Across all faculties
          </p>
          <p className="mt-5 text-sm leading-6 text-chevo-text-muted">
            Workshops, socials, and build sessions are designed for students
            who want practical momentum outside the curriculum.
          </p>
        </div>
      </div>
    </div>
  );
}
