export type EventStatus = "upcoming" | "past";
export type EventCapacityStatus = "high" | "medium";
export type EventCategory = "Workshop" | "Social" | "Talk";

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: EventCategory;
  organizer: string;
  eventDatetime: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  locationMapValue: string;
  capacityLabel: string;
  capacityStatus: EventCapacityStatus;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  status: EventStatus;
  featured: boolean;
};

export const LOCAL_EVENTS_KEY = "chevo-local-events-v2";
export const LOCAL_EVENTS_UPDATED_EVENT = "chevo-local-events-updated";

export function slugifyText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function getEventStatus(eventDatetime?: string): EventStatus {
  const timestamp = eventDatetime ? new Date(eventDatetime).getTime() : Number.NaN;

  if (Number.isNaN(timestamp)) {
    return "upcoming";
  }

  return timestamp > Date.now() ? "upcoming" : "past";
}

export function getEventPagePath(eventSlug: string) {
  return `/events/${eventSlug}`;
}

export function getEventAnchorPath(eventSlug: string) {
  return `/events#${eventSlug}`;
}

export function getGoogleMapsHref(value?: string) {
  const trimmedValue = value?.trim() || "";

  if (!trimmedValue) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmedValue)}`;
}

export function getDefaultCtaLabel(status: EventStatus) {
  return status === "past" ? "View Details" : "RSVP Now";
}

function normalizeCapacityStatus(value?: string): EventCapacityStatus {
  return value?.trim().toLowerCase() === "medium" ? "medium" : "high";
}

function normalizeCategory(value?: string): EventCategory {
  const normalizedValue = value?.trim().toLowerCase() || "";

  if (normalizedValue === "social") {
    return "Social";
  }

  if (normalizedValue === "talk" || normalizedValue === "talks") {
    return "Talk";
  }

  return "Workshop";
}

function normalizeEventDatetime(value?: string, fallback?: string) {
  const nextValue = value?.trim() || fallback || "";
  const nextTimestamp = new Date(nextValue).getTime();

  if (Number.isNaN(nextTimestamp)) {
    return new Date(Date.now() + 86_400_000).toISOString();
  }

  return new Date(nextTimestamp).toISOString();
}

export function createEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyEvent(): EventItem {
  const id = createEventId();
  const slug = `event-${Date.now()}`;
  const eventDatetime = new Date(Date.now() + 86_400_000).toISOString();
  const status = getEventStatus(eventDatetime);

  return {
    id,
    slug,
    title: "",
    description: "",
    category: "Workshop",
    organizer: "Chevo",
    eventDatetime,
    dateLabel: "",
    timeLabel: "",
    location: "",
    locationMapValue: "",
    capacityLabel: "",
    capacityStatus: "high",
    ctaLabel: getDefaultCtaLabel(status),
    ctaHref: getEventPagePath(slug),
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/001baf8a787375c9a0faa49d89b6dab5fbf00d29?width=808",
    status,
    featured: false,
  };
}

const staticEventSeed: Array<
  Partial<EventItem> & {
    id: string;
    slug: string;
    title: string;
    description: string;
    category: EventCategory;
    organizer: string;
    eventDatetime: string;
    dateLabel: string;
    timeLabel: string;
    location: string;
    locationMapValue: string;
    capacityLabel: string;
    capacityStatus: EventCapacityStatus;
    imageUrl: string;
    featured: boolean;
  }
> = [
  {
    id: "f6be8766-bba8-4dc5-b88c-2410ee4f2a2d",
    slug: "ai-agent-workshop",
    title: "How to Set Up your own AI Assistant",
    description:
      "A practical session on building a personal AI agent from scratch, wiring in high-leverage workflows, and turning it into something you can actually use during the semester.",
    category: "Workshop",
    organizer: "Chevo",
    eventDatetime: "2026-06-01T18:00:00+02:00",
    dateLabel: "May 22",
    timeLabel: "18:00 - 20:00",
    location: "Snape LT1",
    locationMapValue: "Snape LT1 UCT Cape Town",
    capacityLabel: "40 seats",
    capacityStatus: "high",
    imageUrl: "/openclaw.jpg",
    featured: true,
  },
  {
    id: "70f55957-7be4-4805-bf4c-0e22447e0dbc",
    slug: "coffee-chat",
    title: "Coffee Chat",
    description:
      "Meet the collective, see what others are building, and get a low-pressure entry point into the community before the first big build cycle starts.",
    category: "Social",
    organizer: "Chevo",
    eventDatetime: "2026-04-25T17:30:00+02:00",
    dateLabel: "TBC",
    timeLabel: "TBC",
    location: "Plato Coffee",
    locationMapValue: "Plato Coffee, Rondebosch",
    capacityLabel: "Open drop-in",
    capacityStatus: "high",
    imageUrl: "/coffee-chat.jpg",
    featured: false,
  },
];

export function normalizeEvent(event: Partial<EventItem>, index = 0): EventItem {
  const fallback = createEmptyEvent();
  const id = event.id?.trim() || `event-${index + 1}`;
  const slug =
    slugifyText(event.slug || event.title || id) || fallback.slug || `event-${index + 1}`;
  const eventDatetime = normalizeEventDatetime(
    event.eventDatetime,
    fallback.eventDatetime,
  );
  const status = getEventStatus(eventDatetime);

  return {
    id,
    slug,
    title: event.title?.trim() || fallback.title,
    description: event.description?.trim() || fallback.description,
    category: normalizeCategory(event.category || fallback.category),
    organizer: event.organizer?.trim() || fallback.organizer,
    eventDatetime,
    dateLabel: event.dateLabel?.trim() || fallback.dateLabel,
    timeLabel: event.timeLabel?.trim() || fallback.timeLabel,
    location: event.location?.trim() || fallback.location,
    locationMapValue:
      event.locationMapValue?.trim() ||
      event.location?.trim() ||
      fallback.locationMapValue,
    capacityLabel: event.capacityLabel?.trim() || fallback.capacityLabel,
    capacityStatus: normalizeCapacityStatus(
      event.capacityStatus || fallback.capacityStatus,
    ),
    ctaLabel: getDefaultCtaLabel(status),
    ctaHref: getEventPagePath(slug),
    imageUrl: event.imageUrl?.trim() || fallback.imageUrl,
    status,
    featured: Boolean(event.featured),
  };
}

export function normalizeEvents(events: EventItem[]) {
  const featuredSeen: Partial<Record<EventStatus, boolean>> = {};

  return events.map((event, index) => {
    const normalized = normalizeEvent(event, index);
    const alreadyFeatured = featuredSeen[normalized.status];

    if (normalized.featured && !alreadyFeatured) {
      featuredSeen[normalized.status] = true;
      return normalized;
    }

    return {
      ...normalized,
      featured: false,
    };
  });
}

export const defaultEvents: EventItem[] = normalizeEvents(
  staticEventSeed.map((event, index) => normalizeEvent(event, index)),
);
