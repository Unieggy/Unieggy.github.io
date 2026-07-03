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

      <div className="flex flex-col gap-4">
        {publicationsData.map((pub, i) => (
          <PublicationCard
            key={i}
            title={pub.title[lang]}
            venue={pub.venue}
            year={pub.year}
            abstract={pub.abstract[lang]}
            link={pub.link}
            imageSrc={pub.imageSrc}
            readLabel={t.publications.readPaper}
          />
        ))}
      </div>
    </section>
  );
}
