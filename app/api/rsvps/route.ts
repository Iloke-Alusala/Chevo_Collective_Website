import { NextResponse, type NextRequest } from "next/server";
import {
  createDatabaseRsvp,
  isSupabaseRequestError,
} from "@/lib/database-events";
import { defaultEvents, getEventStatus } from "@/lib/events";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  getClientAddress,
  hasTrustedOrigin,
  isPayloadTooLarge,
  isValidEmailAddress,
} from "@/lib/request-security";
import { DEGREE_OPTIONS } from "@/lib/rsvps";

function isValidDegreeOption(value: string) {
  return DEGREE_OPTIONS.includes(value as (typeof DEGREE_OPTIONS)[number]);
}

export async function POST(request: NextRequest) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: "Blocked request origin." }, { status: 403 });
    }

    if (isPayloadTooLarge(request, 4_096)) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    }

    const rateLimit = checkRateLimit({
      key: `rsvp:${getClientAddress(request)}`,
      limit: 8,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many RSVP attempts. Please wait a few minutes and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const eventSlug =
      typeof body.eventSlug === "string" ? body.eventSlug.trim() : "";
    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const degreeOption =
      typeof body.degreeOption === "string" ? body.degreeOption.trim() : "";
    const degreeOther =
      typeof body.degreeOther === "string" ? body.degreeOther.trim() : "";

    const matchedStaticEvent = defaultEvents.find(
      (event) => event.slug === eventSlug,
    );

    if (!matchedStaticEvent) {
      return NextResponse.json({ error: "This event is not available." }, { status: 400 });
    }

    if (!/^[a-z0-9-]{1,100}$/.test(eventSlug)) {
      return NextResponse.json({ error: "Event reference is invalid." }, { status: 400 });
    }

    if (getEventStatus(matchedStaticEvent.eventDatetime) === "past") {
      return NextResponse.json(
        { error: "RSVPs are closed for this event." },
        { status: 409 },
      );
    }

    if (!firstName || !lastName || !email || !degreeOption) {
      return NextResponse.json(
        { error: "Add values for first name, last name, email, and degree option." },
        { status: 400 },
      );
    }

    if (
      firstName.length > 80 ||
      lastName.length > 80 ||
      email.length > 254 ||
      degreeOther.length > 100
    ) {
      return NextResponse.json(
        { error: "One or more RSVP fields are too long." },
        { status: 400 },
      );
    }

    if (!isValidEmailAddress(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (!isValidDegreeOption(degreeOption)) {
      return NextResponse.json({ error: "Choose a valid degree option." }, { status: 400 });
    }

    if (degreeOption === "Other" && !degreeOther) {
      return NextResponse.json(
        { error: "Add your degree or faculty in the custom field." },
        { status: 400 },
      );
    }

    const rsvp = await createDatabaseRsvp({
      eventId: matchedStaticEvent.id,
      firstName,
      lastName,
      email,
      degreeOption,
      degreeOther,
    });

    return NextResponse.json({ rsvp }, { status: 201 });
  } catch (error) {
    if (isSupabaseRequestError(error)) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "An RSVP with this email already exists for this event. Use a different email or contact Chevo to update it.",
          },
          { status: 409 },
        );
      }

      if (error.code === "23503") {
        return NextResponse.json(
          {
            error:
              "RSVPs are temporarily unavailable for this event while the database record is being prepared. Please try again shortly.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "The RSVP could not be saved right now." },
      { status: 500 },
    );
  }
}
