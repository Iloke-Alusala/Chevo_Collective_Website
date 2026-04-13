import type { Metadata } from "next";
import EventSignupPage from "@/components/EventSignupPage";
import { defaultEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Event RSVP | Chevo Collective",
  description:
    "Event details and RSVP flow for Chevo Collective workshops, socials, and build sessions.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return defaultEvents.map((event) => ({
    eventId: event.slug,
  }));
}

type EventDetailRouteProps = {
  params: Promise<{
    eventId: string;
  }>;
};

export default async function EventDetailRoute({
  params,
}: EventDetailRouteProps) {
  const { eventId } = await params;

  return <EventSignupPage eventSlug={eventId} />;
}
