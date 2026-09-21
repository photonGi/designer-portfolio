"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectCaptionedImage } from "@/lib/projects";

export default function ProjectImageSlider({
  images,
}: {
  images: ProjectCaptionedImage[];
}) {
  const slides = images.filter((image) => image.src);
  const [index, setIndex] = useState(0);

  if (slides.length === 0) return null;

  const current = slides[index]!;
  const hasNext = slides.length > 1;

  function go(delta: number) {
    setIndex((prev) => (prev + delta + slides.length) % slides.length);
  }

  return (
    <figure className="relative w-full overflow-hidden rounded-[5px]">
      <div className="relative flex aspect-[915/580] w-full gap-5">
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-[5px] bg-border">
          <Image
            src={current.src}
            alt={current.alt || ""}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </div>
        {hasNext ? (
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="relative hidden w-[100px] shrink-0 overflow-hidden rounded-[5px] bg-border md:block"
          >
            <Image
              src={slides[(index + 1) % slides.length]!.src}
              alt=""
              fill
              sizes="100px"
              className="object-cover object-left"
            />
            <span className="absolute inset-0 bg-black/35" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl text-white">
              →
            </span>
          </button>
        ) : null}
      </div>
      {current.caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted">
          {current.caption}
        </figcaption>
      ) : null}
      {hasNext ? (
        <div className="mt-3 flex justify-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => go(-1)}
            className="rounded border border-border px-3 py-1 text-xs text-muted"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="rounded border border-border px-3 py-1 text-xs text-muted"
          >
            Next
          </button>
        </div>
      ) : null}
    </figure>
  );
}
