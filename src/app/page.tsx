import HeroSection from "@/components/HeroSection";
import EducationTimeline from "@/components/EducationTimeline";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import PublicationsSection from "@/components/PublicationsSection";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-24">
      <HeroSection />

      {/* Divider */}
      <div className="h-px bg-surface-border my-2" />

      <EducationTimeline />

      {/* Divider */}
      <div className="h-px bg-surface-border my-2" />

      <ExperienceTimeline />

      {/* Divider */}
      <div className="h-px bg-surface-border my-2" />

      <PublicationsSection />
    </div>
  );
}
