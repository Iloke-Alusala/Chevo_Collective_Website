"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LOCAL_RSVPS_KEY,
  LOCAL_RSVPS_UPDATED_EVENT,
  normalizeRsvps,
  type EventRsvp,
} from "@/lib/rsvps";

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function readStoredRsvps(): EventRsvp[] {
  if (!canUseStorage()) {
    return [];
  }

  const storedValue = window.localStorage.getItem(LOCAL_RSVPS_KEY);

  if (!storedValue) {
    const seededRsvps = normalizeRsvps([]);
    window.localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(seededRsvps));
    return seededRsvps;
  }

  try {
    const parsed = JSON.parse(storedValue) as EventRsvp[];

    if (!Array.isArray(parsed)) {
      throw new Error("Stored RSVPs value is not an array");
    }

    const normalized = normalizeRsvps(parsed);
    window.localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    const seededRsvps = normalizeRsvps([]);
    window.localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(seededRsvps));
    return seededRsvps;
  }
}

function writeStoredRsvps(rsvps: EventRsvp[]) {
  const normalized = normalizeRsvps(rsvps);

  if (canUseStorage()) {
    window.localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event(LOCAL_RSVPS_UPDATED_EVENT));
  }

  return normalized;
}

export function useLocalRsvps() {
  const [rsvps, setRsvps] = useState<EventRsvp[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncRsvps = () => {
      setRsvps(readStoredRsvps());
      setIsReady(true);
    };

    syncRsvps();
    window.addEventListener("storage", syncRsvps);
    window.addEventListener(LOCAL_RSVPS_UPDATED_EVENT, syncRsvps);

    return () => {
      window.removeEventListener("storage", syncRsvps);
      window.removeEventListener(LOCAL_RSVPS_UPDATED_EVENT, syncRsvps);
    };
  }, []);

  const commit = useCallback(
    (updater: (current: EventRsvp[]) => EventRsvp[]) => {
      const current = readStoredRsvps();
      const next = writeStoredRsvps(updater(current));
      setRsvps(next);
      setIsReady(true);
      return next;
    },
    [],
  );

  const addRsvp = useCallback(
    (rsvp: EventRsvp) => {
      const normalizedEmail = rsvp.email.trim().toLowerCase();
      let result:
        | {
            status: "added" | "duplicate";
            rsvp: EventRsvp;
          }
        | null = null;

      commit((current) => {
        const existingRsvp =
          current.find(
            (item) =>
              item.eventId === rsvp.eventId &&
              item.email.trim().toLowerCase() === normalizedEmail,
          ) ?? null;

        if (existingRsvp) {
          result = {
            status: "duplicate",
            rsvp: existingRsvp,
          };
          return current;
        }

        const nextRsvp = {
          ...rsvp,
          email: normalizedEmail,
        };

        result = {
          status: "added",
          rsvp: nextRsvp,
        };

        return [nextRsvp, ...current];
      });

      return result ?? { status: "duplicate", rsvp };
    },
    [commit],
  );

  const deleteRsvp = useCallback(
    (rsvpId: string) =>
      commit((current) => current.filter((item) => item.id !== rsvpId)),
    [commit],
  );

  const deleteRsvpsForEvent = useCallback(
    (eventId: string) =>
      commit((current) => current.filter((item) => item.eventId !== eventId)),
    [commit],
  );

  const pruneRsvps = useCallback(
    (validEventIds: string[]) => {
      const allowedIds = new Set(validEventIds);

      return commit((current) =>
        current.filter((item) => allowedIds.has(item.eventId)),
      );
    },
    [commit],
  );

  return {
    rsvps,
    isReady,
    addRsvp,
    deleteRsvp,
    deleteRsvpsForEvent,
    pruneRsvps,
  };
}
