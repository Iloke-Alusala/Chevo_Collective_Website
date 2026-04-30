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
      <span className="text-[9px] font-bold uppercase tracking-[2.5px] text-chevo-red sm:text-xs sm:tracking-[3.6px]">
        By Students, For Students
      </span>

      <h2 className="text-[1.75rem] leading-tight font-bold tracking-[-0.95px] sm:text-5xl lg:text-[56px] lg:leading-[56px]">
        <span className="text-chevo-dark">&quot;A lab where </span>
        <span className="text-chevo-orange">cooler stuff</span>
        <span className="text-chevo-dark"> actually gets built.&quot;</span>
      </h2>

      <p className="pt-4 text-[0.82rem] leading-6 text-chevo-text-muted sm:text-lg sm:leading-[29px]">
        We&apos;re UCT students who got tired of waiting for the curriculum to
        catch up. The Chevo Collective is our answer, a hands-on community
        where you can build an AI Agent, a drone, or a rover without waiting for
        permission.
      </p>

      <div className="grid grid-cols-2 gap-4 pt-6 sm:gap-6">
        <div className="glass-inset flex flex-col rounded-[24px] px-5 pt-5 pb-8">
          <p className="text-[1.55rem] leading-[2.05rem] font-bold text-chevo-dark sm:text-3xl sm:leading-10">
            {featuredUpcomingEvent
              ? `FIRST EVENT: ${featuredUpcomingEvent.dateLabel.toUpperCase()}`
              : "FIRST EVENT LOADING"}
          </p>
          <p className="mt-1 text-[12px] font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
            {featuredUpcomingEvent
              ? featuredUpcomingEvent.title
              : "Preparing featured event"}
          </p>

          <div className="mt-auto pt-5">
            {featuredUpcomingEvent ? (
              <Link
                href={getEventAnchorPath(featuredUpcomingEvent.slug)}
                className="interactive-button inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-5 py-3 text-[10px] font-bold uppercase tracking-[1px] text-white shadow-[0_16px_32px_-18px_rgba(177,44,25,0.75)] hover:brightness-110 sm:text-xs sm:tracking-[1.2px]"
              >
                Sign Up Now
              </Link>
            ) : (
              <span className="inline-flex rounded-full border border-chevo-red/10 bg-white/70 px-5 py-3 text-[10px] font-bold uppercase tracking-[1px] text-chevo-muted-text sm:text-xs sm:tracking-[1.2px]">
                Loading event
              </span>
            )}
          </div>
        </div>

        <div className="glass-inset rounded-[24px] px-5 py-5">
          <p className="text-[1.55rem] leading-[2.05rem] font-bold text-chevo-dark sm:text-3xl sm:leading-10">
            OPEN{" "}<br className="sm:hidden" />TO UCT{" "}<br className="sm:hidden" />STUDENTS
          </p>
          <p className="mt-1 text-[12px] font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
            Across all faculties
          </p>
          <p className="mt-5 text-[12px] leading-[1.4rem] text-chevo-text-muted sm:text-sm sm:leading-6">
            Join workshops, socials, and build sessions! For students
            who want practical momentum outside the curriculum.
          </p>
        </div>
      </div>
    </div>
  );
}
