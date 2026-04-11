import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import {
  getEventPagePath,
  getGoogleMapsHref,
  type EventItem,
} from "@/lib/events";

type EventCardProps = {
  event: EventItem;
  variant?: "featured" | "standard";
  className?: string;
};

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path
        d="M7.10208 5.25H0V4.08333H7.10208L3.83542 0.816667L4.66667 0L9.33333 4.66667L4.66667 9.33333L3.83542 8.51667L7.10208 5.25Z"
        fill="#B12C19"
      />
    </svg>
  );
}

export default function EventCard({
  event,
  variant = "standard",
  className = "",
}: EventCardProps) {
  const isFeatured = variant === "featured";
  const locationHref = getGoogleMapsHref(event.locationMapValue);
  const tagItems = [
    { label: event.category, tone: "category" },
    { label: event.organizer, tone: "organizer" },
    { label: event.status, tone: "status" },
  ].filter((item) => item.label);
  const metaItems = [
    { label: "Date", value: event.dateLabel },
    { label: "Time", value: event.timeLabel },
    { label: "Capacity", value: event.capacityLabel },
    { label: "Location", value: event.location, href: locationHref },
  ].filter((item) => item.value);

  return (
    <article
      id={event.id}
      className={`glass-panel interactive-surface scroll-mt-28 overflow-hidden rounded-[28px] ${className} ${
        isFeatured
          ? "border-chevo-orange/15 bg-[linear-gradient(135deg,rgba(255,245,238,0.94),rgba(255,255,255,0.82))] shadow-[0_22px_40px_rgba(255,99,74,0.08)]"
          : ""
      }`}
    >
      <div className="grid gap-0 md:grid-cols-[minmax(0,33%)_minmax(0,67%)]">
        <div className="p-5 md:p-6">
          <div className="glass-inset relative flex h-full min-h-[240px] items-center justify-center overflow-hidden rounded-[22px] px-4 py-5 md:min-h-[100%]">
            <SmartImage
              src={event.imageUrl}
              alt={event.title}
              priority={isFeatured}
              sizes="(min-width: 1280px) 31vw, (min-width: 768px) 33vw, 100vw"
              className="object-contain transition-transform duration-[640ms] ease-[var(--ease-emphasized)]"
            />
          </div>
        </div>

        <div className="grid border-t border-white/55 p-6 md:grid-cols-2 md:gap-x-3 md:border-t-0 md:border-l md:border-white/55 md:p-7 lg:p-8">
          <div className="event-chip-fan md:col-span-2">
            {tagItems.map((item) => (
              <span
                key={`${event.id}-${item.label}`}
                className={`event-chip-fan__chip bg-black glass-chip rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1px] ${
                  item.tone === "category"
                    ? "text-[#ff8d85]"
                    : item.tone === "organizer"
                      ? "text-chevo-dark"
                      : "text-chevo-slate"
                } ${item.tone === "category" ? "font-black" : ""}`}
              >
                {item.label}
              </span>
            ))}
          </div>

          <div className="mt-5 space-y-3 md:col-span-2 md:mt-4">
            <div className="space-y-3">
              <h3
                className={`font-bold tracking-[-0.9px] text-chevo-dark ${
                  isFeatured
                    ? "text-[28px] leading-[34px] sm:text-[31px]"
                    : "text-[24px] leading-[31px] sm:text-[26px]"
                }`}
              >
                {event.title}
              </h3>
              <p className="max-w-4xl text-[15px] leading-7 text-chevo-text-muted">
                {event.description}
              </p>
            </div>
          </div>

          {metaItems.length
            ? metaItems.map((item) => (
                <div
                  key={item.label}
                  className="glass-inset mt-3 min-h-[94px] rounded-2xl px-4 py-4 md:mt-4"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                    {item.label}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-base leading-7 font-semibold text-chevo-dark">
                      {item.value}
                    </p>
                    {item.label === "Location" && item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${event.location} in Google Maps`}
                        className="interactive-link inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-base"
                      >
                        📍
                      </a>
                    ) : null}
                  </div>
                </div>
              ))
            : null}

          <div className="mt-5 flex justify-center border-t border-white/60 pt-5 md:col-span-2 md:mt-6">
            <Link
              href={getEventPagePath(event.id)}
              className="interactive-button inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-3 text-sm font-black uppercase tracking-[1.2px] text-white shadow-[0_16px_32px_-18px_rgba(177,44,25,0.75)]"
            >
              {event.ctaLabel}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
