import Link from "next/link";
import Reveal from "@/components/Reveal";
import HomeEventHighlight from "@/components/HomeEventHighlight";
import SmartImage from "@/components/SmartImage";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <section className="mx-auto max-w-[1280px] px-6 pt-16 pb-10 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div
            className="motion-panel-enter lg:col-span-7"
            style={{ animationDelay: "40ms" }}
          >
            <div className="flex flex-col items-start gap-6">
              <h1 className="text-5xl leading-none font-bold tracking-[-4px] text-chevo-dark sm:text-7xl lg:text-[88px]">
                Your Missing <span className="text-chevo-red">Semester</span> of
                <br />
                Engineering
              </h1>

              <p className="max-w-[576px] text-lg leading-[1.4] text-chevo-text-muted sm:text-xl">
                The curriculum doesn&apos;t teach the skills you need to survive
                today, and the tech world isn&apos;t waiting. This is the space
                where students build, create, and stay ahead.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <Link
                  href="/events"
                  className="interactive-button inline-flex items-center justify-center rounded-md bg-gradient-to-r from-chevo-red to-chevo-orange px-10 py-4 text-sm font-bold uppercase tracking-[1.4px] text-white shadow-[0_18px_40px_-24px_rgba(177,44,25,0.85)]"
                >
                  Upcoming Events
                </Link>
                <div className="glass-inset rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                  About page coming soon
                </div>
              </div>
            </div>
          </div>

          <div
            className="motion-panel-enter lg:col-span-5"
            style={{ animationDelay: "140ms" }}
          >
            <div className="relative flex items-center justify-center">
              <div className="ambient-orb pointer-events-none absolute -bottom-6 -left-6 h-48 w-48 rounded-lg bg-chevo-orange opacity-20 blur-[20px]" />
              <div className="glass-panel interactive-media relative w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-2xl">
                <div className="relative aspect-[4/5] w-full">
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

      <section className="mx-auto max-w-[1280px] px-6 py-16 sm:py-24 lg:px-8">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">
          <Reveal delay={40} className="w-full lg:w-1/2">
            <div className="relative w-full flex-shrink-0">
              <div className="pointer-events-none absolute -top-6 -right-6 hidden h-48 w-48 rounded-xl border-[8px] border-[rgba(226,191,184,0.20)] sm:block" />
              <div className="ambient-orb ambient-orb-slow pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-xl bg-gradient-to-br from-chevo-red to-chevo-orange opacity-30 blur-[32px]" />
              <div className="glass-panel interactive-media relative overflow-hidden rounded-[28px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="relative aspect-video w-full">
                  <SmartImage
                    src="https://api.builder.io/api/v1/image/assets/TEMP/9f3a7da91e0e0197b9f8d5d59ff8728b8b284ad8?width=1136"
                    alt="Students collaborating"
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140} className="w-full lg:w-1/2">
            <HomeEventHighlight />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] border border-white/20 bg-gradient-to-r from-chevo-red to-chevo-orange px-10 py-20 text-center shadow-[0_30px_60px_-32px_rgba(177,44,25,0.55)] sm:px-20 sm:py-24">
            <div className="ambient-orb pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/10 blur-[32px]" />
            <div className="ambient-orb ambient-orb-slow pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-xl bg-black/10 blur-[32px]" />

            <div className="relative flex flex-col items-center gap-8">
              <h2 className="text-4xl leading-tight font-bold tracking-[-3px] text-white sm:text-5xl lg:text-[60px] lg:leading-[60px]">
                Don&apos;t miss what&apos;s coming
              </h2>
              <p className="max-w-[672px] text-lg leading-7 text-white/80 sm:text-xl">
                Sign up to the mailing list and get a sneak peek of what&apos;s
                in store. Be the first to know about workshops, events, and new
                projects.
              </p>
              <a
                href="https://mailchi.mp/82be5e27abf3/chevocollective"
                target="_blank"
                rel="noreferrer"
                className="interactive-button inline-flex items-center justify-center rounded-md bg-white px-12 py-5 text-sm font-bold uppercase tracking-[2.8px] text-chevo-red shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:bg-white/90"
              >
                Join The Mailing List
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
