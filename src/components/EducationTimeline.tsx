import Squiggle from "@/components/Squiggle";

const education = [
  {
    degree: "B.S. in Electrical Engineering & Data Science",
    institution: "UC San Diego",
    period: "2025 — 2029",
  }
];

export default function EducationTimeline() {
  return (
    <section className="py-12">
      <h2 className="font-heading text-2xl font-normal text-parchment mb-2">
        Education
      </h2>
      <Squiggle />

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-0 top-2 bottom-2 w-px bg-surface-border" />

        <div className="flex flex-col gap-8">
          {education.map((item, i) => (
            <div key={i} className="relative pl-8">
              {/* Dot */}
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-sage-deep border-2 border-sage/60" />

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1.5">
                <h3 className="text-parchment font-medium text-base">
                  {item.degree}
                </h3>
                <span className="text-ash text-xs font-mono shrink-0">
                  {item.period}
                </span>
              </div>
              <p className="text-sage text-sm font-medium mb-1.5">
                {item.institution}
              </p>
              {"description" in item && (
                <p className="text-ash text-sm leading-relaxed">
                  {String(item.description)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
