import { ArrowUpRight } from "lucide-react";

/** The author whose name gets pulled out of the byline. */
const HIGHLIGHT_AUTHOR = "Zeyu Lai";

interface Publication {
  title: string;
  authors?: string[];
  venue: string;
  year: string;
  abstract: string;
  link: string;
  imageSrc?: string;
  videoSrc?: string;
  posterSrc?: string;
  readLabel?: string;
}

export default function PublicationCard({
  title,
  authors,
  venue,
  year,
  abstract,
  link,
  imageSrc,
  videoSrc,
  posterSrc,
  readLabel = "Read Paper",
}: Publication) {
  return (
    <article className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl border border-surface-border bg-surface-raised/40 hover:border-sage/30 hover:bg-surface-raised/60 transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="shrink-0 w-full sm:w-52 aspect-video rounded-lg overflow-hidden border border-surface-border/80 bg-black">
        {videoSrc ? (
          <video
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${title} demo clip`}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        ) : (
          <img
            src={imageSrc ?? `https://placehold.co/208x117/161c18/3d5048?text=Fig`}
            alt={`${title} figure`}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <h3 className="font-serif text-parchment font-semibold text-base leading-snug group-hover:text-sage transition-colors duration-200">
          {title}
        </h3>

        {authors && authors.length > 0 && (
          <p className="text-ash text-xs leading-relaxed">
            {authors.map((name, i) => (
              <span key={i}>
                {name === HIGHLIGHT_AUTHOR ? (
                  <span className="text-accent font-semibold">{name}</span>
                ) : (
                  name
                )}
                {i < authors.length - 1 && ", "}
              </span>
            ))}
          </p>
        )}

        <p className="text-sage text-xs font-medium tracking-wide">
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
          {readLabel}
          <ArrowUpRight size={13} strokeWidth={2} />
        </a>
      </div>
    </article>
  );
}
