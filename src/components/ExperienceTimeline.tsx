"use client";

import Squiggle from "@/components/Squiggle";
import { useLang } from "@/i18n/LanguageContext";
import { experienceData } from "@/i18n/translations";

export default function ExperienceTimeline() {
  const { lang, t } = useLang();
  const experience = experienceData;

  return (
    <section className="py-12">
      <h2 className="font-heading text-2xl font-normal text-parchment mb-2">
        {t.experience.heading}
      </h2>
      <Squiggle />

      <div className="relative">
        <div className="absolute left-0 top-2 bottom-2 w-px bg-surface-border" />

        <div className="flex flex-col gap-8">
          {experience.map((item, i) => (
            <div key={i} className="relative pl-8">
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-sage-deep border-2 border-sage/60" />

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1.5">
                <h3 className="text-parchment font-medium text-base">{item.role[lang]}</h3>
                <span className="text-ash text-xs font-mono shrink-0">{item.period}</span>
              </div>
              <p className="text-sage text-sm font-medium mb-1.5">{item.org[lang]}</p>
              <p className="text-ash text-sm leading-relaxed">{item.detail[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
