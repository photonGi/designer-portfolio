import About from "@/components/About";
import CaseStudies from "@/components/CaseStudies";
import Clients from "@/components/Clients";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import OtherProjects from "@/components/OtherProjects";
import Showreel from "@/components/Showreel";
import { getProjects, getWorkItems } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [workItems, projects] = await Promise.all([
    getWorkItems(),
    getProjects(),
  ]);

  const featuredProjects = projects.map((project) => {
    const card = workItems.find((item) => item.id === project.slug);
    return {
      name: project.title,
      type:
        project.meta.find((m) => m.label.toLowerCase() === "industry")?.value ??
        card?.meta ??
        "Project",
      year:
        project.meta.find((m) => m.label.toLowerCase() === "year")?.value ??
        card?.year ??
        "",
      href: `/work/${project.slug}`,
      image: project.cover,
      comingSoon: card?.comingSoon,
    };
  });

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Showreel />
      <Clients />
      <CaseStudies studies={featuredProjects} />
      <OtherProjects items={workItems} />
      <About />
      <Footer workItems={workItems} />
    </main>
  );
}
