import LeaderboardTable from "@/components/LeaderboardTable";

export const dynamic = "force-static";

export default function LeaderboardPage() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8">
      <div className="mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-[1.2px] text-chevo-red">
            Chevo Collective
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-[-2px] text-chevo-dark sm:text-5xl">
            Leaderboard
          </h1>
        </div>
      </div>
      <p className="mb-6 max-w-2xl text-base leading-7 text-chevo-text-muted">
        Live standings for current teams. Sort by team, points, or last update.
      </p>
      <LeaderboardTable />
      <div className="mt-6 text-xs text-chevo-muted-text">
        *Data shown is placeholder. Wire this to your source of truth or an API
        route when ready.
      </div>
    </section>
  );
}
