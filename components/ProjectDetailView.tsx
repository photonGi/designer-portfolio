"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Footer from "@/components/Footer";
import ProjectImageSlider from "@/components/ProjectImageSlider";
import {
  resolveProjectWidgets,
  type Project,
  type ProjectCaptionedImage,
  type ProjectWidget,
} from "@/lib/projects";
import type { WorkItem } from "@/lib/work";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProjectDetailView({
  project,
  next,
  workItems = [],
}: {
  project: Project;
  next: Project | null;
  workItems?: WorkItem[];
}) {
  const reduceMotion = useReducedMotion();
  const meta = project.meta ?? [];
  const widgets = resolveProjectWidgets(project);

  return (
    <main className="flex flex-1 flex-col">
      <article className="w-full px-4 pb-4 pt-20 md:pt-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[min(485px,34%)]">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <Link
                href="/work"
                className="inline-flex text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                ← Back
              </Link>

              <h1 className="mt-12 text-[clamp(1.75rem,3vw,2rem)] font-medium leading-tight text-foreground">
                {project.title}
              </h1>

              <p className="mt-6 max-w-[344px] text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed tracking-[-0.02em] text-foreground">
                {project.summary}
              </p>

              <dl className="mt-12 flex flex-col gap-5">
                {meta.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs font-medium text-foreground">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm text-muted">{item.value}</dd>
                  </div>
                ))}
              </dl>

              {project.siteUrl ? (
                <a
                  href={project.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-12 inline-flex text-sm text-muted transition-colors hover:text-foreground"
                >
                  Visit Site ↗
                </a>
              ) : null}
            </motion.div>
          </aside>

          <div className="min-w-0 flex-1">
            <motion.div
              className="relative aspect-[914/640] w-full overflow-hidden rounded bg-border"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease, delay: 0.08 }}
            >
              <Image
                src={project.cover}
                alt={project.coverAlt || project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </motion.div>

            <div className="mt-2 flex flex-col gap-2">
              {widgets.map((widget) => (
                <WidgetView
                  key={widget.id}
                  widget={widget}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>

            {next ? (
              <div className="mt-[100px] flex justify-end border-t border-border py-2">
                <Link
                  href={`/work/${next.slug}`}
                  className="text-base text-muted transition-colors hover:text-foreground"
                >
                  Next Project →
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </article>

      <Footer workItems={workItems} />
    </main>
  );
}

function WidgetView({
  widget,
  reduceMotion,
}: {
  widget: ProjectWidget;
  reduceMotion: boolean | null;
}) {
  switch (widget.type) {
    case "paragraph":
      return (
        <motion.p
          className="px-6 py-10 text-xl leading-relaxed text-foreground md:px-[100px]"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
        >
          {widget.body}
        </motion.p>
      );

    case "heading":
      return (
        <motion.div
          className="px-6 py-10 md:px-10"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease }}
        >
          <h2 className="text-2xl font-medium text-foreground">
            {widget.title}
          </h2>
          {widget.body ? (
            <p className="mt-4 max-w-[715px] text-base leading-relaxed text-foreground">
              {widget.body}
            </p>
          ) : null}
        </motion.div>
      );

    case "image":
      return (
        <CaptionedImage
          image={widget}
          reduceMotion={reduceMotion}
        />
      );

    case "slider":
      return (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease }}
        >
          <ProjectImageSlider images={widget.images} />
        </motion.div>
      );

    case "gallery":
      return (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {widget.images.map((image, index) => (
            <CaptionedImage
              key={`${image.src}-${index}`}
              image={image}
              reduceMotion={reduceMotion}
              className={
                index === widget.images.length - 1 &&
                widget.images.length % 2 === 1
                  ? "md:col-span-2 md:max-w-[calc(50%-0.625rem)]"
                  : undefined
              }
            />
          ))}
        </div>
      );

    case "points":
      return (
        <NumberedSection
          number={widget.number}
          title={widget.title}
          reduceMotion={reduceMotion}
        >
          <div className="flex flex-col gap-10 pl-5">
            {widget.items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="size-1.5 shrink-0 rounded-[1px] bg-[#8c8177]" />
                  <h3 className="text-lg font-medium text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-[#d9d9d9]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </NumberedSection>
      );

    case "bullets":
      return (
        <NumberedSection
          number={widget.number}
          title={widget.title}
          reduceMotion={reduceMotion}
        >
          <ul className="flex flex-col gap-3">
            {widget.items.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-start gap-3"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-[1px] bg-[#8c8177]" />
                <span className="text-xl leading-relaxed text-foreground">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </NumberedSection>
      );

    case "metrics":
      return (
        <NumberedSection
          number={widget.number}
          title={widget.title}
          reduceMotion={reduceMotion}
        >
          <div className="flex flex-col gap-0 sm:flex-row">
            {widget.items.map((metric, index) => (
              <div
                key={`${metric.label}-${index}`}
                className={`flex flex-1 flex-col gap-2 py-10 ${
                  index < widget.items.length - 1
                    ? "sm:border-r sm:border-border sm:pr-5"
                    : ""
                } ${index > 0 ? "sm:pl-5" : ""}`}
              >
                <p className="text-lg font-medium text-foreground">
                  {metric.value}
                </p>
                <p className="text-base leading-relaxed text-[#d9d9d9]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </NumberedSection>
      );
  }
}

function NumberedSection({
  number,
  title,
  children,
  reduceMotion,
}: {
  number?: number;
  title?: string;
  children: React.ReactNode;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.section
      className="flex flex-col gap-10 p-10"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease }}
    >
      {title ? (
        <h2 className="text-2xl font-medium uppercase text-foreground">
          {number ? (
            <span className="mr-2 tabular-nums">{number}.</span>
          ) : null}
          {title}
        </h2>
      ) : null}
      {children}
    </motion.section>
  );
}

function CaptionedImage({
  image,
  reduceMotion,
  className,
}: {
  image: ProjectCaptionedImage;
  reduceMotion: boolean | null;
  className?: string;
}) {
  if (!image?.src) return null;

  return (
    <motion.figure
      className={`relative w-full overflow-hidden rounded-[5px] bg-border ${className ?? ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, ease }}
    >
      <div className="relative aspect-[915/580] w-full">
        <Image
          src={image.src}
          alt={image.alt || ""}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
      </div>
      {image.caption ? (
        <figcaption className="absolute inset-x-0 bottom-4 text-center text-xs text-white/80">
          {image.caption}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}
