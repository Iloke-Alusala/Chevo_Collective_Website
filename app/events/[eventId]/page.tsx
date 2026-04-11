import type { Metadata } from "next";
import EventSignupPage from "@/components/EventSignupPage";

export const metadata: Metadata = {
  title: "Event RSVP | Chevo Collective",
  description:
    "Event details and local RSVP flow for Chevo Collective workshops, socials, and build sessions.",
};

type EventDetailRouteProps = {
  params: Promise<{
    eventId: string;
  }>;
};

export default async function EventDetailRoute({
  params,
}: EventDetailRouteProps) {
  const { eventId } = await params;

  return <EventSignupPage eventId={eventId} />;
}
