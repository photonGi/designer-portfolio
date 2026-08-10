import About from "@/components/About";
import CaseStudies from "@/components/CaseStudies";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import OtherProjects from "@/components/OtherProjects";
import Showreel from "@/components/Showreel";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Showreel />
      <CaseStudies />
      <OtherProjects />
      <About />
      <Footer />
    </main>
  );
}
