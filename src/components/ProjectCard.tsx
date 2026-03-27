import { ArrowUpRight } from "lucide-react";

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface Project {
  title: string;
  description: string;
  stack: string[];
  githubUrl: string;
  imageSrc?: string;
  demoUrl?: string;
}

export default function ProjectCard({
  title,
  description,
  stack,
  githubUrl,
  imageSrc,
  demoUrl,
}: Project) {
  return (
    <article className="flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-surface-border bg-surface-raised/40 hover:border-sage/30 hover:bg-surface-raised/60 transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="shrink-0 w-full sm:w-64 aspect-video rounded-lg overflow-hidden border border-surface-border/80">
        <img
          src={imageSrc ?? `https://placehold.co/256x144/161c18/3d5048?text=Demo`}
          alt={`${title} demo`}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        <h3 className="font-serif text-parchment font-semibold text-lg leading-snug group-hover:text-sage transition-colors duration-200">
          {title}
        </h3>

        <p className="text-ash text-sm leading-relaxed">{description}</p>

        {/* Stack badges */}
        <div className="flex flex-wrap gap-1.5">
          {stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium border border-sage-deep/60 text-sage bg-sage-deep/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 mt-auto pt-1">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-ash text-xs font-medium hover:text-sage transition-colors duration-200"
          >
            <GitHubIcon />
            View on GitHub
          </a>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ash text-xs font-medium hover:text-sage transition-colors duration-200"
            >
              Live Demo
              <ArrowUpRight size={13} strokeWidth={2} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
