import type { Metadata } from "next";
import EventsPage from "@/components/EventsPage";

export const metadata: Metadata = {
  title: "Events | Chevo Collective",
  description:
    "Upcoming Chevo Collective workshops, socials, presentations, and community sessions.",
};

export default function EventsRoute() {
  return <EventsPage />;
}
