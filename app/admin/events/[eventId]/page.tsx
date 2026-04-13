import type { Metadata } from "next";
import AdminEventEditor from "@/components/AdminEventEditor";
import AdminLogin from "@/components/AdminLogin";
import { getAdminSessionState } from "@/lib/admin-session-server";
import { getDatabaseEventById } from "@/lib/database-events";

export const metadata: Metadata = {
  title: "Edit Event | Chevo Admin",
  description: "Edit a database-backed Chevo event.",
  robots: {
    index: false,
    follow: false,
  },
};

type EditAdminEventPageProps = {
  params: Promise<{
    eventId: string;
  }>;
  searchParams?: Promise<{
    saved?: string | string[];
  }>;
};

export default async function EditAdminEventPage({
  params,
  searchParams,
}: EditAdminEventPageProps) {
  const {
    isAuthenticated,
    defaultCredentials,
    securityMessage,
  } = await getAdminSessionState();

  if (!isAuthenticated) {
    return (
      <AdminLogin
        defaultCredentials={defaultCredentials}
        securityMessage={securityMessage}
      />
    );
  }

  const { eventId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  let event = null;

  try {
    event = await getDatabaseEventById(eventId);
  } catch {
    return (
      <div className="min-h-screen bg-chevo-bg font-grotesk">
        <section className="mx-auto max-w-[900px] px-6 pt-20 pb-20 text-center lg:px-8">
          <div className="glass-panel rounded-[32px] px-8 py-14">
            <p className="text-xs font-bold uppercase tracking-[1.6px] text-chevo-muted-text">
              Database unavailable
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-2.2px] text-chevo-dark">
              We could not load this event
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-chevo-text-muted">
              Check the Supabase credentials and connection, then confirm your
              `events` table is repaired with
              {" "}
              <span className="font-semibold">
                docs/supabase-events-repair.sql
              </span>
              {" "}
              before retrying this page.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-chevo-bg font-grotesk">
        <section className="mx-auto max-w-[900px] px-6 pt-20 pb-20 text-center lg:px-8">
          <div className="glass-panel rounded-[32px] px-8 py-14">
            <p className="text-xs font-bold uppercase tracking-[1.6px] text-chevo-muted-text">
              Event not found
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-2.2px] text-chevo-dark">
              This database event could not be found
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-chevo-text-muted">
              The record may have been deleted or the ID may not match an event
              in your Supabase table.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <section className="mx-auto max-w-[1400px] px-6 pt-12 pb-20 lg:px-8">
        <AdminEventEditor
          mode="edit"
          initialEvent={event}
          initialSuccessMessage={
            (Array.isArray(resolvedSearchParams.saved)
              ? resolvedSearchParams.saved[0]
              : resolvedSearchParams.saved) === "created"
              ? "Event created and saved to the database."
              : ""
          }
        />
      </section>
    </div>
  );
}
