"use client";

import { useMemo, useState } from "react";
import { sortTeams } from "@/lib/data";

type SortKey = "name" | "points" | "lastUpdate";
type SortDir = "asc" | "desc";

export default function LeaderboardTable() {
  const [key, setKey] = useState<SortKey>("points");
  const [dir, setDir] = useState<SortDir>("desc");

  const data = useMemo(() => sortTeams(key, dir), [key, dir]);

  function toggle(nextKey: SortKey) {
    if (key === nextKey) {
      setDir(dir === "asc" ? "desc" : "asc");
    } else {
      setKey(nextKey);
      setDir("desc");
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-chevo-gray bg-white shadow-[0_20px_40px_0_rgba(26,28,29,0.04)]">
      <table className="min-w-full text-sm">
        <thead className="bg-chevo-surface">
          <tr className="text-left">
            <Th onClick={() => toggle("name")} active={key === "name"} dir={dir}>
              Team
            </Th>
            <Th>Members</Th>
            <Th
              onClick={() => toggle("points")}
              active={key === "points"}
              dir={dir}
              className="w-32"
            >
              Points
            </Th>
            <Th
              onClick={() => toggle("lastUpdate")}
              active={key === "lastUpdate"}
              dir={dir}
              className="w-40"
            >
              Last Update
            </Th>
          </tr>
        </thead>
        <tbody>
          {data.map((t) => (
            <tr
              key={t.name}
              className="border-t border-chevo-gray/70 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-chevo-surface/50"
            >
              <td className="px-4 py-4 font-semibold text-chevo-dark">{t.name}</td>
              <td className="px-4 py-4 text-chevo-text-muted">
                {t.members.join(", ")}
              </td>
              <td className="px-4 py-4 font-semibold text-chevo-red">
                {t.points}
              </td>
              <td className="px-4 py-4 text-chevo-dark">
                {new Date(t.lastUpdate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  dir,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  dir?: "asc" | "desc";
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-[1.2px] ${className} ${
        active ? "text-chevo-red" : "text-chevo-dark"
      }`}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="interactive-link inline-flex items-center gap-1"
        >
          {children}
          {active ? (dir === "asc" ? "▲" : "▼") : ""}
        </button>
      ) : (
        children
      )}
    </th>
  );
}
