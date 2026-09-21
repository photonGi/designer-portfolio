export type ProjectMeta = {
  label: string;
  value: string;
};

export type ProjectCaptionedImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectPointItem = {
  title: string;
  body: string;
};

export type ProjectMetricItem = {
  value: string;
  label: string;
};

/** Composable content widgets for /work/[slug] — add/reorder any section from admin. */
export type ProjectWidget =
  | {
      id: string;
      type: "paragraph";
      body: string;
    }
  | {
      id: string;
      type: "heading";
      title: string;
      body?: string;
    }
  | {
      id: string;
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      id: string;
      type: "slider";
      images: ProjectCaptionedImage[];
    }
  | {
      id: string;
      type: "gallery";
      images: ProjectCaptionedImage[];
    }
  | {
      id: string;
      type: "points";
      title?: string;
      number?: number;
      items: ProjectPointItem[];
    }
  | {
      id: string;
      type: "bullets";
      title?: string;
      number?: number;
      items: string[];
    }
  | {
      id: string;
      type: "metrics";
      title?: string;
      number?: number;
      items: ProjectMetricItem[];
    };

export type ProjectWidgetType = ProjectWidget["type"];

/** Full project detail page content (/work/[slug]). */
export type Project = {
  slug: string;
  title: string;
  summary: string;
  meta: ProjectMeta[];
  siteUrl?: string;
  cover: string;
  coverAlt: string;
  /** Ordered content widgets under the cover */
  widgets?: ProjectWidget[];
  /** @deprecated Prefer widgets */
  intro?: string;
  /** @deprecated Prefer widgets */
  problem?: {
    title: string;
    image?: ProjectCaptionedImage;
    items: ProjectPointItem[];
  };
  /** @deprecated Prefer widgets */
  contribution?: {
    title: string;
    image?: ProjectCaptionedImage;
    items: string[];
  };
  /** @deprecated Prefer widgets */
  howItWorks?: {
    title: string;
    image?: ProjectCaptionedImage;
    items: ProjectPointItem[];
    gallery: ProjectCaptionedImage[];
  };
  /** @deprecated Prefer widgets */
  outcome?: {
    title: string;
    image?: ProjectCaptionedImage;
    items?: ProjectMetricItem[];
    metrics?: ProjectMetricItem[];
  };
  /** @deprecated Prefer widgets */
  blocks?: ProjectBlock[];
};

export type ProjectBlock =
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "text"; body: string }
  | { type: "heading"; title: string; paragraphs: string[] };

export function createWidgetId() {
  return `w_${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyWidget(type: ProjectWidgetType): ProjectWidget {
  const id = createWidgetId();
  switch (type) {
    case "paragraph":
      return { id, type, body: "" };
    case "heading":
      return { id, type, title: "", body: "" };
    case "image":
      return { id, type, src: "", alt: "", caption: "" };
    case "slider":
      return {
        id,
        type,
        images: [{ src: "", alt: "", caption: "" }],
      };
    case "gallery":
      return {
        id,
        type,
        images: [{ src: "", alt: "", caption: "" }],
      };
    case "points":
      return {
        id,
        type,
        title: "",
        number: 1,
        items: [{ title: "", body: "" }],
      };
    case "bullets":
      return { id, type, title: "", number: 1, items: [""] };
    case "metrics":
      return {
        id,
        type,
        title: "Outcome",
        number: 4,
        items: [
          { value: "", label: "" },
          { value: "", label: "" },
          { value: "", label: "" },
        ],
      };
  }
}

/** Normalize any stored project shape into an ordered widget list for rendering. */
export function resolveProjectWidgets(project: Project): ProjectWidget[] {
  if (Array.isArray(project.widgets) && project.widgets.length > 0) {
    return project.widgets;
  }

  const widgets: ProjectWidget[] = [];

  if (project.intro?.trim()) {
    widgets.push({
      id: createWidgetId(),
      type: "paragraph",
      body: project.intro,
    });
  }

  const pushImage = (image?: ProjectCaptionedImage) => {
    if (!image?.src) return;
    widgets.push({
      id: createWidgetId(),
      type: "image",
      src: image.src,
      alt: image.alt || project.title,
      caption: image.caption,
    });
  };

  if (project.problem) {
    pushImage(project.problem.image);
    if (project.problem.items?.length) {
      widgets.push({
        id: createWidgetId(),
        type: "points",
        title: project.problem.title,
        number: 1,
        items: project.problem.items,
      });
    }
  }

  if (project.contribution) {
    pushImage(project.contribution.image);
    if (project.contribution.items?.length) {
      widgets.push({
        id: createWidgetId(),
        type: "bullets",
        title: project.contribution.title,
        number: 2,
        items: project.contribution.items,
      });
    }
  }

  if (project.howItWorks) {
    pushImage(project.howItWorks.image);
    if (project.howItWorks.items?.length) {
      widgets.push({
        id: createWidgetId(),
        type: "points",
        title: project.howItWorks.title,
        number: 3,
        items: project.howItWorks.items,
      });
    }
    if (project.howItWorks.gallery?.length) {
      widgets.push({
        id: createWidgetId(),
        type: "gallery",
        images: project.howItWorks.gallery,
      });
    }
  }

  if (project.outcome) {
    pushImage(project.outcome.image);
    const metrics = project.outcome.metrics ?? project.outcome.items ?? [];
    if (metrics.length) {
      widgets.push({
        id: createWidgetId(),
        type: "metrics",
        title: project.outcome.title,
        number: 4,
        items: metrics,
      });
    }
  }

  for (const block of project.blocks ?? []) {
    if (block.type === "image") {
      widgets.push({
        id: createWidgetId(),
        type: "image",
        src: block.src,
        alt: block.alt,
        caption: block.caption,
      });
    } else if (block.type === "text") {
      widgets.push({
        id: createWidgetId(),
        type: "paragraph",
        body: block.body,
      });
    } else {
      widgets.push({
        id: createWidgetId(),
        type: "heading",
        title: block.title,
        body: block.paragraphs?.join("\n\n") ?? "",
      });
    }
  }

  return widgets;
}

export function getNextFromList(projects: Project[], slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0 || projects.length === 0) return null;
  return projects[(index + 1) % projects.length] ?? null;
}

export const DEFAULT_PROJECT_META: ProjectMeta[] = [
  { label: "Industry", value: "" },
  { label: "Region", value: "" },
  { label: "Year", value: new Date().getFullYear().toString() },
  { label: "Role", value: "UX/UI Designer" },
];

export const WIDGET_CATALOG: {
  type: ProjectWidgetType;
  label: string;
  hint: string;
}[] = [
  { type: "paragraph", label: "Paragraph", hint: "Body text under cover or between media" },
  { type: "heading", label: "Heading", hint: "Section title with optional body" },
  { type: "image", label: "Image", hint: "Single mockup with optional caption" },
  { type: "slider", label: "Slider", hint: "Swipeable images with next peek" },
  { type: "gallery", label: "Gallery", hint: "Grid of captioned images" },
  { type: "points", label: "Points", hint: "Titled bullets with descriptions" },
  { type: "bullets", label: "Bullets", hint: "Simple bullet list" },
  { type: "metrics", label: "Metrics", hint: "Outcome stats row" },
];

/** @deprecated */
export type ProjectChallengeItem = ProjectPointItem;
export type ProjectFeatureItem = ProjectPointItem;
export type ProjectMetric = ProjectMetricItem;
export type CaseStudyBlock = ProjectBlock;
export type CaseStudyMeta = ProjectMeta;
export type CaseStudy = Project;
