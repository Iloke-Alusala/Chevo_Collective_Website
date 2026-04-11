import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import {
  ADMIN_SESSION_COOKIE,
  getDefaultAdminHint,
  isValidAdminSession,
  usingDefaultAdminCredentials,
} from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin | Chevo Collective",
  description:
    "Local event administration dashboard for managing the public Chevo Collective event cards.",
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
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = isValidAdminSession(sessionValue);

  if (!isAuthenticated) {
    const errorParam = Array.isArray(resolvedSearchParams.error)
      ? resolvedSearchParams.error[0]
      : resolvedSearchParams.error;

    return (
      <AdminLogin
        errorMessage={
          errorParam === "invalid"
            ? "Those admin details did not match. Try again."
            : undefined
        }
        defaultCredentials={
          usingDefaultAdminCredentials() ? getDefaultAdminHint() : null
        }
      />
    );
  }

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 pt-8 lg:px-8">
        <div className="glass-panel flex flex-col gap-4 rounded-[28px] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
              Admin session active
            </p>
            <p className="mt-1 text-sm leading-6 text-chevo-dark">
              You&apos;re signed in locally and can now manage events.
            </p>
          </div>

          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="interactive-button rounded-full border border-white/70 bg-white/75 px-5 py-2.5 text-xs font-bold uppercase tracking-[1.3px] text-chevo-dark"
            >
              Sign Out
            </button>
          </form>
        </div>
      </section>

      <AdminDashboard />
    </>
  );
}
