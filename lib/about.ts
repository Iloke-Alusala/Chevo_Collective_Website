export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  summary: string;
  accentClassName: string;
};

export const aboutIntro =
  "Chevo Collective started from a simple frustration: ambitious students were ready to build, but the curriculum was moving too slowly for the tools, ideas, and pace of modern engineering. What began as a student-led push for more practical momentum has grown into a space for workshops, build sessions, and a community that learns by making.";

export const teamMembers: TeamMember[] = [
  {
    name: "Iloke",
    role: "Founder",
    initials: "IL",
    summary:
      "Iloke started Chevo Collective to create the kind of student space he wanted to be part of: practical, fast-moving, and deeply builder-oriented. He sets the direction for the community and keeps the mission focused on real engineering momentum.",
    accentClassName:
      "from-[rgba(255,99,74,0.22)] via-[rgba(255,168,102,0.16)] to-[rgba(255,255,255,0.18)]",
  },
  {
    name: "Lula",
    role: "Executive",
    initials: "LU",
    summary:
      "Lula helps translate the vision into something students can actually feel when they show up. From shaping the community experience to keeping execution steady, Lula helps Chevo stay warm, welcoming, and well-run.",
    accentClassName:
      "from-[rgba(255,180,110,0.2)] via-[rgba(255,255,255,0.2)] to-[rgba(244,114,182,0.12)]",
  },
  {
    name: "Raf",
    role: "Executive",
    initials: "RF",
    summary:
      "Raf supports the collective on the execution side, helping turn ideas into sessions, structure, and follow-through. He helps keep the team grounded in practical delivery while the platform grows.",
    accentClassName:
      "from-[rgba(125,211,252,0.16)] via-[rgba(255,255,255,0.2)] to-[rgba(255,99,74,0.14)]",
  },
];
