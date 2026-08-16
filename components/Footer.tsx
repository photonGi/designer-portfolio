"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ActionButtons } from "@/components/About";

const ease = [0.22, 1, 0.36, 1] as const;

const columns = [
  {
    title: "Case Studies",
    links: [
      { label: "Options Depth", href: "/work/options-depth" },
      { label: "Prosper Architecture", href: "/work/prosper-architecture" },
      { label: "Dot Portal", href: "/work/dot-portal" },
    ],
  },
  {
    title: "Projects",
    links: [
      { label: "Options Depth", href: "/work/options-depth" },
      { label: "Maria b", href: "/work" },
      { label: "NMDC", href: "/work" },
      { label: "Nishat", href: "/work" },
      { label: "Booosted", href: "/work" },
      { label: "Dot Portal", href: "/work/dot-portal" },
      { label: "View all", href: "/work" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "Pinterest", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Email", href: "mailto:saqibabbas052@gmail.com" },
      { label: "Resume", href: "#" },
    ],
  },
] as const;

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <footer id="contact" className="scroll-mt-16 w-full px-4 pb-10 pt-16 md:pt-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
        {columns.map((column, index) => (
          <motion.div
            key={column.title}
            className="min-w-0"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease, delay: index * 0.08 }}
          >
            <h3 className="border-b border-border pb-4 text-[clamp(1.5rem,3vw,2rem)] font-normal text-foreground">
              {column.title}
            </h3>
            <ul className="mt-2 flex flex-col">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex h-9 items-center text-base text-foreground transition-colors duration-300 hover:text-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16 flex flex-col gap-8 md:mt-24 md:flex-row md:items-end"
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease, delay: 0.12 }}
      >
        <div className="relative h-40 w-full overflow-hidden rounded md:h-[160px] md:w-[346px] md:shrink-0">
          <Image
            src="/images/footer-video.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 346px"
            className="object-cover transition-transform duration-700 hover:scale-[1.03]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <h2 className="max-w-[726px] text-[clamp(2rem,5vw,3.25rem)] font-normal leading-none text-foreground">
            Want to work together?
          </h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <ActionButtons />
              <a
                href="mailto:saqibabbas052@gmail.com"
                className="text-base text-foreground transition-colors duration-300 hover:text-muted"
              >
                saqibabbas052@gmail.com
              </a>
            </div>
            <p className="text-xs text-muted sm:text-right">
              ©2026 Syed Saqib Abbas
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
