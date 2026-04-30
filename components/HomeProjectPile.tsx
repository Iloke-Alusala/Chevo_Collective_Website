"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const REPLAY_OUT_DURATION_MS = 140;
const REPLAY_IN_DURATION_MS = 980;
const AUTO_SETTLE_DELAY_MS = 140;

const projectCards = [
  {
    title: "PIKO",
    src: "/home/projects/piko-cover.jpg",
    alt: "PIKO wearable companion with a tiny screen showing a walking character",
    aspectClassName: "aspect-[16/9]",
    objectClassName: "object-cover object-[42%_center]",
    gradientClassName:
      "bg-gradient-to-t from-black/28 via-transparent to-transparent",
    poseClassName: "project-pile-card--piko",
    priority: true,
  },
  {
    title: "Dronita",
    src: "/home/projects/dronita-cover.jpg",
    alt: "Drone frame and components laid out on a bright blue surface",
    aspectClassName: "aspect-[3/4]",
    objectClassName: "object-cover object-center",
    gradientClassName:
      "bg-gradient-to-t from-black/38 via-black/8 to-transparent",
    poseClassName: "project-pile-card--dronita",
    priority: true,
  },
  {
    title: "Generative Design",
    src: "/home/projects/generative-design.jpg",
    alt: "Black planter with green leaves in front of mountains and a cloudy sky",
    aspectClassName: "aspect-[3/4]",
    objectClassName:
      "object-cover object-[center_28%] brightness-[1.16] saturate-[1.08]",
    gradientClassName: "bg-gradient-to-t from-black/6 via-transparent to-transparent",
    poseClassName: "project-pile-card--ai-pots",
    priority: false,
  },
  {
    title: "Locked Out",
    src: "/home/projects/locked-out.jpg",
    alt: "Dark grayscale city street scene with lit street lamps",
    aspectClassName: "aspect-[16/9]",
    objectClassName: "object-cover object-center",
    gradientClassName:
      "bg-gradient-to-t from-black/36 via-transparent to-transparent",
    poseClassName: "project-pile-card--locked-out",
    priority: false,
  },
  {
    title: "Desk Robot",
    src: "/home/projects/desk-robot.jpg",
    alt: "Desktop robot build thumbnail with a smiling face on a small screen",
    aspectClassName: "aspect-[9/16]",
    objectClassName: "object-cover object-top",
    gradientClassName:
      "bg-gradient-to-t from-black/28 via-black/6 to-transparent",
    poseClassName: "project-pile-card--desk-robot",
    priority: false,
  },
] as const;

export default function HomeProjectPile() {
  const [isSettled, setIsSettled] = useState(false);
  const [isReplayingOut, setIsReplayingOut] = useState(false);
  const [isReturningIn, setIsReturningIn] = useState(false);
  const pileRef = useRef<HTMLDivElement | null>(null);
  const autoSettleTimeoutRef = useRef<number | null>(null);
  const replayOutTimeoutRef = useRef<number | null>(null);
  const replayInTimeoutRef = useRef<number | null>(null);

  const clearAnimationTimers = () => {
    if (autoSettleTimeoutRef.current !== null) {
      window.clearTimeout(autoSettleTimeoutRef.current);
      autoSettleTimeoutRef.current = null;
    }

    if (replayOutTimeoutRef.current !== null) {
      window.clearTimeout(replayOutTimeoutRef.current);
      replayOutTimeoutRef.current = null;
    }

    if (replayInTimeoutRef.current !== null) {
      window.clearTimeout(replayInTimeoutRef.current);
      replayInTimeoutRef.current = null;
    }
  };

  const settleIn = () => {
    setIsReturningIn(true);
    setIsReplayingOut(false);
    setIsSettled(true);

    replayInTimeoutRef.current = window.setTimeout(() => {
      setIsReturningIn(false);
      replayInTimeoutRef.current = null;
    }, REPLAY_IN_DURATION_MS);
  };

  const replaySettleAnimation = () => {
    clearAnimationTimers();
    setIsReturningIn(false);
    setIsReplayingOut(true);
    setIsSettled(false);

    replayOutTimeoutRef.current = window.setTimeout(() => {
      setIsReplayingOut(false);
      replayOutTimeoutRef.current = null;
      settleIn();
    }, REPLAY_OUT_DURATION_MS);
  };

  useEffect(() => {
    const node = pileRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          clearAnimationTimers();
          setIsReplayingOut(false);
          autoSettleTimeoutRef.current = window.setTimeout(() => {
            autoSettleTimeoutRef.current = null;
            settleIn();
          }, AUTO_SETTLE_DELAY_MS);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      clearAnimationTimers();
    };
  }, []);

  return (
    <div
      ref={pileRef}
      className={`project-pile relative min-h-[41rem] w-full overflow-visible sm:min-h-[49rem] lg:min-h-[56rem] ${
        isSettled ? "is-settled" : ""
      } ${isReplayingOut ? "is-replaying-out" : ""} ${
        isReturningIn ? "is-returning-in" : ""
      } focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-chevo-red/35`}
      role="button"
      tabIndex={0}
      aria-label="Replay the project card pile animation"
      onClick={(event) => {
        if (event.detail > 0) {
          event.currentTarget.blur();
        }

        replaySettleAnimation();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          replaySettleAnimation();
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),rgba(255,255,255,0)_38%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(245,247,251,0.72))]" />

      <div className="glass-chip pointer-events-none absolute top-4 left-1/2 z-20 flex w-[34%] min-w-[9rem] -translate-x-1/2 justify-center rounded-full px-4 py-2 text-center text-[9.5px] font-bold uppercase tracking-[2px] text-chevo-red sm:top-5 sm:w-auto sm:min-w-0 sm:px-3.5 sm:py-1.5 sm:text-[10px]">
        Our Builds
      </div>

      {projectCards.map((card) => (
        <article
          key={card.title}
          className={`project-pile-card pointer-events-none absolute overflow-hidden rounded-[28px] border border-white/70 bg-white/88 p-1 shadow-[0_24px_50px_-28px_rgba(26,28,29,0.48)] backdrop-blur-sm ${card.poseClassName}`}
        >
          <div
            className={`relative overflow-hidden rounded-[22px] bg-chevo-dark/5 ${card.aspectClassName}`}
          >
            <Image
              alt={card.alt}
              className={card.objectClassName}
              fill
              priority={card.priority}
              sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 42vw, (min-width: 640px) 62vw, 82vw"
              src={card.src}
            />
            <div className={`absolute inset-0 ${card.gradientClassName}`} />
            <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3.5">
              <p className="text-[10px] leading-tight font-bold tracking-[-0.15px] text-white sm:text-sm lg:text-base">
                {card.title}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
