export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  image: string;
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
    image: "/iloke-portrait.png",
    summary:
      "Iloke started Chevo Collective to create the kind of student space he wanted to be part of: practical, fast-moving, and deeply builder-oriented. He sets the direction for the community and keeps the mission focused on real engineering momentum.", // TODO: replace
    accentClassName:
      "from-[rgba(255,99,74,0.22)] via-[rgba(255,168,102,0.16)] to-[rgba(255,255,255,0.18)]",
  },
  {
    name: "Lula",
    role: "Executive",
    initials: "LU",
    image: "/lulama-portrait.png",
    summary:
      "Hi, I’m Lula! I’m an Electrical & Computer Engineering student who loves exploring the space where engineering and creativity can mix. I want to do more projects in game development, computer vision, and immersive VR/AR experiences. \n I like building things, learning with others, and turning small ideas into something meaningful. Chevo is a space where I get to do exactly that with other great people.",
    accentClassName:
      "from-[rgba(255,180,110,0.2)] via-[rgba(255,255,255,0.2)] to-[rgba(244,114,182,0.12)]",
  },
  {
    name: "Raf",
    role: "Executive",
    initials: "RF",
    image: "/raf-portrait.png",
    summary:
      "Hello, I'm Raf :), As an Electrical Engineering student I have a passion for combining technical challenges with creative solutions. My favourite topics are hardware design and high performance circuitry. I'm keen to do more IoT, remote sensing and power electronics. \n I like working in a team, finding a new challenges and expanding my knowledge to produce unique solutions. Chevo has encouraged me to keep getting my hand's dirty on projects with other talented people.", 
    accentClassName:
      "from-[rgba(125,211,252,0.16)] via-[rgba(255,255,255,0.2)] to-[rgba(255,99,74,0.14)]",
  },
];
