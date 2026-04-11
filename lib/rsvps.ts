export const DEGREE_OPTIONS = [
  "Mechatronics Engineering",
  "Electrical and Computer Engineering",
  "Electrical Engineering",
  "Mech and Mechatronics Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "Chemical Engineering",
  "Architecture, Planning & Geomatics",
  "Humanities Faculty",
  "Computer Science",
  "Commerce Faculty",
  "Health Sciences Faculty",
  "Law Faculty",
  "Science Faculty",
  "Other",
] as const;

export type EventRsvp = {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  degreeOption: string;
  degreeOther: string;
  createdAt: string;
};

type LegacyEventRsvp = Partial<EventRsvp> & {
  fullName?: string;
  facultyOrDegree?: string;
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
    firstName: "",
    lastName: "",
    email: "",
    degreeOption: "",
    degreeOther: "",
    createdAt: new Date().toISOString(),
  };
}

function parseLegacyName(fullName?: string) {
  const trimmedName = fullName?.trim() || "";

  if (!trimmedName) {
    return {
      firstName: "",
      lastName: "",
    };
  }

  const [firstName = "", ...rest] = trimmedName.split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function isKnownDegreeOption(value?: string) {
  return DEGREE_OPTIONS.includes(value as (typeof DEGREE_OPTIONS)[number]);
}

export function getRsvpDisplayName(rsvp: Pick<EventRsvp, "firstName" | "lastName">) {
  return [rsvp.firstName, rsvp.lastName].filter(Boolean).join(" ").trim();
}

export function normalizeRsvp(rsvp: LegacyEventRsvp, index = 0): EventRsvp {
  const fallback = createEmptyRsvp(rsvp.eventId?.trim() || "");
  const legacyName = parseLegacyName(rsvp.fullName);
  const legacyDegree = rsvp.facultyOrDegree?.trim() || "";
  const degreeOption = rsvp.degreeOption?.trim()
    ? rsvp.degreeOption.trim()
    : isKnownDegreeOption(legacyDegree)
      ? legacyDegree
      : legacyDegree
        ? "Other"
        : fallback.degreeOption;
  const degreeOther = rsvp.degreeOther?.trim()
    ? rsvp.degreeOther.trim()
    : degreeOption === "Other" && legacyDegree && !isKnownDegreeOption(legacyDegree)
      ? legacyDegree
      : fallback.degreeOther;

  return {
    id: rsvp.id?.trim() || fallback.id || `rsvp-${index + 1}`,
    eventId: rsvp.eventId?.trim() || fallback.eventId,
    firstName: rsvp.firstName?.trim() || legacyName.firstName || fallback.firstName,
    lastName: rsvp.lastName?.trim() || legacyName.lastName || fallback.lastName,
    email: rsvp.email?.trim().toLowerCase() || fallback.email,
    degreeOption,
    degreeOther,
    createdAt: rsvp.createdAt?.trim() || fallback.createdAt,
  };
}

export function normalizeRsvps(rsvps: EventRsvp[]) {
  return rsvps
    .map((rsvp, index) => normalizeRsvp(rsvp, index))
    .filter((rsvp) => rsvp.eventId && rsvp.email && rsvp.firstName && rsvp.lastName);
}
