import "server-only";

import { buildAdminEventPayload, type AdminEventDraft, type DatabaseEventRecord } from "@/lib/admin-events";
import { normalizeEvent, type EventItem } from "@/lib/events";

class SupabaseRequestError extends Error {
  status: number;
  code?: string;

  constructor(
    message: string,
    options: {
      status: number;
      code?: string;
    },
  ) {
    super(message);
    this.name = "SupabaseRequestError";
    this.status = options.status;
    this.code = options.code;
  }
}

function getSupabaseServerConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase server credentials are missing. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local.",
    );
  }

  return {
    restUrl: `${url}/rest/v1`,
    serviceRoleKey,
  };
}

async function readErrorMessage(response: Response) {
  try {
    const error = (await response.json()) as {
      code?: string;
      message?: string;
      details?: string;
    };

    if (error.code === "PGRST204") {
      return new SupabaseRequestError(
        "Supabase still sees the events table as an older shape. Run docs/supabase-events-repair.sql, then docs/supabase-static-events.sql, and try again.",
        {
          status: response.status,
          code: error.code,
        },
      );
    }

    return new SupabaseRequestError(
      error.details
        ? `${error.message || "Supabase request failed"} ${error.details}`
        : error.message || "Supabase request failed",
      {
        status: response.status,
        code: error.code,
      },
    );
  } catch {
    return new SupabaseRequestError("Supabase request failed", {
      status: response.status,
    });
  }
}

async function supabaseAdminFetch<T>(
  path: string,
  init?: RequestInit & {
    prefer?: string;
  },
) {
  const { restUrl, serviceRoleKey } = getSupabaseServerConfig();
  const response = await fetch(`${restUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(init?.prefer ? { Prefer: init.prefer } : {}),
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw await readErrorMessage(response);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
export async function listDatabaseEvents() {
  const rows = await supabaseAdminFetch<DatabaseEventRecord[]>(
    "/events?select=*",
  );

  return [...rows].sort((left, right) => {
    const leftTimestamp = new Date(left.event_datetime).getTime();
    const rightTimestamp = new Date(right.event_datetime).getTime();

    return rightTimestamp - leftTimestamp;
  });
}

export async function getDatabaseEventById(eventId: string) {
  const rows = await supabaseAdminFetch<DatabaseEventRecord[]>(
    `/events?select=*&id=eq.${encodeURIComponent(eventId)}&limit=1`,
  );

  return rows[0] ?? null;
}

export async function getDatabaseEventBySlug(eventSlug: string) {
  const rows = await supabaseAdminFetch<DatabaseEventRecord[]>(
    `/events?select=*&slug=eq.${encodeURIComponent(eventSlug)}&limit=1`,
  );

  return rows[0] ?? null;
}

export async function createDatabaseEvent(draft: AdminEventDraft) {
  const payload = buildAdminEventPayload(draft);
  const rows = await supabaseAdminFetch<DatabaseEventRecord[]>("/events", {
    method: "POST",
    body: JSON.stringify(payload),
    prefer: "return=representation",
  });

  return rows[0] ?? null;
}

export async function updateDatabaseEvent(eventId: string, draft: AdminEventDraft) {
  const payload = buildAdminEventPayload(draft);
  const patchPayload = { ...payload };

  delete patchPayload.id;

  const rows = await supabaseAdminFetch<DatabaseEventRecord[]>(
    `/events?id=eq.${encodeURIComponent(eventId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(patchPayload),
      prefer: "return=representation",
    },
  );

  return rows[0] ?? null;
}

export async function createDatabaseRsvp(input: {
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  degreeOption: string;
  degreeOther: string;
}) {
  const rows = await supabaseAdminFetch<
    Array<{
      id: string;
      created_at: string;
    }>
  >("/rsvp_records", {
    method: "POST",
    body: JSON.stringify({
      event_id: input.eventId,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      degree_option: input.degreeOption.trim(),
      degree_other: input.degreeOther.trim() || null,
    }),
    prefer: "return=representation",
  });

  return rows[0] ?? null;
}

export function isSupabaseRequestError(error: unknown): error is SupabaseRequestError {
  return error instanceof SupabaseRequestError;
}

export function mapDatabaseEventToPublicEvent(record: DatabaseEventRecord): EventItem {
  return normalizeEvent({
    id: record.id,
    slug: record.slug,
    title: record.title,
    description: record.description,
    category: record.event_type,
    organizer: record.organizer_name,
    eventDatetime: record.event_datetime,
    dateLabel: record.date_label,
    timeLabel: record.time_label,
    location: record.location_text,
    locationMapValue: record.google_maps_value ?? record.location_text,
    capacityLabel: record.capacity_label ?? "",
    capacityStatus: record.capacity_status,
    imageUrl: record.image_url,
    featured: record.is_featured,
  });
}
