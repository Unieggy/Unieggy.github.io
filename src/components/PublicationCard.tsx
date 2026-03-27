import { ArrowUpRight } from "lucide-react";

interface Publication {
  title: string;
  venue: string;
  year: string;
  abstract: string;
  link: string;
  imageSrc?: string;
}

export default function PublicationCard({
  title,
  venue,
  year,
  abstract,
  link,
  imageSrc,
}: Publication) {
  return (
    <article className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl border border-surface-border bg-surface-raised/40 hover:border-sage/30 hover:bg-surface-raised/60 transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="shrink-0 w-full sm:w-52 aspect-video rounded-lg overflow-hidden border border-surface-border/80">
        <img
          src={imageSrc ?? `https://placehold.co/208x117/161c18/3d5048?text=Fig`}
          alt={`${title} figure`}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <h3 className="font-serif text-parchment font-semibold text-base leading-snug group-hover:text-sage transition-colors duration-200">
          {title}
        </h3>

        <p className="text-sage text-xs font-medium tracking-wide uppercase">
          {venue} &middot; {year}
        </p>

        <p className="text-ash text-sm leading-relaxed line-clamp-3">
          {abstract}
        </p>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 text-sage text-xs font-medium hover:text-sage-light transition-colors duration-200 self-start"
        >
          Read Paper
          <ArrowUpRight size={13} strokeWidth={2} />
        </a>
      </div>
    </article>
  );
}
