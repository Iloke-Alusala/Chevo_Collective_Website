import type { Metadata } from "next";
import AdminEventEditor from "@/components/AdminEventEditor";
import AdminLogin from "@/components/AdminLogin";
import { getAdminSessionState } from "@/lib/admin-session-server";

export const metadata: Metadata = {
  title: "Create Event | Chevo Admin",
  description: "Create a new database-backed Chevo event.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CreateAdminEventPage() {
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

  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <section className="mx-auto max-w-[1400px] px-6 pt-12 pb-20 lg:px-8">
        <AdminEventEditor mode="create" />
      </section>
    </div>
  );
}
