import HeroSection from "@/components/HeroSection";
import EducationTimeline from "@/components/EducationTimeline";
import PublicationCard from "@/components/PublicationCard";

const publications = [
  {
    title: "Diving into the virtual realm: Exploring the mechanics of virtual reality",
    venue: "Applied and Computational Engineering",
    year: "2024", 
    abstract:
      "This research explores the fundamental mechanics of virtual reality environments, focusing on computational engineering principles to enhance user immersion and system performance within virtual realms.",
    link: "https://www.researchgate.net/publication/377831494_Diving_into_the_virtual_realm_Exploring_the_mechanics_of_virtual_reality", 
    imageSrc: "https://placehold.co/208x117/161c18/3d5048?text=ACE+2024",
  },
];
export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-24">
      <HeroSection />

      {/* Divider */}
      <div className="h-px bg-surface-border my-2" />

      <EducationTimeline />

      {/* Divider */}
      <div className="h-px bg-surface-border my-2" />

      {/* Publications */}
      <section className="py-12">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-parchment mb-8">
          Research &amp; Publications
        </h2>

        <div className="flex flex-col gap-4">
          {publications.map((pub, i) => (
            <PublicationCard key={i} {...pub} />
          ))}
        </div>
      </section>
    </div>
  );
}
