import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { aboutIntro, teamMembers } from "@/lib/about";

export const metadata: Metadata = {
  title: "About | Chevo Collective",
  description:
    "Meet the team behind Chevo Collective and learn how the community started.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <section className="mx-auto max-w-[1280px] px-6 pt-16 pb-10 lg:px-8">
        <Reveal className="glass-panel rounded-[34px] px-8 py-10 sm:px-10 sm:py-12">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[1.8px] text-chevo-red">
              About Chevo
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-[-3px] text-chevo-dark sm:text-6xl">
              Built because we wanted a faster way to learn.
            </h1>
            <p className="mt-6 text-base leading-8 text-chevo-text-muted sm:text-lg">
              {aboutIntro}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 pb-20 lg:px-8">
        {teamMembers.map((member, index) => (
          <Reveal
            key={member.name}
            delay={index * 90}
            className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]"
          >
            <div
              className={`glass-panel relative aspect-square overflow-hidden rounded-[30px] bg-gradient-to-br ${member.accentClassName} p-6`}
            >
              <div className="relative flex h-full flex-col justify-between rounded-[24px] bg-white/38 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="260px"
                />
              </div>
            </div>

            <div className="glass-panel rounded-[30px] border border-white/45 bg-white/42 px-8 py-8 sm:px-10">
              <p className="text-xs font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                Team Profile
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-[-1.6px] text-chevo-dark">
                    {member.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[1.3px] text-chevo-red">
                    {member.role}
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-3xl text-base leading-8 text-chevo-text-muted">
                {member.summary}
              </p>
            </div>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
