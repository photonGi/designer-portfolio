import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import type { Project } from "@/lib/projects";
import type { WorkItem } from "@/lib/work";

const dataDir = path.join(process.cwd(), "data");
const workPath = path.join(dataDir, "work.json");
const projectsPath = path.join(dataDir, "projects.json");
const legacyCaseStudiesPath = path.join(dataDir, "case-studies.json");

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJson(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function getWorkItems(): Promise<WorkItem[]> {
  return readJson<WorkItem[]>(workPath);
}

export async function saveWorkItems(items: WorkItem[]) {
  await writeJson(workPath, items);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function getProjects(): Promise<Project[]> {
  if (await fileExists(projectsPath)) {
    return readJson<Project[]>(projectsPath);
  }
  if (await fileExists(legacyCaseStudiesPath)) {
    return readJson<Project[]>(legacyCaseStudiesPath);
  }
  return [];
}

export async function saveProjects(projects: Project[]) {
  await writeJson(projectsPath, projects);
  // Keep legacy file in sync during migration
  await writeJson(legacyCaseStudiesPath, projects);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  for (const project of projects) {
    revalidatePath(`/work/${project.slug}`);
    revalidatePath(`/admin/projects/${project.slug}`);
  }
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getNextProjectBySlug(slug: string) {
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0 || projects.length === 0) return null;
  return projects[(index + 1) % projects.length] ?? null;
}

/** @deprecated Use getProjects */
export const getCaseStudies = getProjects;
/** @deprecated Use getProjectBySlug */
export const getCaseStudyBySlug = getProjectBySlug;
/** @deprecated Use getNextProjectBySlug */
export const getNextCaseStudyBySlug = getNextProjectBySlug;
/** @deprecated Use saveProjects */
export const saveCaseStudies = saveProjects;

export async function getContentStats() {
  const [work, projects] = await Promise.all([getWorkItems(), getProjects()]);
  const years = [...new Set(work.map((item) => item.year))].sort();
  const withDetail = work.filter(
    (item) => item.href && item.href.startsWith("/work/"),
  );

  return {
    totalWork: work.length,
    projects: work.length,
    caseStudies: projects.length,
    projectDetails: projects.length,
    featured: withDetail.length,
    yearsCovered: years.length,
    latestYear: years.at(-1) ?? "—",
    recentWork: work.slice(0, 5),
  };
}

export function workItemFromProject(
  project: Project,
  extras?: Partial<WorkItem>,
): WorkItem {
  const industry =
    project.meta.find((item) => item.label.toLowerCase() === "industry")
      ?.value ??
    extras?.meta ??
    "Project";
  const year =
    project.meta.find((item) => item.label.toLowerCase() === "year")?.value ??
    extras?.year ??
    new Date().getFullYear().toString();

  return {
    id: project.slug,
    name: project.title,
    meta: industry,
    year,
    image: project.cover,
    category: "project",
    aspect: extras?.aspect ?? "346 / 260",
    href: `/work/${project.slug}`,
    comingSoon: extras?.comingSoon,
  };
}

/** @deprecated Use workItemFromProject */
export const workItemFromCaseStudy = workItemFromProject;
