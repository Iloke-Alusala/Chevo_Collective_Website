"use client";

import { useCallback, useEffect, useState } from "react";
import {
  defaultEvents,
  LOCAL_EVENTS_KEY,
  LOCAL_EVENTS_UPDATED_EVENT,
  normalizeEvents,
  type EventItem,
} from "@/lib/events";

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function readStoredEvents(): EventItem[] {
  if (!canUseStorage()) {
    return defaultEvents;
  }

  const storedValue = window.localStorage.getItem(LOCAL_EVENTS_KEY);

  if (!storedValue) {
    const seededEvents = normalizeEvents(defaultEvents);
    window.localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(seededEvents));
    return seededEvents;
  }

  try {
    const parsed = JSON.parse(storedValue) as EventItem[];

    if (!Array.isArray(parsed)) {
      throw new Error("Stored events value is not an array");
    }

    const normalized = normalizeEvents(parsed);
    window.localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    const seededEvents = normalizeEvents(defaultEvents);
    window.localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(seededEvents));
    return seededEvents;
  }
}

function writeStoredEvents(events: EventItem[]) {
  const normalized = normalizeEvents(events);

  if (canUseStorage()) {
    window.localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event(LOCAL_EVENTS_UPDATED_EVENT));
  }

  return normalized;
}

export function useLocalEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncEvents = () => {
      setEvents(readStoredEvents());
      setIsReady(true);
    };

    syncEvents();
    window.addEventListener("storage", syncEvents);
    window.addEventListener(LOCAL_EVENTS_UPDATED_EVENT, syncEvents);

    return () => {
      window.removeEventListener("storage", syncEvents);
      window.removeEventListener(LOCAL_EVENTS_UPDATED_EVENT, syncEvents);
    };
  }, []);

  const commit = useCallback((updater: (current: EventItem[]) => EventItem[]) => {
    const current = readStoredEvents();
    const next = writeStoredEvents(updater(current));
    setEvents(next);
    setIsReady(true);
    return next;
  }, []);

  const upsertEvent = useCallback(
    (event: EventItem) =>
      commit((current) => {
        const existingIndex = current.findIndex((item) => item.id === event.id);

        if (existingIndex === -1) {
          return [
            event,
            ...current.map((item) =>
              event.featured && item.status === event.status
                ? {
                    ...item,
                    featured: false,
                  }
                : item,
            ),
          ];
        }

        return current.map((item) => {
          if (item.id === event.id) {
            return event;
          }

          if (event.featured && item.status === event.status) {
            return {
              ...item,
              featured: false,
            };
          }

          return item;
        });
      }),
    [commit],
  );

  const deleteEvent = useCallback(
    (eventId: string) =>
      commit((current) => current.filter((item) => item.id !== eventId)),
    [commit],
  );

  const resetEvents = useCallback(() => {
    const seeded = writeStoredEvents(defaultEvents);
    setEvents(seeded);
    setIsReady(true);
    return seeded;
  }, []);

  return {
    events,
    isReady,
    upsertEvent,
    deleteEvent,
    resetEvents,
  };
}
