"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
};

type RevealStyle = CSSProperties & {
  "--reveal-delay"?: string;
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.16,
  rootMargin = "0px 0px -12% 0px",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const rect = node.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const isAlreadyInView = rect.top < viewportHeight * 0.92 && rect.bottom > 0;

    if (isAlreadyInView) {
      setIsVisible(true);
      setShouldAnimate(false);
      return;
    }

    setShouldAnimate(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsVisible(true);
        setShouldAnimate(false);
        observer.unobserve(entry.target);
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isMounted, threshold, rootMargin]);

  const style: RevealStyle = {
    "--reveal-delay": `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={`motion-reveal ${
        isMounted && shouldAnimate && !isVisible ? "is-pending" : ""
      } ${isVisible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
