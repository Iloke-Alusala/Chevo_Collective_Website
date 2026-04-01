import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-[0_20px_40px_0_rgba(26,28,29,0.06)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <span className="text-chevo-logo-orange font-black text-2xl tracking-tight leading-none select-none">
            Chevo Collective
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-bold uppercase tracking-tight transition-colors ${
              isActive("/")
                ? "text-chevo-logo-orange border-b-2 border-chevo-logo-orange pb-px"
                : "text-chevo-slate hover:text-chevo-dark"
            }`}
          >
            Home
          </Link>
          <Link
            to="/events"
            className={`text-sm font-bold uppercase tracking-tight transition-colors ${
              isActive("/events")
                ? "text-chevo-logo-orange border-b-2 border-chevo-logo-orange pb-px"
                : "text-chevo-slate hover:text-chevo-dark"
            }`}
          >
            Events
          </Link>
          <Link
            to="/about"
            className={`text-sm font-bold uppercase tracking-tight transition-colors ${
              isActive("/about")
                ? "text-chevo-logo-orange border-b-2 border-chevo-logo-orange pb-px"
                : "text-chevo-slate hover:text-chevo-dark"
            }`}
          >
            About
          </Link>
        </div>

        {/* CTA button */}
        <div className="hidden md:block">
          <Link
            to="/events"
            className="inline-flex items-center justify-center px-6 py-2 rounded-md bg-gradient-to-r from-chevo-red to-chevo-orange text-white text-sm font-bold uppercase tracking-tight shadow-[0_10px_15px_-3px_rgba(177,44,25,0.20),0_4px_6px_-4px_rgba(177,44,25,0.20)] hover:opacity-90 transition-opacity"
          >
            Join Collective
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-chevo-dark"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-chevo-gray px-6 py-4 flex flex-col gap-4">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`text-sm font-bold uppercase tracking-tight ${isActive("/") ? "text-chevo-logo-orange" : "text-chevo-slate"}`}
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileOpen(false)}
            className={`text-sm font-bold uppercase tracking-tight ${isActive("/events") ? "text-chevo-logo-orange" : "text-chevo-slate"}`}
          >
            Events
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileOpen(false)}
            className={`text-sm font-bold uppercase tracking-tight ${isActive("/about") ? "text-chevo-logo-orange" : "text-chevo-slate"}`}
          >
            About
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center px-6 py-2 rounded-md bg-gradient-to-r from-chevo-red to-chevo-orange text-white text-sm font-bold uppercase tracking-tight w-fit"
          >
            Join Collective
          </Link>
        </div>
      )}
    </nav>
  );
}
