import Squiggle from "@/components/Squiggle";

const experience = [
  {
    role: "Embodied AI Undergraduate Researcher",
    org: "Su Hao's AI Lab — UC San Diego",
    period: "Mar 2026 — Present",
    detail: "Building RL pipelines for robotic manipulation and sim-to-real transfer.",
  },
  {
    role: "Undergraduate Researcher",
    org: "MURO Lab — UC San Diego",
    period: "Oct 2025 — Present",
    detail: "Developing multi-robot map-merging infrastructure for autonomous TurtleBot4 fleets.",
  },
  {
    role: "Member — Perception & Planning",
    org: "Triton AI — UC San Diego",
    period: "Oct 2025 — Present",
    detail: "LiDAR–camera fusion for FTENTH and path planning for an autonomous go-kart.",
  },
];

export default function ExperienceTimeline() {
  return (
    <section className="py-12">
      <h2 className="font-heading text-2xl font-normal text-parchment mb-2">
        Experience
      </h2>
      <Squiggle />

      <div className="relative">
        <div className="absolute left-0 top-2 bottom-2 w-px bg-surface-border" />

        <div className="flex flex-col gap-8">
          {experience.map((item, i) => (
            <div key={i} className="relative pl-8">
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-sage-deep border-2 border-sage/60" />

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1.5">
                <h3 className="text-parchment font-medium text-base">{item.role}</h3>
                <span className="text-ash text-xs font-mono shrink-0">{item.period}</span>
              </div>
              <p className="text-sage text-sm font-medium mb-1.5">{item.org}</p>
              <p className="text-ash text-sm leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
