"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuId = "site-navigation-mobile";

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";
  const isEvents = pathname === "/events";
  const isRsvp = pathname.startsWith("/events/");
  const rsvpHref = isRsvp ? pathname : "/events";

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-white/60 bg-white/70 shadow-[0_20px_40px_0_rgba(26,28,29,0.06)]">
      <div className="relative mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-3">
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

          <Link
            href="/"
            className="interactive-link shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-emphasized)] hover:scale-[1.01]"
            onClick={closeMobileMenu}
          >
            <span className="select-none text-2xl leading-none font-black tracking-tight text-chevo-logo-orange">
              Chevo Collective
            </span>
          </Link>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
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
          <Link
            href="/about"
            aria-current={isAbout ? "page" : undefined}
            className={`text-sm font-bold uppercase tracking-tight transition-colors ${
              isAbout
                ? "border-b-2 border-chevo-logo-orange pb-px text-chevo-logo-orange"
                : "text-chevo-slate hover:text-chevo-dark"
            }`}
          >
            About
          </Link>
          {isRsvp ? (
            <Link
              href={rsvpHref}
              aria-current="page"
              className="border-b-2 border-chevo-logo-orange pb-px text-sm font-bold uppercase tracking-tight text-chevo-logo-orange transition-colors"
            >
              RSVP
            </Link>
          ) : null}
        </div>
      </div>

      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-x-0 top-16 bottom-0 z-40 bg-[rgba(26,28,29,0.14)] backdrop-blur-[2px] transition-opacity duration-[360ms] ease-[var(--ease-standard)] md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileMenu}
      />

      <div
        id={mobileMenuId}
        aria-hidden={!mobileOpen}
        className={`glass-panel fixed top-16 bottom-0 left-0 z-50 w-[min(82vw,20rem)] border-r border-white/65 bg-white/78 px-6 py-6 transition-[transform,opacity] duration-[420ms] ease-[var(--ease-emphasized)] md:hidden ${
          mobileOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            onClick={closeMobileMenu}
            aria-current={isHome ? "page" : undefined}
            tabIndex={mobileOpen ? 0 : -1}
            className={`rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-tight ${
              isHome
                ? "glass-inset text-chevo-logo-orange"
                : "text-chevo-slate"
            }`}
          >
            Home
          </Link>
          <Link
            href="/events"
            onClick={closeMobileMenu}
            aria-current={isEvents ? "page" : undefined}
            tabIndex={mobileOpen ? 0 : -1}
            className={`rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-tight ${
              isEvents
                ? "glass-inset text-chevo-logo-orange"
                : "text-chevo-slate"
            }`}
          >
            Events
          </Link>
          <Link
            href="/about"
            onClick={closeMobileMenu}
            aria-current={isAbout ? "page" : undefined}
            tabIndex={mobileOpen ? 0 : -1}
            className={`rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-tight ${
              isAbout
                ? "glass-inset text-chevo-logo-orange"
                : "text-chevo-slate"
            }`}
          >
            About
          </Link>
          {isRsvp ? (
            <Link
              href={rsvpHref}
              onClick={closeMobileMenu}
              aria-current="page"
              tabIndex={mobileOpen ? 0 : -1}
              className="glass-inset rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-tight text-chevo-logo-orange"
            >
              RSVP
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
