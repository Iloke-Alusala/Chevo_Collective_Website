import {
  getDefaultCtaLabel,
  getEventPagePath,
  getEventStatus,
  normalizeEvent,
  slugifyText,
  type EventCapacityStatus,
  type EventItem,
} from "@/lib/events";
import { isSafeHttpUrl } from "@/lib/request-security";

export const DATABASE_EVENT_TYPES = ["Workshop", "Social", "Talk"] as const;

export type DatabaseEventType = (typeof DATABASE_EVENT_TYPES)[number];

export type DatabaseEventRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  event_type: DatabaseEventType;
  organizer_name: string;
  event_datetime: string;
  date_label: string;
  time_label: string;
  location_text: string;
  google_maps_value: string | null;
  capacity_label: string | null;
  capacity_status: EventCapacityStatus;
  image_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type DatabaseEventMutationInput = Omit<
  DatabaseEventRecord,
  "created_at" | "updated_at" | "id"
> & {
  id?: string;
};

export type AdminEventDraft = {
  id: string;
  slug: string;
  title: string;
  description: string;
  eventType: DatabaseEventType;
  organizerName: string;
  eventDatetime: string;
  dateLabel: string;
  timeLabel: string;
  locationText: string;
  googleMapsValue: string;
  capacityLabel: string;
  capacityStatus: EventCapacityStatus;
  imageUrl: string;
  isFeatured: boolean;
};

const DEFAULT_EVENT_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/001baf8a787375c9a0faa49d89b6dab5fbf00d29?width=808";

function toDateTimeLocalValue(value: string) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "";
  }

  const date = new Date(timestamp);
  const timezoneOffset = date.getTimezoneOffset();
  const normalizedDate = new Date(timestamp - timezoneOffset * 60_000);

  return normalizedDate.toISOString().slice(0, 16);
}

function toIsoDateTime(value: string) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "";
  }

  return new Date(timestamp).toISOString();
}

export function createEmptyAdminEventDraft(): AdminEventDraft {
  return {
    id: "",
    slug: "",
    title: "",
    description: "",
    eventType: "Workshop",
    organizerName: "Chevo",
    eventDatetime: "",
    dateLabel: "",
    timeLabel: "",
    locationText: "",
    googleMapsValue: "",
    capacityLabel: "",
    capacityStatus: "high",
    imageUrl: DEFAULT_EVENT_IMAGE,
    isFeatured: false,
  };
}

export function buildAdminEventDraft(
  source?: Partial<AdminEventDraft> | DatabaseEventRecord,
): AdminEventDraft {
  const fallback = createEmptyAdminEventDraft();

  if (!source) {
    return fallback;
  }

  if ("event_type" in source) {
    return {
      id: source.id,
      slug: source.slug,
      title: source.title,
      description: source.description,
      eventType: source.event_type,
      organizerName: source.organizer_name,
      eventDatetime: toDateTimeLocalValue(source.event_datetime),
      dateLabel: source.date_label,
      timeLabel: source.time_label,
      locationText: source.location_text,
      googleMapsValue: source.google_maps_value ?? "",
      capacityLabel: source.capacity_label ?? "",
      capacityStatus: source.capacity_status,
      imageUrl: source.image_url,
      isFeatured: source.is_featured,
    };
  }

  return {
    id: source.id?.trim() || fallback.id,
    slug: source.slug?.trim() || fallback.slug,
    title: source.title?.trim() || fallback.title,
    description: source.description?.trim() || fallback.description,
    eventType: source.eventType || fallback.eventType,
    organizerName: source.organizerName?.trim() || fallback.organizerName,
    eventDatetime: source.eventDatetime?.trim() || fallback.eventDatetime,
    dateLabel: source.dateLabel?.trim() || fallback.dateLabel,
    timeLabel: source.timeLabel?.trim() || fallback.timeLabel,
    locationText: source.locationText?.trim() || fallback.locationText,
    googleMapsValue: source.googleMapsValue?.trim() || fallback.googleMapsValue,
    capacityLabel: source.capacityLabel?.trim() || fallback.capacityLabel,
    capacityStatus: source.capacityStatus || fallback.capacityStatus,
    imageUrl: source.imageUrl?.trim() || fallback.imageUrl,
    isFeatured: Boolean(source.isFeatured),
  };
}

export function validateAdminEventDraft(draft: AdminEventDraft) {
  const missingFields: string[] = [];

  if (!draft.slug.trim()) {
    missingFields.push("Slug");
  }
  if (!draft.title.trim()) {
    missingFields.push("Title");
  }
  if (!draft.description.trim()) {
    missingFields.push("Description");
  }
  if (!draft.eventDatetime.trim()) {
    missingFields.push("Event date & time");
  }
  if (!draft.dateLabel.trim()) {
    missingFields.push("Date label");
  }
  if (!draft.timeLabel.trim()) {
    missingFields.push("Time label");
  }
  if (!draft.locationText.trim()) {
    missingFields.push("Location");
  }
  if (!draft.imageUrl.trim()) {
    missingFields.push("Image URL");
  }

  if (missingFields.length) {
    return `Add values for: ${missingFields.join(", ")}.`;
  }

  if (!/^[a-z0-9-]+$/.test(draft.slug.trim())) {
    return "Slug can only use lowercase letters, numbers, and hyphens.";
  }

  if (Number.isNaN(new Date(draft.eventDatetime).getTime())) {
    return "Event date & time must be a valid datetime value.";
  }

  if (
    draft.slug.length > 80 ||
    draft.title.length > 120 ||
    draft.organizerName.length > 80 ||
    draft.dateLabel.length > 40 ||
    draft.timeLabel.length > 60 ||
    draft.locationText.length > 120 ||
    draft.capacityLabel.length > 60 ||
    draft.googleMapsValue.length > 300 ||
    draft.description.length > 1_200
  ) {
    return "One or more event fields are too long.";
  }

  if (!isSafeHttpUrl(draft.imageUrl.trim())) {
    return "Image URL must be a valid http or https URL.";
  }

  return "";
}

export function buildAdminEventPayload(
  draft: AdminEventDraft,
): DatabaseEventMutationInput {
  const nextId = draft.id.trim();

  return {
    ...(nextId ? { id: nextId } : {}),
    slug: draft.slug.trim(),
    title: draft.title.trim(),
    description: draft.description.trim(),
    event_type: draft.eventType,
    organizer_name: draft.organizerName.trim() || "Chevo",
    event_datetime: toIsoDateTime(draft.eventDatetime),
    date_label: draft.dateLabel.trim(),
    time_label: draft.timeLabel.trim(),
    location_text: draft.locationText.trim(),
    google_maps_value: draft.googleMapsValue.trim() || null,
    capacity_label: draft.capacityLabel.trim() || null,
    capacity_status: draft.capacityStatus,
    image_url: draft.imageUrl.trim(),
    is_featured: draft.isFeatured,
  };
}

export function buildPreviewEventFromDraft(draft: AdminEventDraft): EventItem {
  const normalizedSlug =
    slugifyText(draft.slug || draft.title || draft.id || "preview-event") ||
    "preview-event";
  const previewId = draft.id || "preview-event";
  const previewDatetime =
    toIsoDateTime(draft.eventDatetime) ||
    new Date(Date.now() + 86_400_000).toISOString();
  const status = getEventStatus(previewDatetime);

  return normalizeEvent({
    id: previewId,
    slug: normalizedSlug,
    title: draft.title || "Untitled Event",
    description:
      draft.description ||
      "Describe the event here so the live preview reflects the public card.",
    category: draft.eventType,
    organizer: draft.organizerName || "Chevo",
    eventDatetime: previewDatetime,
    dateLabel: draft.dateLabel || "TBD",
    timeLabel: draft.timeLabel || "TBD",
    location: draft.locationText || "TBD",
    locationMapValue: draft.googleMapsValue || draft.locationText,
    capacityLabel: draft.capacityLabel || "Capacity TBD",
    capacityStatus: draft.capacityStatus,
    imageUrl: draft.imageUrl || DEFAULT_EVENT_IMAGE,
    featured: draft.isFeatured,
    ctaLabel: getDefaultCtaLabel(status),
    ctaHref: getEventPagePath(normalizedSlug),
    status,
  });
}
