"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

type LineItem = {
  title: string;
  meta?: string;
};

type GridColumn = {
  label?: string;
  heading?: string;
  items: LineItem[];
};

const experience: LineItem[] = [
  { title: "Devsinc · Sr. UX/UI Designer,", meta: "Oct 2025 – Present" },
  { title: "Cogent Labs · UX/UI Designer,", meta: "Nov 2024 – Oct 2025" },
  { title: "Devsinc · UX/UI Designer,", meta: "Feb 2023 – Nov 2024" },
  { title: "Hashlogics · As UX/UI Designer,", meta: "Oct 2021 – Feb 2023" },
];

const education: LineItem[] = [
  { title: "AI for Designer · IxDF,", meta: "2025" },
  { title: "Foundations of UX Design · Coursera,", meta: "2024" },
  { title: "Graphics Designing · Edge Institute,", meta: "2016" },
  { title: "BSCS · Virtual University of Pakistan,", meta: "Continue" },
];

const mentorship: LineItem[] = [
  { title: "Mentorship Program · UET,", meta: "2024+2025" },
  { title: "UI/UX Instructor · USEFP,", meta: "2023" },
];

const aboutBio = [
  "Product designer working at the intersection of research and interface. I design mobile and web products end to end — from flows and wireframes to polished, production-ready UI. Currently leading design operations at Devsinc, where I manage the design team across service projects. Based in Pakistan.",
  "I move between industries by design, not accident. Fintech, healthcare, insurance, architecture, hospitality — each project starts the same way: understand the user, map the system, then design the interface that makes it simple. I care less about pixels for their own sake and more about whether the product actually works for the person using it.",
] as const;

const stackColumns: GridColumn[] = [
  {
    label: "UX Research",
    items: [
      { title: "Project Directory" },
      { title: "User Research" },
      { title: "Qualitative Research" },
      { title: "Quantitative Research" },
      { title: "Competitive Analysis" },
      { title: "User Survey" },
    ],
  },
  {
    label: "UI Design",
    items: [
      { title: "Figma" },
      { title: "Webflow" },
      { title: "Framer" },
      { title: "After Photoshop" },
      { title: "Adobe Illustrator" },
      { title: "Figma Make" },
    ],
  },
  {
    label: "AI Automation",
    items: [
      { title: "Claude" },
      { title: "Chat GPT" },
      { title: "Lovable" },
      { title: "Polymet" },
      { title: "Perplexity" },
      { title: "Grok" },
    ],
  },
];

const heroLinks = [
  { label: "Email", href: "mailto:saqibabbas052@gmail.com" },
  { label: "Book a call", href: "mailto:saqibabbas052@gmail.com" },
  { label: "LinkedIn", href: "#" },
  { label: "Resume", href: "#" },
] as const;

function SlashItem({
  title,
  meta,
  delay = 0,
  reduceMotion,
  muted = false,
}: {
  title: string;
  meta?: string;
  delay?: number;
  reduceMotion: boolean | null;
  muted?: boolean;
}) {
  return (
    <motion.li
      className="flex gap-2 text-sm leading-normal"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease, delay }}
    >
      <span className="shrink-0 text-muted" aria-hidden>
        /
      </span>
      <span className={`min-w-0 ${muted ? "text-muted" : "text-foreground"}`}>
        {title}
        {meta ? (
          <>
            <br />
            <span className="text-muted">{meta}</span>
          </>
        ) : null}
      </span>
    </motion.li>
  );
}

function DashedCell({
  children,
  className = "",
  alignEnd = false,
}: {
  children: React.ReactNode;
  className?: string;
  alignEnd?: boolean;
}) {
  return (
    <div
      className={`rounded-[5px] border border-dashed border-border p-4 ${
        alignEnd ? "flex items-end" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function AboutPageContent() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="flex w-full flex-col gap-8 px-4 pt-24 md:flex-row md:items-stretch md:gap-2 md:pt-28 lg:gap-2">
        <motion.div
          className="flex min-w-0 flex-1 flex-col justify-end gap-4 md:max-w-[649px] md:pr-6"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease }}
        >
          <h1 className="text-[clamp(2.75rem,7vw,5rem)] font-normal leading-[1] tracking-tight text-foreground md:text-[80px] md:leading-[80px]">
            Syed
            <br />
            Saqib Abbas
          </h1>
          <p className="text-sm text-muted">UX Designer · Devsinc</p>
        </motion.div>

        <div className="flex min-w-0 flex-[1.35] flex-col gap-5 md:flex-row md:items-stretch md:gap-5">
          <motion.div
            className="relative mx-auto aspect-[400/525] w-full max-w-[400px] overflow-hidden rounded-[5px] bg-border md:mx-0 md:h-auto md:min-h-[525px] md:w-[400px] md:max-w-none md:shrink-0"
            initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease, delay: 0.08 }}
          >
            <Image
              src="/images/syed-saqib-abbas.png"
              alt="Portrait of Syed Saqib Abbas"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 400px"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            className="flex min-w-0 flex-1 flex-col justify-between gap-6 md:h-[525px] md:pr-5"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.16 }}
          >
            <div className="max-w-[360px] space-y-4 text-sm leading-[1.5] text-muted">
              {aboutBio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-border pt-4">
              {heroLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-foreground transition-colors duration-200 hover:text-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details + Stack */}
      <section className="flex w-full flex-col gap-2 px-4 py-20 md:py-[100px]">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[275px_1fr_1fr_1fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease }}
          >
            <DashedCell alignEnd className="min-h-[160px] h-full">
              <h2 className="text-2xl font-medium text-foreground">Details</h2>
            </DashedCell>
          </motion.div>

          <DashedCell>
            <p className="mb-2 text-sm text-muted">Experience</p>
            <ul className="flex flex-col gap-1.5">
              {experience.map((item, index) => (
                <SlashItem
                  key={item.title}
                  {...item}
                  delay={index * 0.04}
                  reduceMotion={reduceMotion}
                />
              ))}
            </ul>
          </DashedCell>

          <DashedCell>
            <p className="mb-2 text-sm text-muted">Certification & Education</p>
            <ul className="flex flex-col gap-1.5">
              {education.map((item, index) => (
                <SlashItem
                  key={item.title}
                  {...item}
                  delay={index * 0.04}
                  reduceMotion={reduceMotion}
                />
              ))}
            </ul>
          </DashedCell>

          <DashedCell>
            <p className="mb-2 text-sm text-muted">Training & Mentorship</p>
            <ul className="flex flex-col gap-1.5">
              {mentorship.map((item, index) => (
                <SlashItem
                  key={item.title}
                  {...item}
                  delay={index * 0.04}
                  reduceMotion={reduceMotion}
                />
              ))}
            </ul>
          </DashedCell>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[275px_1fr_1fr_1fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease }}
          >
            <DashedCell alignEnd className="h-full min-h-[120px]">
              <h2 className="text-2xl font-medium text-foreground">Skills & Stacks</h2>
            </DashedCell>
          </motion.div>

          {stackColumns.map((column) => (
            <DashedCell key={column.label}>
              <p className="mb-2 text-sm text-muted">{column.label}</p>
              <ul className="flex flex-col gap-1.5">
                {column.items.map((item, index) => (
                  <SlashItem
                    key={item.title}
                    {...item}
                    delay={index * 0.03}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </ul>
            </DashedCell>
          ))}
        </div>
      </section>
    </div>
  );
}
