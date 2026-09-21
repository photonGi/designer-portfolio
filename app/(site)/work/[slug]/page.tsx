import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailView from "@/components/ProjectDetailView";
import {
  getNextProjectBySlug,
  getProjectBySlug,
  getProjects,
  getWorkItems,
} from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Work" };

  return {
    title: `${project.title} — Syed Saqib Abbas`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const [next, workItems] = await Promise.all([
    getNextProjectBySlug(slug),
    getWorkItems(),
  ]);

  return (
    <ProjectDetailView project={project} next={next} workItems={workItems} />
  );
}
