import type { Metadata } from "next";
import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import AdminLogin from "@/components/AdminLogin";
import { getAdminSessionState } from "@/lib/admin-session-server";
import { listDatabaseEvents } from "@/lib/database-events";

export const metadata: Metadata = {
  title: "All Events | Chevo Admin",
  description: "Browse all database-backed Chevo events.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminEventsPage() {
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

  try {
    const events = await listDatabaseEvents();

    return (
      <div className="min-h-screen bg-chevo-bg font-grotesk">
        <section className="mx-auto max-w-[1320px] px-6 pt-12 pb-20 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[1.6px] text-chevo-muted-text">
                Admin inventory
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-2px] text-chevo-dark">
                View All Events
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-chevo-text-muted">
                Every event currently saved in the database lives here. Click the
                image on any card to jump straight into editing it.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="glass-button interactive-button inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[1.3px] text-chevo-dark"
              >
                Back to Admin
              </Link>
              <Link
                href="/admin/events/new"
                className="interactive-button inline-flex items-center justify-center rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-5 py-2.5 text-xs font-bold uppercase tracking-[1.3px] text-white"
              >
                Create Event
              </Link>
            </div>
          </div>

          <div className="glass-panel mt-8 rounded-[30px] p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/60 pb-4">
              <p className="text-sm font-semibold text-chevo-dark">
                {events.length} database event{events.length === 1 ? "" : "s"}
              </p>
              <p className="text-xs font-bold uppercase tracking-[1.3px] text-chevo-muted-text">
                Sorted by event time
              </p>
            </div>

            <div className="max-h-[72vh] overflow-y-auto pr-1">
              {events.length === 0 ? (
                <div className="glass-inset rounded-[24px] px-6 py-10 text-center">
                  <p className="text-xs font-bold uppercase tracking-[1.4px] text-chevo-muted-text">
                    Empty database
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-chevo-dark">
                    No events are saved yet
                  </h2>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-chevo-text-muted">
                    Create the first database event from the admin workspace,
                    or run
                    {" "}
                    <span className="font-semibold">
                      docs/supabase-static-events.sql
                    </span>
                    {" "}
                    if you want the AI Agent and Coffee launch events ready for
                    RSVP.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="glass-inset rounded-[24px] px-4 py-4 sm:px-5"
                    >
                      <div className="flex gap-4">
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="interactive-media relative h-20 w-20 shrink-0 overflow-hidden rounded-[18px]"
                          aria-label={`Edit ${event.title}`}
                        >
                          <SmartImage
                            src={event.image_url}
                            alt={event.title}
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-bold text-chevo-dark">
                              {event.title}
                            </h2>
                            {event.is_featured ? (
                              <span className="glass-chip rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1.2px] text-chevo-red">
                                Featured
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-2 text-sm leading-6 text-chevo-text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                            {event.description}
                          </p>

                          <div className="mt-4 space-y-2 text-xs leading-5 text-chevo-slate">
                            <p>
                              <span className="font-bold uppercase tracking-[1.1px] text-chevo-muted-text">
                                ID
                              </span>
                              {" "}
                              {event.id}
                            </p>
                            <p>
                              <span className="font-bold uppercase tracking-[1.1px] text-chevo-muted-text">
                                Slug
                              </span>
                              {" "}
                              {event.slug}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen bg-chevo-bg font-grotesk">
        <section className="mx-auto max-w-[900px] px-6 pt-20 pb-20 text-center lg:px-8">
          <div className="glass-panel rounded-[32px] px-8 py-14">
            <p className="text-xs font-bold uppercase tracking-[1.6px] text-chevo-muted-text">
              Database unavailable
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-2.2px] text-chevo-dark">
              We could not load the event inventory
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-chevo-text-muted">
              Check the Supabase credentials and connection, then confirm your
              `events` table is repaired with
              {" "}
              <span className="font-semibold">
                docs/supabase-events-repair.sql
              </span>
              {" "}
              before reloading this page.
            </p>
          </div>
        </section>
      </div>
    );
  }
}
