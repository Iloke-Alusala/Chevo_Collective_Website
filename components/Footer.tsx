import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-chevo-footer-bg">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center lg:px-8">
        <div className="flex flex-col gap-2">
          <span className="text-lg leading-7 font-bold text-[#0F172A]">
            Chevo Collective
          </span>
          <span className="text-xs font-normal uppercase tracking-[1.2px] text-chevo-muted-text">
            © 2026 Chevo Collective
          </span>
        </div>

        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/#about"
            className="interactive-link text-xs uppercase tracking-[1.2px] text-chevo-muted-text hover:text-chevo-dark"
          >
            About
          </Link>
          <Link
            href="/events"
            className="interactive-link text-xs uppercase tracking-[1.2px] text-chevo-muted-text hover:text-chevo-dark"
          >
            Events
          </Link>
          <a
            href="https://mailchi.mp/82be5e27abf3/chevocollective"
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-link text-xs uppercase tracking-[1.2px] text-chevo-muted-text hover:text-chevo-dark"
          >
            Mailing List
          </a>
          <a
            href="mailto:chevocollective@gmail.com"
            className="interactive-link text-xs uppercase tracking-[1.2px] text-chevo-muted-text hover:text-chevo-dark"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
