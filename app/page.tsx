import Link from "next/link";
import Reveal from "@/components/Reveal";
import HomeEventHighlight from "@/components/HomeEventHighlight";
import SmartImage from "@/components/SmartImage";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1280px] px-6 pt-16 pb-10 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

          {/* Hero — headline + CTA buttons */}
          <div className="lg:col-span-7">
            <div className="flex flex-col items-start gap-6">
              <h1
                className="motion-panel-enter text-5xl leading-none font-bold tracking-[-2px] text-chevo-dark sm:text-7xl sm:tracking-[-3px] lg:text-[88px] lg:tracking-[-4px]"
                style={{ animationDelay: "40ms" }}
              >
                Your Missing <span className="text-chevo-red">Semester</span> of
                <br />
                Engineering
              </h1>

              <p
                className="motion-panel-enter max-w-[576px] text-lg leading-[1.4] text-chevo-text-muted sm:text-xl"
                style={{ animationDelay: "120ms" }}
              >
                The curriculum doesn&apos;t teach the skills you need to survive
                today, and the tech world isn&apos;t waiting. This is the space
                where students build, create, and stay ahead.
              </p>

              <div
                className="motion-panel-enter flex flex-wrap items-center gap-6 pt-2"
                style={{ animationDelay: "200ms" }}
              >
                <Link
                  href="/events"
                  className="interactive-button inline-flex items-center justify-center rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-3 text-sm font-bold uppercase tracking-[1.2px] text-white shadow-[0_16px_32px_-18px_rgba(177,44,25,0.75)] hover:brightness-110"
                >
                  Upcoming Events
                </Link>
                <Link
                  href="/about"
                  className="glass-button interactive-button inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[1.2px] text-chevo-dark hover:brightness-105"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>

          {/* Hero — cover image */}
          <div
            className="motion-panel-enter lg:col-span-5"
            style={{ animationDelay: "280ms" }}
          >
            <div className="relative flex items-center justify-center">
              <div className="ambient-orb pointer-events-none absolute -bottom-6 -left-6 h-48 w-48 rounded-lg bg-chevo-orange opacity-20 blur-[20px]" />
              <div className="glass-panel interactive-media relative w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-2xl">
                <div className="relative aspect-[4/3] w-full sm:aspect-[4/5]">
                  <SmartImage
                    src="https://api.builder.io/api/v1/image/assets/TEMP/acbb0d605ff25c0c34ddce8e9e595b2a10299647?width=957"
                    alt="Students building together in a workshop"
                    priority
                    sizes="(min-width: 1024px) 34vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Event Highlight ── */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 sm:py-24 lg:px-8">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">

          {/* Event highlight — video */}
          <Reveal delay={40} className="w-full lg:w-[58%]">
            <div className="relative w-full flex-shrink-0">
              <div className="pointer-events-none absolute -top-6 -right-6 hidden h-48 w-48 rounded-xl border-[8px] border-[rgba(226,191,184,0.20)] sm:block" />
              <div className="ambient-orb ambient-orb-slow pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-xl bg-gradient-to-br from-chevo-red to-chevo-orange opacity-30 blur-[32px]" />
              <div className="glass-panel relative overflow-hidden rounded-[28px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="relative aspect-video w-full">
                  <iframe
                    src="https://www.youtube.com/embed/1BNUNgcb1k0"
                    title="Piko — Chevo Collective project video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <div className="flex justify-end px-4 py-3">
                  <a
                    href="https://www.youtube.com/watch?v=1BNUNgcb1k0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text hover:text-chevo-red transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 7a2.59 2.59 0 0 0-1.83-1.83C16.27 4.77 12 4.77 12 4.77s-4.27 0-5.76.4A2.59 2.59 0 0 0 4.41 7 27.1 27.1 0 0 0 4 12a27.1 27.1 0 0 0 .41 5 2.59 2.59 0 0 0 1.83 1.83c1.49.4 5.76.4 5.76.4s4.27 0 5.76-.4A2.59 2.59 0 0 0 19.59 17 27.1 27.1 0 0 0 20 12a27.1 27.1 0 0 0-.41-5zM10 15V9l5.19 3L10 15z"/>
                    </svg>
                    Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Event highlight — text + sign-up card */}
          <Reveal delay={140} className="w-full lg:w-[42%]">
            <HomeEventHighlight />
          </Reveal>

        </div>
      </section>

      {/* ── Mailing List CTA ── */}
      <section className="mx-auto max-w-[1280px] px-6 pb-20 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] border border-white/20 bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-14 text-center shadow-[0_30px_60px_-32px_rgba(177,44,25,0.55)] sm:px-12 sm:py-20 lg:px-20 lg:py-14">
            <div className="ambient-orb pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/10 blur-[32px]" />
            <div className="ambient-orb ambient-orb-slow pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-xl bg-black/10 blur-[32px]" />

            <div className="relative flex flex-col items-center gap-8">
              <Reveal delay={0}>
                <h2 className="text-4xl leading-tight font-bold tracking-[-1.5px] text-white sm:text-5xl sm:tracking-[-2px] lg:text-[60px] lg:leading-[60px] lg:tracking-[-3px]">
                  Don&apos;t miss what&apos;s coming
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="max-w-[672px] text-lg leading-7 text-white/80 sm:text-xl">
                  Sign up to the mailing list and get a sneak peek of what&apos;s
                  in store. Be the first to know about workshops, events, and new
                  projects.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <a
                  href="https://mailchi.mp/82be5e27abf3/chevocollective"
                  target="_blank"
                  rel="noreferrer"
                  className="interactive-button inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[1.6px] text-chevo-red shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:brightness-105 sm:px-9 sm:py-3.5 sm:text-sm sm:tracking-[2.8px]"
                >
                  Join The Mailing List
                </a>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
