import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// SVG icons from Figma
function IconBolt() {
  return (
    <svg width="22" height="40" viewBox="0 0 22 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 40L10 26H0L18 0H22L20 16H32L12 40H8Z" fill="#FF634A" />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 24V20.85C0 19.4167 0.733333 18.25 2.2 17.35C3.66667 16.45 5.6 16 8 16C8.43333 16 8.85 16.0083 9.25 16.025C9.65 16.0417 10.0333 16.0833 10.4 16.15C9.93333 16.85 9.58333 17.5833 9.35 18.35C9.11667 19.1167 9 19.9167 9 20.75V24H0ZM12 24V20.75C12 19.6833 12.2917 18.7083 12.875 17.825C13.4583 16.9417 14.2833 16.1667 15.35 15.5C16.4167 14.8333 17.6917 14.3333 19.175 14C20.6583 13.6667 22.2667 13.5 24 13.5C25.7667 13.5 27.3917 13.6667 28.875 14C30.3583 14.3333 31.6333 14.8333 32.7 15.5C33.7667 16.1667 34.5833 16.9417 35.15 17.825C35.7167 18.7083 36 19.6833 36 20.75V24H12ZM39 24V20.75C39 19.8833 38.8917 19.0667 38.675 18.3C38.4583 17.5333 38.1333 16.8167 37.7 16.15C38.0667 16.0833 38.4417 16.0417 38.825 16.025C39.2083 16.0083 39.6 16 40 16C42.4 16 44.3333 16.4417 45.8 17.325C47.2667 18.2083 48 19.3833 48 20.85V24H39ZM8 14C6.9 14 5.95833 13.6083 5.175 12.825C4.39167 12.0417 4 11.1 4 10C4 8.86667 4.39167 7.91667 5.175 7.15C5.95833 6.38333 6.9 6 8 6C9.13333 6 10.0833 6.38333 10.85 7.15C11.6167 7.91667 12 8.86667 12 10C12 11.1 11.6167 12.0417 10.85 12.825C10.0833 13.6083 9.13333 14 8 14ZM40 14C38.9 14 37.9583 13.6083 37.175 12.825C36.3917 12.0417 36 11.1 36 10C36 8.86667 36.3917 7.91667 37.175 7.15C37.9583 6.38333 38.9 6 40 6C41.1333 6 42.0833 6.38333 42.85 7.15C43.6167 7.91667 44 8.86667 44 10C44 11.1 43.6167 12.0417 42.85 12.825C42.0833 13.6083 41.1333 14 40 14ZM24 12C22.3333 12 20.9167 11.4167 19.75 10.25C18.5833 9.08333 18 7.66667 18 6C18 4.3 18.5833 2.875 19.75 1.725C20.9167 0.575 22.3333 0 24 0C25.7 0 27.125 0.575 28.275 1.725C29.425 2.875 30 4.3 30 6C30 7.66667 29.425 9.08333 28.275 10.25C27.125 11.4167 25.7 12 24 12Z" fill="#FF634A" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="22" height="36" viewBox="0 0 22 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.5 36L0 31.6L5.7 15.9C6.2 16.3667 6.74167 16.7583 7.325 17.075C7.90833 17.3917 8.53333 17.6333 9.2 17.8L3.7 32.9L0.5 36ZM21.5 36L18.3 32.9L12.8 17.8C13.4667 17.6333 14.0917 17.3917 14.675 17.075C15.2583 16.7583 15.8 16.3667 16.3 15.9L22 31.6L21.5 36ZM11 16C9.33333 16 7.91667 15.4167 6.75 14.25C5.58333 13.0833 5 11.6667 5 10C5 8.7 5.375 7.54167 6.125 6.525C6.875 5.50833 7.83333 4.8 9 4.4V0H13V4.4C14.1667 4.8 15.125 5.50833 15.875 6.525C16.625 7.54167 17 8.7 17 10C17 11.6667 16.4167 13.0833 15.25 14.25C14.0833 15.4167 12.6667 16 11 16ZM11 12C11.5667 12 12.0417 11.8083 12.425 11.425C12.8083 11.0417 13 10.5667 13 10C13 9.43333 12.8083 8.95833 12.425 8.575C12.0417 8.19167 11.5667 8 11 8C10.4333 8 9.95833 8.19167 9.575 8.575C9.19167 8.95833 9 9.43333 9 10C9 10.5667 9.19167 11.0417 9.575 11.425C9.95833 11.8083 10.4333 12 11 12Z" fill="#FF634A" />
    </svg>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: text content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            {/* Phase badge */}
            <div className="inline-flex items-center bg-chevo-dark px-4 py-1 rounded-xl">
              <span className="text-white text-[10px] font-bold uppercase tracking-[2px]">
                Phase 1: Engineering Mastery
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-7xl lg:text-[88px] font-bold leading-none tracking-[-4px] text-chevo-dark">
              Your Missing{" "}
              <span className="text-chevo-red">Semester</span>{" "}
              of
              <br />
              Engineering
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-chevo-text-muted leading-[1.4] max-w-[576px]">
              The curriculum doesn't teach the skills you need to survive today,
              and the tech world isn't waiting. This is the space where students
              build, create, and stay ahead
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Link
                to="/events"
                className="inline-flex items-center justify-center px-10 py-4 rounded-md bg-gradient-to-r from-chevo-red to-chevo-orange text-white text-sm font-bold uppercase tracking-[1.4px] hover:opacity-90 transition-opacity"
              >
                Upcoming Events
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-10 py-4 rounded-md bg-chevo-gray text-chevo-dark text-sm font-bold uppercase tracking-[1.4px] hover:bg-[#D5D5D7] transition-colors"
              >
                Who Are We?
              </Link>
            </div>
          </div>

          {/* Right: image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Decorative blur */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-chevo-orange opacity-20 rounded-lg blur-[20px] pointer-events-none" />
            <div className="relative rounded-lg overflow-hidden shadow-2xl transform rotate-3 bg-chevo-surface">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/acbb0d605ff25c0c34ddce8e9e595b2a10299647?width=957"
                alt="Engineering Workspace"
                className="w-full h-auto max-h-[598px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission Section ── */}
      <section className="bg-chevo-surface px-6 lg:px-8 py-24">
        <div className="max-w-[1280px] mx-auto">
          {/* Heading */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold uppercase tracking-[-1.8px] text-chevo-dark leading-10">
              Our Mission
            </h2>
            <div className="w-24 h-2 bg-chevo-red mt-4" />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Stay Relevant */}
            <div className="bg-white rounded-lg shadow-[0_20px_40px_0_rgba(26,28,29,0.04)] overflow-hidden relative min-h-[308px] p-10 flex flex-col gap-6">
              <div>
                <IconBolt />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-chevo-dark leading-8 mb-4">
                  Stay Relevant
                </h3>
                <p className="text-base text-chevo-text-muted leading-[26px]">
                  Master the tools your lectures skip. from AI Agents &
                  workflows to PCB prototyping to CAD design and 3D printing.
                </p>
              </div>
              {/* Decorative watermark */}
              <div className="absolute bottom-6 right-6 opacity-5 pointer-events-none">
                <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
                  <path d="M10 80C7.25 80 4.89583 79.0208 2.9375 77.0625C0.979167 75.1042 0 72.75 0 70V10C0 7.25 0.979167 4.89583 2.9375 2.9375C4.89583 0.979167 7.25 0 10 0H90C92.75 0 95.1042 0.979167 97.0625 2.9375C99.0208 4.89583 100 7.25 100 10V70C100 72.75 99.0208 75.1042 97.0625 77.0625C95.1042 79.0208 92.75 80 90 80H10ZM10 70H90V20H10V70ZM27.5 65L20.5 58L33.375 45L20.375 32L27.5 25L47.5 45L27.5 65ZM50 65V55H80V65H50Z" fill="#1A1C1D" />
                </svg>
              </div>
            </div>

            {/* Card 2: Real Collaboration (elevated/featured) */}
            <div className="bg-white rounded-lg border-t-4 border-chevo-red shadow-[0_20px_40px_0_rgba(26,28,29,0.04)] min-h-[308px] p-10 flex flex-col gap-6">
              <div>
                <IconPeople />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-chevo-dark leading-8 mb-4">
                  Real Collaboration
                </h3>
                <p className="text-base text-chevo-text-muted leading-[26px]">
                  Work alongside like-minded students on projects that go beyond
                  STM32s, micromice, and really anything from 1st principles
                </p>
              </div>
            </div>

            {/* Card 3: Build Something Real */}
            <div className="bg-white rounded-lg shadow-[0_20px_40px_0_rgba(26,28,29,0.04)] overflow-hidden relative min-h-[308px] p-10 flex flex-col gap-6">
              <div>
                <IconPin />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-chevo-dark leading-8 mb-4">
                  Build Something Real
                </h3>
                <p className="text-base text-chevo-text-muted leading-[26px]">
                  Workshops, design competitions, and flagship projects like
                  Piko — our open-source instructable robot.
                </p>
              </div>
              {/* Decorative watermark */}
              <div className="absolute bottom-6 right-6 opacity-5 pointer-events-none">
                <svg width="90" height="96" viewBox="0 0 90 96" fill="none">
                  <path d="M45 95.25L0 60.25L8.25 54L45 82.5L81.75 54L90 60.25L45 95.25ZM45 70L0 35L45 0L90 35L45 70ZM45 57.25L73.75 35L45 12.75L16.25 35L45 57.25Z" fill="#1A1C1D" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community Quote Section ── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Left: image */}
          <div className="w-full lg:w-1/2 relative flex-shrink-0">
            {/* Decorative border */}
            <div className="absolute -top-6 -right-6 w-48 h-48 rounded-xl border-[8px] border-[rgba(226,191,184,0.20)] pointer-events-none hidden sm:block" />
            {/* Gradient blur */}
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-xl bg-gradient-to-br from-chevo-red to-chevo-orange opacity-30 blur-[32px] pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/9f3a7da91e0e0197b9f8d5d59ff8728b8b284ad8?width=1136"
                alt="Collaborative Students"
                className="w-full h-auto object-cover aspect-video"
              />
            </div>
          </div>

          {/* Right: text */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Label */}
            <span className="text-chevo-red text-xs font-bold uppercase tracking-[3.6px]">
              By Students, For Students
            </span>

            {/* Quote */}
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-tight lg:leading-[56px] tracking-[-1.4px]">
              <span className="text-chevo-dark">"A lab where </span>
              <span className="text-chevo-orange">cooler stuff</span>
              <span className="text-chevo-dark"> actually gets built."</span>
            </h2>

            {/* Description */}
            <p className="text-lg text-chevo-text-muted leading-[29px] pt-4">
              We're UCT students who got tired of waiting for the curriculum to
              catch up. The Chevo Collective is our answer, a hands-on community
              where you can build an LLM, a drone, or a rover without waiting
              for permission.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <p className="text-3xl font-bold text-chevo-dark leading-10">
                  LAUNCHING 2026
                </p>
                <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-chevo-muted-text mt-1">
                  (remove)
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-chevo-dark leading-10">
                  Who can join
                </p>
                <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-chevo-muted-text mt-1">
                  Open to All Faculties
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-20">
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-chevo-red to-chevo-orange px-10 sm:px-20 py-20 sm:py-24 text-center">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-xl blur-[32px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-xl blur-[32px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative flex flex-col items-center gap-8">
            <h2 className="text-4xl sm:text-5xl lg:text-[60px] font-bold text-white leading-tight lg:leading-[60px] tracking-[-3px]">
              Don't miss what's coming
            </h2>
            <p className="text-lg sm:text-xl text-white/80 leading-7 max-w-[672px]">
              Sign up to the mailing list and get a sneak peek of what's in
              store. Be the first to know about workshops, events, and new
              projects.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center justify-center px-12 py-5 rounded-md bg-white text-chevo-red text-sm font-bold uppercase tracking-[2.8px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:bg-white/90 transition-colors"
            >
              Join The Mailing List
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
