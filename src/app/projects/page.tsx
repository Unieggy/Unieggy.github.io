"use client";

import ProjectCard from "@/components/ProjectCard";
import { useLang } from "@/i18n/LanguageContext";
import { projectsData } from "@/i18n/translations";

export default function ProjectsPage() {
  const { lang, t } = useLang();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-24">
      <div className="mb-10">
        <h1 className="font-heading text-2xl font-normal text-parchment mb-3">
          {t.projects.heading}
        </h1>
        <p className="text-ash text-base max-w-lg">{t.projects.subtitle}</p>
      </div>

      <div className="flex flex-col gap-5">
        {projectsData.map((project, i) => (
          <ProjectCard
            key={i}
            title={project.title[lang]}
            year={project.year}
            description={project.description[lang]}
            stack={project.stack}
            githubUrl={project.githubUrl}
            imageSrc={project.imageSrc}
            githubLabel={t.projects.viewOnGitHub}
          />
        ))}
      </div>
    </div>
  );
}
