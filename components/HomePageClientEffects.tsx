"use client";

import { useLayoutEffect } from "react";

export default function HomePageClientEffects() {
  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    const restoreTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.history.scrollRestoration = "manual";
    restoreTop();

    const frameId = window.requestAnimationFrame(restoreTop);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return null;
}
