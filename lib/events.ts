export type EventStatus = "upcoming" | "past";
export type EventCapacityStatus = "high" | "medium";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  organizer: string;
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

export const LOCAL_EVENTS_KEY = "chevo-local-events-v1";
export const LOCAL_EVENTS_UPDATED_EVENT = "chevo-local-events-updated";

export function getEventPagePath(eventId: string) {
  return `/events/${eventId}`;
}

export function getEventAnchorPath(eventId: string) {
  return `/events#${eventId}`;
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

function normalizeCategory(value?: string) {
  const normalizedValue = value?.trim().toLowerCase() || "";

  if (normalizedValue === "social") {
    return "Social";
  }

  if (normalizedValue === "talk" || normalizedValue === "talks") {
    return "Talk";
  }

  return "Workshop";
}

export function createEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyEvent(): EventItem {
  const id = createEventId();

  return {
    id,
    title: "",
    description: "",
    category: "Workshop",
    organizer: "Chevo",
    dateLabel: "",
    timeLabel: "",
    location: "",
    locationMapValue: "",
    capacityLabel: "",
    capacityStatus: "high",
    ctaLabel: getDefaultCtaLabel("upcoming"),
    ctaHref: getEventPagePath(id),
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/001baf8a787375c9a0faa49d89b6dab5fbf00d29?width=808",
    status: "upcoming",
    featured: false,
  };
}

export const defaultEvents: EventItem[] = [
  {
    id: "ai-agent-workshop",
    title: "Building my own AI Agent",
    description:
      "A practical session on building a personal AI agent from scratch, wiring in high-leverage workflows, and turning it into something you can actually use during the semester.",
    category: "Workshop",
    organizer: "Chevo",
    dateLabel: "June 1",
    timeLabel: "18:00 - 20:00",
    location: "Snape LT1",
    locationMapValue: "Snape LT1 UCT Cape Town",
    capacityLabel: "40 seats",
    capacityStatus: "high",
    ctaLabel: "RSVP Now",
    ctaHref: getEventPagePath("ai-agent-workshop"),
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/001baf8a787375c9a0faa49d89b6dab5fbf00d29?width=808",
    status: "upcoming",
    featured: true,
  },
  {
    id: "coffee-chat",
    title: "Coffee Chat",
    description:
      "Meet the collective, see what others are building, and get a low-pressure entry point into the community before the first big build cycle starts.",
    category: "Social",
    organizer: "Chevo",
    dateLabel: "April 25",
    timeLabel: "17:30 - 19:00",
    location: "Plato Coffee",
    locationMapValue: "Plato Coffee UCT Cape Town",
    capacityLabel: "Open drop-in",
    capacityStatus: "high",
    ctaLabel: "RSVP Now",
    ctaHref: getEventPagePath("coffee-chat"),
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/64f08e712d880e32d99d5531dfb0fa0273ba0cf6?width=640",
    status: "upcoming",
    featured: false,
  },
  {
    id: "build-night-kickoff",
    title: "Build Night Kickoff",
    description:
      "A fast-paced evening to form teams, scope project ideas, and choose a build track before the first sprint officially opens.",
    category: "Workshop",
    organizer: "Chevo",
    dateLabel: "May 14",
    timeLabel: "18:30 - 21:00",
    location: "Menzies Workshop",
    locationMapValue: "Menzies Workshop UCT Cape Town",
    capacityLabel: "24 seats",
    capacityStatus: "medium",
    ctaLabel: "RSVP Now",
    ctaHref: getEventPagePath("build-night-kickoff"),
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/93fc97193583200a61fd70b8fa239ac5cd8eaf6f?width=934",
    status: "upcoming",
    featured: false,
  },
  {
    id: "rover-retrospective",
    title: "Rover Systems Retrospective",
    description:
      "A recap session breaking down a past rover build, what worked, what failed, and how we would re-scope the system for the next cycle.",
    category: "Talk",
    organizer: "Chevo",
    dateLabel: "March 12",
    timeLabel: "18:00 - 19:30",
    location: "Mechanical Labs",
    locationMapValue: "Mechanical Labs UCT Cape Town",
    capacityLabel: "Recorded session",
    capacityStatus: "high",
    ctaLabel: "View Details",
    ctaHref: getEventPagePath("rover-retrospective"),
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/acbb0d605ff25c0c34ddce8e9e595b2a10299647?width=957",
    status: "past",
    featured: true,
  },
];

export function normalizeEvent(event: Partial<EventItem>, index = 0): EventItem {
  const fallback = createEmptyEvent();
  const id = event.id?.trim() || `event-${index + 1}`;
  const status = event.status === "past" ? "past" : "upcoming";

  return {
    id,
    title: event.title?.trim() || fallback.title,
    description: event.description?.trim() || fallback.description,
    category: normalizeCategory(event.category || fallback.category),
    organizer: event.organizer?.trim() || fallback.organizer,
    dateLabel: event.dateLabel?.trim() || fallback.dateLabel,
    timeLabel: event.timeLabel?.trim() || fallback.timeLabel,
    location: event.location?.trim() || fallback.location,
    locationMapValue:
      event.locationMapValue?.trim() || event.location?.trim() || fallback.locationMapValue,
    capacityLabel: event.capacityLabel?.trim() || fallback.capacityLabel,
    capacityStatus: normalizeCapacityStatus(event.capacityStatus || fallback.capacityStatus),
    ctaLabel: getDefaultCtaLabel(status),
    ctaHref: getEventPagePath(id),
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
