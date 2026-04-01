"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

type EventTab = "upcoming" | "past";

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path
        d="M7.10208 5.25H0V4.08333H7.10208L3.83542 0.816667L4.66667 0L9.33333 4.66667L4.66667 9.33333L3.83542 8.51667L7.10208 5.25Z"
        fill="#B12C19"
      />
    </svg>
  );
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");

  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <section className="mx-auto max-w-[1280px] px-6 pt-16 pb-8 lg:px-8">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <div
            className="motion-panel-enter lg:col-span-7"
            style={{ animationDelay: "40ms" }}
          >
            <div className="flex flex-col gap-4 pb-8">
              <span className="text-xs font-bold uppercase tracking-[1.2px] text-chevo-red">
                Chevo Collective
              </span>
              <h1 className="text-6xl leading-none font-bold tracking-[-4.8px] sm:text-8xl lg:text-[96px]">
                <span className="text-chevo-dark">Chevo</span>
                <br />
                <span className="text-chevo-orange">Events</span>
              </h1>
              <p className="max-w-[500px] pt-4 text-lg leading-[29px] text-chevo-text-muted">
                Workshops, socials, and presentations, all in one place. From
                hands-on build nights to guest talks, here&apos;s what
                we&apos;re running
              </p>
            </div>
          </div>

          <div
            className="motion-panel-enter lg:col-span-5"
            style={{ animationDelay: "140ms" }}
          >
            <div className="relative flex items-end justify-center">
              <div className="ambient-orb pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-xl bg-gradient-to-br from-chevo-red to-chevo-orange opacity-30 blur-[32px]" />
              <div className="interactive-media relative rotate-2 overflow-hidden rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/93fc97193583200a61fd70b8fa239ac5cd8eaf6f?width=934"
                  alt="Creative workshop"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-[4/5] h-auto max-h-[500px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="flex items-center gap-8 border-b-2 border-chevo-gray">
          <button
            type="button"
            aria-pressed={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
            className={`-mb-[2px] border-b-2 pb-4 text-sm font-bold uppercase tracking-[1.4px] transition-colors ${
              activeTab === "upcoming"
                ? "border-chevo-red text-chevo-red"
                : "border-transparent text-chevo-text-muted hover:text-chevo-dark"
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            aria-pressed={activeTab === "past"}
            onClick={() => setActiveTab("past")}
            className={`-mb-[2px] border-b-2 pb-4 text-sm font-bold uppercase tracking-[1.4px] transition-colors ${
              activeTab === "past"
                ? "border-chevo-red text-chevo-red"
                : "border-transparent text-chevo-text-muted hover:text-chevo-dark"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
        <div
          key={activeTab}
          id="events-panel"
          className="motion-panel-enter"
        >
          {activeTab === "upcoming" ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <Reveal>
                <div className="interactive-surface flex h-full min-h-[440px] flex-col overflow-hidden rounded-lg bg-white shadow-sm sm:flex-row">
                  <div className="overflow-hidden sm:w-[40%] sm:flex-shrink-0">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/001baf8a787375c9a0faa49d89b6dab5fbf00d29?width=808"
                      alt="Tech Event"
                      loading="lazy"
                      decoding="async"
                      className="min-h-[250px] h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-10">
                    <div>
                      <div className="mb-6 flex items-center gap-2">
                        <span className="rounded-full bg-chevo-orange px-3 py-1 text-[10px] font-black uppercase tracking-[1px] text-[#640600]">
                          Workshop
                        </span>
                        <span className="rounded-full bg-chevo-gray px-3 py-1 text-[10px] font-bold uppercase tracking-[1px] text-chevo-dark">
                          Chevo
                        </span>
                      </div>
                      <h2 className="mb-6 text-3xl leading-10 font-bold tracking-[-0.9px] text-chevo-dark sm:text-[36px]">
                        Building my own AI Agent
                      </h2>
                      <p className="text-sm leading-[22.75px] text-chevo-text-muted">
                        A practical session on building a personal AI agent from
                        scratch, wiring in a few high-leverage workflows, and
                        turning it into something you can actually use during the
                        semester.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-[#EEEEF0] pt-6">
                      <span className="text-xs font-bold uppercase tracking-[-0.6px] text-chevo-dark">
                        June 1
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[-0.6px] text-chevo-dark">
                        Snape LT1
                      </span>
                      <a
                        href="mailto:chevocollective@gmail.com?subject=AI%20Agent%20Workshop%20Interest"
                        className="interactive-link inline-flex items-center gap-2 text-xs font-black uppercase tracking-[1.2px] text-chevo-red hover:opacity-80"
                      >
                        Interest Form
                        <ArrowIcon />
                      </a>
                    </div>
                  </div>
                </div>
                </Reveal>
              </div>

              <div className="flex flex-col gap-8 lg:col-span-4">
                <Reveal delay={90}>
                <div className="interactive-surface flex flex-1 flex-col justify-between rounded-lg bg-white p-8 shadow-sm">
                  <div>
                    <div className="mb-5 aspect-video overflow-hidden rounded">
                      <img
                        src="https://api.builder.io/api/v1/image/assets/TEMP/64f08e712d880e32d99d5531dfb0fa0273ba0cf6?width=640"
                        alt="Art event"
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="mb-3 block text-[10px] font-bold uppercase tracking-[1px] text-chevo-red">
                      Social
                    </span>
                    <h3 className="mb-3 text-2xl leading-8 font-bold tracking-[-0.6px] text-chevo-dark">
                      Coffee Chat
                    </h3>
                    <p className="text-sm leading-5 text-chevo-text-muted">
                      Meet the collective, see what others are building. Nerd
                      out, it&apos;s a safe space.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-[#EEEEF0] pt-6">
                    <span className="text-xs font-bold uppercase tracking-[-0.6px] text-chevo-dark">
                      April 25
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[-0.6px] text-chevo-dark">
                      Plato Coffee
                    </span>
                    <a
                      href="mailto:chevocollective@gmail.com?subject=Coffee%20Chat%20RSVP"
                      className="interactive-link inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[1.2px] text-chevo-red hover:opacity-80"
                    >
                      RSVP via Email
                      <ArrowIcon />
                    </a>
                  </div>
                </div>
                </Reveal>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-lg font-medium text-chevo-muted-text">
              Past event recaps will appear here once the first sessions wrap.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-chevo-red to-chevo-orange px-10 py-16 text-center sm:px-16">
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
                className="interactive-button inline-flex items-center justify-center rounded-md bg-white px-10 py-4 text-sm font-bold uppercase tracking-[1.4px] text-chevo-red shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] hover:bg-white/90"
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
