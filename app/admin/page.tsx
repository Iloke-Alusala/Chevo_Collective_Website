import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "@/components/AdminLogin";
import { getAdminSessionState } from "@/lib/admin-session-server";

export const metadata: Metadata = {
  title: "Admin | Chevo Collective",
  description:
    "Database-backed event administration for Chevo Collective.",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminPageProps = {
  searchParams?: Promise<{
    error?: string | string[];
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const {
    isAuthenticated,
    defaultCredentials,
    securityMessage,
  } = await getAdminSessionState();

  if (!isAuthenticated) {
    const errorParam = Array.isArray(resolvedSearchParams.error)
      ? resolvedSearchParams.error[0]
      : resolvedSearchParams.error;

    return (
      <AdminLogin
        errorMessage={
          errorParam === "invalid"
            ? "Those admin details did not match. Try again."
            : errorParam === "blocked"
              ? "This request was blocked for security reasons. Reload the page and try again."
              : errorParam === "rate-limit"
                ? "Too many admin login attempts. Wait a few minutes and try again."
                : errorParam === "setup"
                  ? securityMessage || "Admin login is not configured for production yet."
            : undefined
        }
        securityMessage={securityMessage}
        defaultCredentials={defaultCredentials}
      />
    );
  }

  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <section className="mx-auto max-w-[1180px] px-6 pt-12 pb-20 lg:px-8">
        <div className="glass-panel rounded-[32px] px-8 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[1.6px] text-chevo-muted-text">
                Chevo Admin
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-2px] text-chevo-dark sm:text-5xl">
                Event Management
              </h1>
              <p className="mt-4 text-base leading-7 text-chevo-text-muted">
                Manage the database event inventory from one place. Public
                events are still static in this V1, with the public site pinned
                to the AI Agent and Coffee event set while RSVPs and admin
                event records are backed by Supabase.
              </p>
            </div>

            <form action="/admin/logout" method="post">
              <button
                type="submit"
                className="glass-button interactive-button inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[1.3px] text-chevo-dark"
              >
                Sign Out
              </button>
            </form>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link
              href="/admin/events"
              className="glass-inset interactive-surface rounded-[26px] px-6 py-6"
            >
              <p className="text-xs font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                Database inventory
              </p>
              <h2 className="mt-3 text-2xl font-bold text-chevo-dark">
                View All Events
              </h2>
              <p className="mt-3 text-sm leading-6 text-chevo-text-muted">
                Open the two-column event grid, inspect the event IDs, and jump
                straight into editing from the image.
              </p>
            </Link>

            <Link
              href="/admin/events/new"
              className="glass-inset interactive-surface rounded-[26px] px-6 py-6"
            >
              <p className="text-xs font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                Create flow
              </p>
              <h2 className="mt-3 text-2xl font-bold text-chevo-dark">
                Create Event
              </h2>
              <p className="mt-3 text-sm leading-6 text-chevo-text-muted">
                Start a new database event record and preview the public-facing
                event card while you build it.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
