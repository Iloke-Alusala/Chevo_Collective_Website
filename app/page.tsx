import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import HomeEventHighlight from "@/components/HomeEventHighlight";
import HomeProjectPile from "@/components/HomeProjectPile";
import SmartImage from "@/components/SmartImage";

const homepageDescription =
  "Chevo Collective is a UCT student community for AI agent workshops, robotics builds, drones, rovers, and hands-on engineering projects in Cape Town.";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "UCT student engineering workshops, AI agents and robotics builds",
  description: homepageDescription,
  keywords: [
    "UCT student workshops",
    "AI agents",
    "student robotics",
    "engineering community Cape Town",
    "drone builds",
    "Chevo Collective projects",
  ],
  openGraph: {
    title: "Chevo Collective home",
    description: homepageDescription,
  },
  twitter: {
    title: "Chevo Collective home",
    description: homepageDescription,
  },
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Chevo Collective",
    description: homepageDescription,
    areaServed: "Cape Town",
    knowsAbout: [
      "AI agents",
      "student engineering workshops",
      "robotics projects",
      "drone builds",
      "physical computing",
    ],
    audience: {
      "@type": "Audience",
      audienceType: "University students",
    },
    ...(siteUrl ? { url: siteUrl } : {}),
  };

  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1280px] px-6 pt-16 pb-10 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

          {/* Hero — headline + CTA buttons */}
          <div className="lg:col-span-7">
            <div className="flex flex-col items-start gap-6">
              <h1
                className="motion-panel-enter text-[2.55rem] leading-none font-bold tracking-[-1.7px] text-chevo-dark sm:text-7xl sm:tracking-[-3px] lg:text-[88px] lg:tracking-[-4px]"
                style={{ animationDelay: "40ms" }}
              >
                Your Missing <span className="text-chevo-red">Semester</span> of
                <br />
                Engineering
              </h1>

              <p
                className="motion-panel-enter max-w-[576px] text-[0.96rem] leading-[1.45] text-chevo-text-muted sm:text-xl"
                style={{ animationDelay: "120ms" }}
              >
                The curriculum doesn&apos;t teach the skills you need to survive
                today, and the tech world isn&apos;t waiting. This is the space
                where students build, create, and stay ahead.
              </p>

              <div
                className="motion-panel-enter flex w-full items-center justify-between gap-3 px-6 pt-2 sm:w-auto sm:justify-start sm:gap-6 sm:px-0"
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
                  className="interactive-button inline-flex items-center justify-center rounded-full bg-neutral-700 px-6 py-3 text-sm font-bold uppercase tracking-[1.2px] text-white shadow-[0_16px_32px_-18px_rgba(0,0,0,0.75)] hover:brightness-110"
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
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-stretch lg:gap-20">

          {/* Event highlight — project stack */}
          <Reveal delay={40} className="w-full lg:w-[58%] lg:self-stretch">
            <div className="relative w-full flex-shrink-0 lg:h-full">
              <div className="pointer-events-none absolute -top-6 -right-6 hidden h-48 w-48 rounded-xl border-[8px] border-[rgba(226,191,184,0.20)] sm:block" />
              <div className="ambient-orb ambient-orb-slow pointer-events-none absolute -bottom-2 left-2 h-36 w-36 rounded-xl bg-gradient-to-br from-chevo-red to-chevo-orange opacity-30 blur-[36px]" />
              <div className="glass-panel relative overflow-visible rounded-[32px] px-3 py-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:px-4 sm:py-4">
                <HomeProjectPile />
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
                <h2 className="text-[2.05rem] leading-tight font-bold tracking-[-1.2px] text-white sm:text-5xl sm:tracking-[-2px] lg:text-[60px] lg:leading-[60px] lg:tracking-[-3px]">
                  Don&apos;t miss what&apos;s coming
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="max-w-[672px] text-[0.96rem] leading-6 text-white/80 sm:text-xl">
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
                  className="interactive-button inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[1.6px] text-chevo-red shadow-[0_16px_32px_-18px_rgba(177,44,25,0.75)] hover:brightness-90 sm:px-9 sm:py-3.5 sm:text-sm sm:tracking-[2.8px]"
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
