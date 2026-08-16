import type { Metadata } from "next";
import AboutPageContent from "@/components/AboutPageContent";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — Syed Saqib Abbas",
  description:
    "UX designer at Devsinc working across design, execution, and AI workflows.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AboutPageContent />
      <Footer />
    </main>
  );
}
