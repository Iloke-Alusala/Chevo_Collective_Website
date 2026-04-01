import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#F1F5F9]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left: brand + copyright */}
        <div className="flex flex-col gap-2">
          <span className="text-[#0F172A] font-bold text-lg leading-7">
            Chevo Collective
          </span>
          <span className="text-chevo-muted-text text-xs font-normal uppercase tracking-[1.2px]">
            © 2026 Chevo Collective
          </span>
        </div>

        {/* Right: links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <a
            href="#"
            className="text-chevo-muted-text text-xs uppercase tracking-[1.2px] hover:text-chevo-dark transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-chevo-muted-text text-xs uppercase tracking-[1.2px] hover:text-chevo-dark transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-chevo-muted-text text-xs uppercase tracking-[1.2px] hover:text-chevo-dark transition-colors"
          >
            Instagram
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-chevo-muted-text text-xs uppercase tracking-[1.2px] hover:text-chevo-dark transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
