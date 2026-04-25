import Image from "next/image";

const projectCards = [
  {
    title: "PIKO",
    src: "/home/projects/piko-cover.jpg",
    alt: "PIKO wearable companion with a tiny screen showing a walking character",
    aspectClassName: "aspect-[16/9]",
    objectClassName: "object-cover object-[42%_center]",
    gradientClassName:
      "bg-gradient-to-t from-black/28 via-transparent to-transparent",
    poseClassName: "project-pile-card--piko",
    priority: true,
  },
  {
    title: "Dronita",
    src: "/home/projects/dronita-cover.jpg",
    alt: "Drone frame and components laid out on a bright blue surface",
    aspectClassName: "aspect-[3/4]",
    objectClassName: "object-cover object-center",
    gradientClassName:
      "bg-gradient-to-t from-black/38 via-black/8 to-transparent",
    poseClassName: "project-pile-card--dronita",
    priority: true,
  },
  {
    title: "Generative Design",
    src: "/home/projects/generative-design.jpg",
    alt: "Black planter with green leaves in front of mountains and a cloudy sky",
    aspectClassName: "aspect-[3/4]",
    objectClassName:
      "object-cover object-[center_28%] brightness-[1.16] saturate-[1.08]",
    gradientClassName: "bg-gradient-to-t from-black/6 via-transparent to-transparent",
    poseClassName: "project-pile-card--ai-pots",
    priority: false,
  },
  {
    title: "Locked Out",
    src: "/home/projects/locked-out.jpg",
    alt: "Dark grayscale city street scene with lit street lamps",
    aspectClassName: "aspect-[16/9]",
    objectClassName: "object-cover object-center",
    gradientClassName:
      "bg-gradient-to-t from-black/36 via-transparent to-transparent",
    poseClassName: "project-pile-card--locked-out",
    priority: false,
  },
  {
    title: "Desk Robot",
    src: "/home/projects/desk-robot.jpg",
    alt: "Desktop robot build thumbnail with a smiling face on a small screen",
    aspectClassName: "aspect-[9/16]",
    objectClassName: "object-cover object-top",
    gradientClassName:
      "bg-gradient-to-t from-black/28 via-black/6 to-transparent",
    poseClassName: "project-pile-card--desk-robot",
    priority: false,
  },
] as const;

export default function HomeProjectPile() {
  return (
    <div className="project-pile relative min-h-[41rem] w-full overflow-visible sm:min-h-[49rem] lg:min-h-[56rem]">
      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),rgba(255,255,255,0)_38%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(245,247,251,0.72))]" />

      <div className="glass-chip pointer-events-none absolute top-4 left-4 z-20 rounded-full px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[2.1px] text-chevo-red sm:top-5 sm:left-5 sm:text-[10px]">
        Our Builds
      </div>

      {projectCards.map((card) => (
        <article
          key={card.title}
          className={`project-pile-card pointer-events-none absolute overflow-hidden rounded-[28px] border border-white/70 bg-white/88 p-1 shadow-[0_24px_50px_-28px_rgba(26,28,29,0.48)] backdrop-blur-sm ${card.poseClassName}`}
        >
          <div
            className={`relative overflow-hidden rounded-[22px] bg-chevo-dark/5 ${card.aspectClassName}`}
          >
            <Image
              alt={card.alt}
              className={card.objectClassName}
              fill
              priority={card.priority}
              sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 42vw, (min-width: 640px) 62vw, 82vw"
              src={card.src}
            />
            <div className={`absolute inset-0 ${card.gradientClassName}`} />
            <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3.5">
              <p className="text-[12px] leading-tight font-bold tracking-[-0.2px] text-white sm:text-sm lg:text-base">
                {card.title}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
