import { NextResponse, type NextRequest } from "next/server";
import {
  buildAdminEventDraft,
  validateAdminEventDraft,
  type AdminEventDraft,
} from "@/lib/admin-events";
import {
  ADMIN_SESSION_COOKIE,
  isAdminSecurityConfigured,
  isValidAdminSession,
} from "@/lib/admin-auth";
import { isSupabaseRequestError, updateDatabaseEvent } from "@/lib/database-events";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  getClientAddress,
  hasTrustedOrigin,
  isPayloadTooLarge,
} from "@/lib/request-security";

type AdminEventRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: AdminEventRouteContext,
) {
  if (!hasTrustedOrigin(request)) {
    return NextResponse.json({ error: "Blocked request origin." }, { status: 403 });
  }

  if (!isAdminSecurityConfigured()) {
    return NextResponse.json(
      { error: "Admin security is not configured for production." },
      { status: 503 },
    );
  }

  if (isPayloadTooLarge(request, 24_000)) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  const sessionValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isValidAdminSession(sessionValue)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimit = checkRateLimit({
    key: `admin-event-update:${getClientAddress(request)}`,
    limit: 30,
    windowMs: 5 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many admin write attempts. Try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const { eventId } = await context.params;

  try {
    const body = (await request.json()) as Partial<AdminEventDraft>;
    const draft = buildAdminEventDraft({
      ...body,
      id: eventId,
    });
    const validationMessage = validateAdminEventDraft(draft);

    if (validationMessage) {
      return NextResponse.json({ error: validationMessage }, { status: 400 });
    }

    const event = await updateDatabaseEvent(eventId, draft);

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    if (isSupabaseRequestError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "The event could not be updated." },
      { status: 500 },
    );
  }
}
