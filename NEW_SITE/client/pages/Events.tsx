import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M7.10208 5.25H0V4.08333H7.10208L3.83542 0.816667L4.66667 0L9.33333 4.66667L4.66667 9.33333L3.83542 8.51667L7.10208 5.25Z"
        fill="#B12C19"
      />
    </svg>
  );
}

export default function Events() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          {/* Left: text */}
          <div className="lg:col-span-7 flex flex-col gap-4 pb-8">
            <span className="text-chevo-red text-xs font-bold uppercase tracking-[1.2px]">
              Chevo Collective
            </span>
            <h1 className="text-6xl sm:text-8xl lg:text-[96px] font-bold leading-none tracking-[-4.8px]">
              <span className="text-chevo-dark">Chevo</span>
              <br />
              <span className="text-chevo-orange">Events</span>
            </h1>
            <p className="text-lg text-chevo-text-muted leading-[29px] max-w-[500px] pt-4">
              Workshops, socials, and presentations, all in one place. From
              hands-on build nights to guest talks, here's what we're running
            </p>
          </div>

          {/* Right: decorative image */}
          <div className="lg:col-span-5 relative flex items-end justify-center">
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-xl bg-gradient-to-br from-chevo-red to-chevo-orange opacity-30 blur-[32px] pointer-events-none" />
            <div className="relative rounded-lg overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transform rotate-2">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/93fc97193583200a61fd70b8fa239ac5cd8eaf6f?width=934"
                alt="Creative workshop"
                className="w-full h-auto max-h-[500px] object-cover aspect-[4/5]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Tab Switcher ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-8 border-b-2 border-chevo-gray">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-4 text-sm font-bold uppercase tracking-[1.4px] border-b-2 -mb-[2px] transition-colors ${
              activeTab === "upcoming"
                ? "text-chevo-red border-chevo-red"
                : "text-chevo-text-muted border-transparent hover:text-chevo-dark"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-4 text-sm font-bold uppercase tracking-[1.4px] border-b-2 -mb-[2px] transition-colors ${
              activeTab === "past"
                ? "text-chevo-red border-chevo-red"
                : "text-chevo-text-muted border-transparent hover:text-chevo-dark"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* ── Events Grid ── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-10">
        {activeTab === "upcoming" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured event — spans 8 cols */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col sm:flex-row h-full min-h-[440px]">
                {/* Image */}
                <div className="sm:w-[40%] flex-shrink-0 overflow-hidden">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/001baf8a787375c9a0faa49d89b6dab5fbf00d29?width=808"
                    alt="Tech Event"
                    className="w-full h-full object-cover min-h-[250px]"
                  />
                </div>
                {/* Content */}
                <div className="flex flex-col justify-between p-10 flex-1">
                  <div>
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-6">
                      <span className="bg-chevo-orange text-[#640600] text-[10px] font-black uppercase tracking-[1px] px-3 py-1 rounded-full">
                        Workshop
                      </span>
                      <span className="bg-chevo-gray text-chevo-dark text-[10px] font-bold uppercase tracking-[1px] px-3 py-1 rounded-full">
                        Chevo
                      </span>
                    </div>
                    {/* Title */}
                    <h3 className="text-3xl sm:text-[36px] font-bold text-chevo-dark leading-10 tracking-[-0.9px] mb-6">
                      Building my own AI Agent
                    </h3>
                    {/* Description */}
                    <p className="text-sm text-chevo-text-muted leading-[22.75px]">
                      A hands-on session covering how to setup and configure
                      your own AI personal Agent. Plus some cool workflows.
                      Probably going to ramble a lot here just to fill up space
                      so that the entire card is full. Otherwise we just gotta
                      redesign this card
                    </p>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-[#EEEEF0] mt-6">
                    <span className="text-xs font-bold uppercase tracking-[-0.6px] text-chevo-dark">
                      June 1
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[-0.6px] text-chevo-dark">
                      Snape LT1
                    </span>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-chevo-red text-xs font-black uppercase tracking-[1.2px] hover:opacity-80 transition-opacity"
                    >
                      Apply Now
                      <ArrowIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary events column — spans 4 cols */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              {/* Coffee Chat */}
              <div className="bg-white rounded-lg p-8 shadow-sm flex flex-col justify-between flex-1">
                <div>
                  {/* Image */}
                  <div className="rounded overflow-hidden mb-5 aspect-video">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/64f08e712d880e32d99d5531dfb0fa0273ba0cf6?width=640"
                      alt="Art event"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-chevo-red text-[10px] font-bold uppercase tracking-[1px] block mb-3">
                    Social
                  </span>
                  <h3 className="text-2xl font-bold text-chevo-dark leading-8 tracking-[-0.6px] mb-3">
                    Coffee Chat
                  </h3>
                  <p className="text-sm text-chevo-text-muted leading-5">
                    Meet the collective, see what others are building. Nerd out,
                    it's a safe space.
                  </p>
                </div>
                {/* Footer */}
                <div className="pt-6 border-t border-[#EEEEF0] mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[-0.6px] text-chevo-dark">
                    April 25
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[-0.6px] text-chevo-dark">
                    Plato Coffee
                  </span>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-chevo-red text-xs font-bold uppercase tracking-[1.2px] hover:opacity-80 transition-opacity"
                  >
                    RSVP
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-chevo-muted-text text-lg font-medium">
            No past events yet — check back after our first event!
          </div>
        )}
      </section>

      {/* ── Propose an Event CTA ── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-20">
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-chevo-red to-chevo-orange px-10 sm:px-16 py-16 text-center">
          {/* Decorative blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-xl blur-[32px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-[-2.4px]">
              Propose an Event
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-7 max-w-[672px]">
              Got an idea for a workshop, talk, or build session? We're always
              looking for new ways to grow the community.
            </p>
            <a
              href="mailto:chevocollective@gmail.com"
              className="inline-flex items-center justify-center px-10 py-4 rounded-md bg-white text-chevo-red text-sm font-bold uppercase tracking-[1.4px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] hover:bg-white/90 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
