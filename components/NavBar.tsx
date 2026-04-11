"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuId = "site-navigation-mobile";

  const isHome = pathname === "/";
  const isEvents = pathname === "/events" || pathname.startsWith("/events/");

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-white/60 bg-white/70 shadow-[0_20px_40px_0_rgba(26,28,29,0.06)]">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="interactive-link shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-emphasized)] hover:scale-[1.01]"
          onClick={closeMobileMenu}
        >
          <span className="select-none text-2xl leading-none font-black tracking-tight text-chevo-logo-orange">
            Chevo Collective
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            aria-current={isHome ? "page" : undefined}
            className={`text-sm font-bold uppercase tracking-tight transition-colors ${
              isHome
                ? "border-b-2 border-chevo-logo-orange pb-px text-chevo-logo-orange"
                : "text-chevo-slate hover:text-chevo-dark"
            }`}
          >
            Home
          </Link>
          <Link
            href="/events"
            aria-current={isEvents ? "page" : undefined}
            className={`text-sm font-bold uppercase tracking-tight transition-colors ${
              isEvents
                ? "border-b-2 border-chevo-logo-orange pb-px text-chevo-logo-orange"
                : "text-chevo-slate hover:text-chevo-dark"
            }`}
          >
            Events
          </Link>
        </div>

        <div className="hidden md:block">
          <Link
            href="/events"
            className="interactive-button inline-flex items-center justify-center rounded-md bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-2 text-sm font-bold uppercase tracking-tight text-white shadow-[0_10px_15px_-3px_rgba(177,44,25,0.20),0_4px_6px_-4px_rgba(177,44,25,0.20)] hover:opacity-90"
          >
            See Events
          </Link>
        </div>

        <button
          className="rounded-md p-2 text-chevo-dark transition-transform duration-[var(--duration-base)] ease-[var(--ease-emphasized)] hover:scale-105 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls={mobileMenuId}
        >
          {mobileOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        id={mobileMenuId}
        aria-hidden={!mobileOpen}
        className={`overflow-hidden border-t border-white/60 bg-white/35 transition-[max-height,opacity,transform] duration-[420ms] ease-[var(--ease-emphasized)] md:hidden ${
          mobileOpen
            ? "max-h-80 translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-6 py-4">
          <Link
            href="/"
            onClick={closeMobileMenu}
            aria-current={isHome ? "page" : undefined}
            tabIndex={mobileOpen ? 0 : -1}
            className={`text-sm font-bold uppercase tracking-tight ${
              isHome ? "text-chevo-logo-orange" : "text-chevo-slate"
            }`}
          >
            Home
          </Link>
          <Link
            href="/events"
            onClick={closeMobileMenu}
            aria-current={isEvents ? "page" : undefined}
            tabIndex={mobileOpen ? 0 : -1}
            className={`text-sm font-bold uppercase tracking-tight ${
              isEvents ? "text-chevo-logo-orange" : "text-chevo-slate"
            }`}
          >
            Events
          </Link>
          <Link
            href="/events"
            onClick={closeMobileMenu}
            tabIndex={mobileOpen ? 0 : -1}
            className="interactive-button inline-flex w-fit items-center justify-center rounded-md bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-2 text-sm font-bold uppercase tracking-tight text-white"
          >
            See Events
          </Link>
        </div>
      </div>
    </nav>
  );
}
