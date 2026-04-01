export type Team = {
  name: string;
  members: string[];
  points: number;
  lastUpdate: string; // ISO date
};

export type SortableTeamKey = "name" | "points" | "lastUpdate";

export const TEAMS: Team[] = [
  { name: "Piko Pioneers", members: ["A. Ncube", "Z. Patel", "K. Moyo", "D. Smith"], points: 82, lastUpdate: "2025-08-09" },
  { name: "Micromouse Mavericks", members: ["L. Lingela", "R. Cardoso", "I. Alusala", "M. Dube"], points: 76, lastUpdate: "2025-08-09" },
  { name: "Rotor Rebels", members: ["S. Naidoo", "B. Khan", "T. Maseko", "H. Chen"], points: 71, lastUpdate: "2025-08-10" },
  { name: "Visioneers", members: ["C. Jacobs", "P. Ndlovu", "Y. Kim", "E. Muller"], points: 68, lastUpdate: "2025-08-08" },
];

export function sortTeams(by: SortableTeamKey, dir: "asc" | "desc") {
  return [...TEAMS].sort((a, b) => {
    const av = a[by];
    const bv = b[by];

    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}
