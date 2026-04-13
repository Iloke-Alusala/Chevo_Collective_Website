import Link from "next/link";
import Reveal from "@/components/Reveal";

type AdminLoginProps = {
  errorMessage?: string;
  securityMessage?: string | null;
  defaultCredentials?: {
    username: string;
    password: string;
  } | null;
};

export default function AdminLogin({
  errorMessage,
  securityMessage = null,
  defaultCredentials = null,
}: AdminLoginProps) {
  return (
    <div className="min-h-screen bg-chevo-bg font-grotesk">
      <section className="mx-auto max-w-[1200px] px-6 pt-16 pb-20 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="glass-panel rounded-[32px] px-8 py-10 sm:px-10 sm:py-12">
            <div className="flex h-full flex-col justify-between gap-10">
              <div className="space-y-5">
                <span className="glass-chip inline-flex rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-[1.8px] text-chevo-red">
                  Admin Access
                </span>
                <div className="space-y-4">
                  <h1 className="max-w-2xl text-4xl font-bold tracking-[-2.4px] text-chevo-dark sm:text-5xl">
                    Sign in to manage events
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-chevo-text-muted">
                    This is the control room for managing database-backed event
                    records, editing live previews, and keeping the RSVP system
                    ready for real submissions.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="glass-inset rounded-[24px] px-5 py-5">
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                    What you can do
                  </p>
                  <p className="mt-3 text-sm leading-6 text-chevo-dark">
                    Add upcoming or past events, standardize the cards, and
                    control which event is featured on the live page.
                  </p>
                </div>

                <div className="glass-inset rounded-[24px] px-5 py-5">
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                    Current mode
                  </p>
                  <p className="mt-3 text-sm leading-6 text-chevo-dark">
                    Local admin auth at the front door, with event records and
                    RSVPs now backed by Supabase.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="glass-panel rounded-[32px] px-8 py-10 sm:px-10 sm:py-12">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-chevo-dark">
                    Admin Login
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-chevo-text-muted">
                    Enter your admin credentials to open the event workspace.
                  </p>
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-chevo-red/20 bg-[rgba(255,99,74,0.08)] px-4 py-3 text-sm font-medium text-chevo-red">
                    {errorMessage}
                  </div>
                ) : null}

                {securityMessage ? (
                  <div className="rounded-2xl border border-[rgba(255,166,87,0.28)] bg-[rgba(255,245,238,0.85)] px-4 py-3 text-sm font-medium text-[rgb(184,96,18)]">
                    {securityMessage}
                  </div>
                ) : null}

                <form action="/admin/login" method="post" className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                      Username
                    </span>
                    <input
                      type="text"
                      name="username"
                      autoComplete="username"
                      required
                      disabled={Boolean(securityMessage)}
                      className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                      placeholder="admin"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[1.2px] text-chevo-muted-text">
                      Password
                    </span>
                    <input
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      disabled={Boolean(securityMessage)}
                      className="glass-input w-full rounded-2xl px-4 py-3 text-sm text-chevo-dark outline-none"
                      placeholder="••••••••••••"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={Boolean(securityMessage)}
                    className="interactive-button inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-chevo-red to-chevo-orange px-6 py-3.5 text-sm font-bold uppercase tracking-[1.3px] text-white disabled:cursor-not-allowed disabled:opacity-65"
                  >
                    Open Dashboard
                  </button>
                </form>

                {defaultCredentials ? (
                  <div className="glass-inset rounded-[24px] px-5 py-5">
                    <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-chevo-muted-text">
                      Local default credentials
                    </p>
                    <p className="mt-3 text-sm leading-6 text-chevo-dark">
                      Username: <span className="font-semibold">{defaultCredentials.username}</span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-chevo-dark">
                      Password: <span className="font-semibold">{defaultCredentials.password}</span>
                    </p>
                    <p className="mt-3 text-xs leading-5 text-chevo-muted-text">
                      These disappear once you set `CHEVO_ADMIN_USERNAME` and
                      `CHEVO_ADMIN_PASSWORD` in your environment.
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-chevo-muted-text">
                  <Link
                    href="/events"
                    className="interactive-link font-semibold text-chevo-red"
                  >
                    Back to events
                  </Link>
                  <span className="h-1 w-1 rounded-full bg-chevo-red/30" />
                  <span>Local admin access only</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
