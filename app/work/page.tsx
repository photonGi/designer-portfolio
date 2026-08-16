import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import WorkIndex from "@/components/WorkIndex";

export const metadata: Metadata = {
  title: "Work — Syed Saqib Abbas",
  description: "Selected works, case studies, and projects by Syed Saqib Abbas.",
};

export default function WorkPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense
        fallback={
          <div className="px-4 pt-40 text-sm text-muted">Loading works…</div>
        }
      >
        <WorkIndex />
      </Suspense>
      <Footer />
    </main>
  );
}
