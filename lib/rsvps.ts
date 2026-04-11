export type EventRsvp = {
  id: string;
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  studentNumber: string;
  facultyOrDegree: string;
  yearOfStudy: string;
  dietaryRequirements: string;
  accessibilityNeeds: string;
  notes: string;
  newsletterOptIn: boolean;
  createdAt: string;
};

export const LOCAL_RSVPS_KEY = "chevo-local-rsvps-v1";
export const LOCAL_RSVPS_UPDATED_EVENT = "chevo-local-rsvps-updated";

export function createRsvpId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `rsvp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyRsvp(eventId: string): EventRsvp {
  return {
    id: createRsvpId(),
    eventId,
    fullName: "",
    email: "",
    phone: "",
    studentNumber: "",
    facultyOrDegree: "",
    yearOfStudy: "",
    dietaryRequirements: "",
    accessibilityNeeds: "",
    notes: "",
    newsletterOptIn: false,
    createdAt: new Date().toISOString(),
  };
}

export function normalizeRsvp(rsvp: Partial<EventRsvp>, index = 0): EventRsvp {
  const fallback = createEmptyRsvp(rsvp.eventId?.trim() || "");

  return {
    id: rsvp.id?.trim() || fallback.id || `rsvp-${index + 1}`,
    eventId: rsvp.eventId?.trim() || fallback.eventId,
    fullName: rsvp.fullName?.trim() || fallback.fullName,
    email: rsvp.email?.trim().toLowerCase() || fallback.email,
    phone: rsvp.phone?.trim() || fallback.phone,
    studentNumber: rsvp.studentNumber?.trim() || fallback.studentNumber,
    facultyOrDegree: rsvp.facultyOrDegree?.trim() || fallback.facultyOrDegree,
    yearOfStudy: rsvp.yearOfStudy?.trim() || fallback.yearOfStudy,
    dietaryRequirements:
      rsvp.dietaryRequirements?.trim() || fallback.dietaryRequirements,
    accessibilityNeeds:
      rsvp.accessibilityNeeds?.trim() || fallback.accessibilityNeeds,
    notes: rsvp.notes?.trim() || fallback.notes,
    newsletterOptIn: Boolean(rsvp.newsletterOptIn),
    createdAt: rsvp.createdAt?.trim() || fallback.createdAt,
  };
}

export function normalizeRsvps(rsvps: EventRsvp[]) {
  return rsvps
    .map((rsvp, index) => normalizeRsvp(rsvp, index))
    .filter((rsvp) => rsvp.eventId && rsvp.email);
}
