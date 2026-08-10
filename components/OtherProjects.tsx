"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

type Project = {
  name: string;
  tag: string;
  image: string;
  aspect: string;
  href?: string;
};

const columns: Project[][] = [
  [
    {
      name: "Options Depth",
      tag: "Trading",
      image: "/images/project.png",
      aspect: "346 / 260",
    },
    {
      name: "OSPI",
      tag: "CMS",
      image: "/images/project1.png",
      aspect: "346 / 259",
    },
    {
      name: "Maria b",
      tag: "Ecommerce",
      image: "/images/project2.png",
      aspect: "346 / 260",
    },
  ],
  [
    {
      name: "Nishat",
      tag: "Retail",
      image: "/images/project3.png",
      aspect: "346 / 240",
    },
    {
      name: "Walim",
      tag: "Ride Hailing",
      image: "/images/project4.png",
      aspect: "346 / 259",
    },
    {
      name: "Airkart",
      tag: "Ecommerce",
      image: "/images/project5.png",
      aspect: "346 / 303",
    },
  ],
  [
    {
      name: "Lumu",
      tag: "Retail",
      image: "/images/project6.png",
      aspect: "346 / 203",
    },
    {
      name: "Booosted",
      tag: "AI Chatbot",
      image: "/images/project7.png",
      aspect: "346 / 316",
    },
    {
      name: "Squid ERP",
      tag: "Enterprise",
      image: "/images/project8.png",
      aspect: "346 / 224",
    },
    {
      name: "Unampay",
      tag: "Ecommerce Solution",
      image: "/images/project9.png",
      aspect: "346 / 259",
    },
  ],
  [
    {
      name: "Gallo Legal",
      tag: "Legal Services",
      image: "/images/project10.png",
      aspect: "346 / 271",
    },
    {
      name: "Dot Portal",
      tag: "Healthcare & Wellness",
      image: "/images/project11.png",
      aspect: "346 / 224",
    },
    {
      name: "Prosper Arch",
      tag: "Architecture",
      image: "/images/project12.png",
      aspect: "346 / 259",
    },
  ],
];

function ProjectCard({
  project,
  index,
  reduceMotion,
}: {
  project: Project;
  index: number;
  reduceMotion: boolean | null;
}) {
  const delay = Math.min(index * 0.06, 0.36);

  return (
    <Link
      href={project.href ?? "#"}
      className="group flex w-full flex-col gap-1.5"
    >
      <div
        className="relative w-full overflow-hidden rounded-[5px] bg-border"
        style={{ aspectRatio: project.aspect }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { y: "18%", opacity: 0.4 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease, delay }}
        >
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </motion.div>
      </div>

      <motion.div
        className="flex items-center gap-2"
        initial={reduceMotion ? false : { y: 18, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.65, ease, delay: delay + 0.08 }}
      >
        <span className="text-xs text-foreground">{project.name}</span>
        <span className="rounded border border-border bg-[#14100c] px-2 py-[5px] text-xs leading-3 text-muted">
          {project.tag}
        </span>
      </motion.div>
    </Link>
  );
}

export default function OtherProjects() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full px-4 pt-28 md:pt-40">
      <motion.div
        className="mx-auto mb-6 max-w-[704px] text-center md:mb-8"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.75, ease }}
      >
        <p className="text-sm text-muted">Other Projects</p>
        <h2 className="mt-2 text-[clamp(1.5rem,3vw,2.125rem)] font-normal leading-tight text-foreground">
          A collection of projects,
          <br />
          freelance work and experiments.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-5">
            {column.map((project, rowIndex) => (
              <ProjectCard
                key={project.name}
                project={project}
                index={columnIndex + rowIndex * 4}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
