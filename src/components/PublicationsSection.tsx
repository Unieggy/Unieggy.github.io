"use client";

import PublicationCard from "@/components/PublicationCard";
import Squiggle from "@/components/Squiggle";
import { useLang } from "@/i18n/LanguageContext";
import { publicationsData } from "@/i18n/translations";

export default function PublicationsSection() {
  const { lang, t } = useLang();

  return (
    <section className="py-12">
      <h2 className="font-heading text-2xl font-normal text-parchment mb-2">
        {t.publications.heading}
      </h2>
      <Squiggle width={220} />

      <p className="-mt-4 mb-6 text-ash text-xs">
        <sup className="text-[1.25em] top-[-0.3em]">*</sup> {t.publications.equalContribution}
        <span className="mx-2 opacity-50">·</span>
        <sup className="text-[1.25em] top-[-0.3em]">†</sup> {t.publications.equalAdvising}
      </p>

      <div className="flex flex-col gap-4">
        {publicationsData.map((pub, i) => (
          <PublicationCard
            key={i}
            title={pub.title[lang]}
            authors={pub.authors}
            venue={pub.venue}
            year={pub.year}
            abstract={pub.abstract[lang]}
            link={pub.link}
            imageSrc={pub.imageSrc}
            videoSrc={pub.videoSrc}
            posterSrc={pub.posterSrc}
            readLabel={t.publications.readPaper}
          />
        ))}
      </div>
    </section>
  );
}
