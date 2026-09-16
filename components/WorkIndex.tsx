"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  filterWorkItems,
  type WorkItem,
} from "@/lib/work";

const ease = [0.22, 1, 0.36, 1] as const;

type CategoryFilter = "all" | "case-studies";
type ViewMode = "list" | "grid";

function clamp(value: number, min: number, max: number) {
  if (min > max) return (min + max) / 2;
  return Math.min(max, Math.max(min, value));
}

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded px-2 py-1 text-sm font-medium transition-colors duration-200 ${
        active
          ? "bg-foreground text-background"
          : "bg-border text-foreground hover:bg-muted/30"
      }`}
    >
      {children}
    </button>
  );
}

function GridCard({
  item,
  index,
  reduceMotion,
  slot,
}: {
  item: WorkItem;
  index: number;
  reduceMotion: boolean | null;
  slot: GridSlot;
}) {
  const delay = Math.min(index * 0.05, 0.4);

  return (
    <Link
      href={item.href ?? "#"}
      className={`group flex w-full flex-col gap-2 self-start ${slot.className}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-[5px] bg-border"
        style={{ aspectRatio: slot.aspect }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { y: "18%", opacity: 0.4 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease, delay }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </motion.div>
      </div>

      <motion.div
        className="flex w-full items-center justify-between gap-3"
        initial={reduceMotion ? false : { y: 18, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.65, ease, delay: delay + 0.08 }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate text-base font-medium text-foreground">
            {item.name}
          </span>
          <span className="shrink-0 rounded border border-border bg-[#14100c] px-2 py-[5px] text-xs leading-3 text-muted [[data-theme=light]_&]:bg-background">
            {item.comingSoon ? "Coming soon" : item.meta}
          </span>
        </div>
        <span className="shrink-0 text-xs font-medium text-muted">
          {item.year}
        </span>
      </motion.div>
    </Link>
  );
}

/** Figma 12-col staggered work grid — cycles every 4 items. */
type GridSlot = {
  className: string;
  aspect: string;
};

const GRID_SLOTS: GridSlot[] = [
  {
    className: "md:col-span-7 md:col-start-1",
    aspect: "820 / 645",
  },
  {
    className: "md:col-span-4 md:col-start-9 md:pt-24",
    aspect: "460 / 366",
  },
  {
    className: "md:col-span-5 md:col-start-2",
    aspect: "580 / 461",
  },
  {
    className: "md:col-span-5 md:col-start-8 md:pt-16",
    aspect: "580 / 459",
  },
];

export default function WorkIndex({ items: allItems }: { items: WorkItem[] }) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [view, setView] = useState<ViewMode>("list");
  const [canHover, setCanHover] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [preview, setPreview] = useState<{
    src: string;
    dir: 1 | -1;
    tick: number;
  } | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const currentSrc = useRef<string | null>(null);
  const lastIndex = useRef(-1);
  const tickMap = useRef(new Map<string, number>());
  const tick = useRef(0);
  const motionState = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    rot: 0,
    w: 280,
    h: 168,
    raf: 0,
    snapped: false,
  });

  const items = useMemo(
    () => filterWorkItems(allItems, filter),
    [allItems, filter],
  );

  const images = useMemo(
    () => [...new Set(items.map((item) => item.image))],
    [items],
  );

  useEffect(() => {
    const param = searchParams.get("view");
    if (param === "grid" || param === "list") {
      setView(param);
    }
  }, [searchParams]);

  useEffect(() => {
    const media = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const sync = () => setCanHover(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const state = motionState.current;
    return () => {
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = 0;
    };
  }, []);

  const setViewMode = (next: ViewMode) => {
    setView(next);
    hidePreview();
    const params = new URLSearchParams(searchParams.toString());
    if (next === "list") {
      params.delete("view");
    } else {
      params.set("view", next);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const boundedTarget = () => {
    const state = motionState.current;
    return [
      clamp(
        state.tx + 140,
        16 + state.w / 2,
        window.innerWidth - 16 - state.w / 2,
      ),
      clamp(state.ty, 16 + state.h / 2, window.innerHeight - 16 - state.h / 2),
    ] as const;
  };

  const animatePreview = () => {
    const state = motionState.current;
    const node = previewRef.current;
    if (!node) {
      state.raf = 0;
      return;
    }

    const [targetX, targetY] = boundedTarget();
    const prevX = state.x;
    state.x += (targetX - state.x) * 0.16;
    state.y += (targetY - state.y) * 0.13;
    state.rot +=
      (clamp((state.x - prevX) * 0.55, -12, 12) - state.rot) * 0.11;

    node.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.rot}deg)`;

    const settled =
      Math.abs(targetX - state.x) < 0.2 &&
      Math.abs(targetY - state.y) < 0.2 &&
      Math.abs(state.rot) < 0.05;

    state.raf = settled ? 0 : requestAnimationFrame(animatePreview);
  };

  const showPreview = (item: WorkItem, index: number) => {
    setActiveIndex(index);
    if (!canHover || !previewRef.current) return;

    previewRef.current.dataset.on = item.image ? "1" : "0";
    const dir: 1 | -1 =
      lastIndex.current < 0 || index >= lastIndex.current ? 1 : -1;
    lastIndex.current = index;

    if (!item.image || currentSrc.current === item.image) return;
    currentSrc.current = item.image;
    const nextTick = ++tick.current;
    tickMap.current.set(item.image, nextTick);
    setPreview({ src: item.image, dir, tick: nextTick });
  };

  const hidePreview = () => {
    setActiveIndex(null);
    if (previewRef.current) previewRef.current.dataset.on = "0";
    motionState.current.snapped = false;
    lastIndex.current = -1;
    currentSrc.current = null;
  };

  return (
    <section className="w-full">
      <motion.div
        className="flex w-full flex-col items-start gap-2 px-4 pb-6 pt-28 md:pl-[50%] md:pt-40"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease }}
      >
        <p className="text-sm text-muted">Index / {items.length}</p>
        <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-normal leading-none text-foreground">
          Selected works
        </h1>
      </motion.div>

      <div className="px-4 pb-12">
        <div className="flex items-center justify-between border-t border-border pt-2">
          <div className="flex gap-1" role="group" aria-label="Filter projects">
            <Pill active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </Pill>
            <Pill
              active={filter === "case-studies"}
              onClick={() => setFilter("case-studies")}
            >
              Case Studies
            </Pill>
          </div>
          <div className="flex gap-1" role="group" aria-label="View mode">
            <Pill active={view === "list"} onClick={() => setViewMode("list")}>
              List
            </Pill>
            <Pill active={view === "grid"} onClick={() => setViewMode("grid")}>
              Grid
            </Pill>
          </div>
        </div>
      </div>

      {view === "list" ? (
        <div
          className="relative w-full px-4 pb-[120px]"
          aria-label="Selected works"
          onPointerMove={
            canHover
              ? (event) => {
                  const state = motionState.current;
                  state.tx = event.clientX;
                  state.ty = event.clientY;
                  if (!state.snapped) {
                    state.w = innerRef.current?.offsetWidth ?? 280;
                    state.h = innerRef.current?.offsetHeight ?? 168;
                    const [x, y] = boundedTarget();
                    state.x = x;
                    state.y = y;
                    state.rot = 0;
                    state.snapped = true;
                  }
                  if (!state.raf) {
                    state.raf = requestAnimationFrame(animatePreview);
                  }
                }
              : undefined
          }
          onPointerLeave={canHover ? hidePreview : undefined}
        >
          <motion.ul
            className="flex w-full flex-col"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease }}
            key={`list-${filter}`}
          >
            {items.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href ?? "#"}
                    className={`grid grid-cols-1 items-center gap-2 border-t border-border px-2 py-4 transition-colors duration-200 sm:grid-cols-[1.1fr_1fr_auto] sm:gap-3 md:gap-4 ${
                      isActive
                        ? "border-transparent bg-foreground text-background"
                        : "text-foreground"
                    }`}
                    onPointerEnter={() => showPreview(item, index)}
                    onFocus={() => showPreview(item, index)}
                    onBlur={() => {
                      if (activeIndex === index) hidePreview();
                    }}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="truncate text-base font-medium">
                        {item.name}
                      </span>
                      {item.comingSoon && (
                        <span
                          className={`shrink-0 rounded border px-2 py-[5px] text-xs leading-3 ${
                            isActive
                              ? "border-background/35 text-background/70"
                              : "border-border bg-[#14100c] text-muted"
                          }`}
                        >
                          Coming soon
                        </span>
                      )}
                    </span>
                    <span
                      className={`truncate text-sm ${
                        isActive ? "text-background/80" : "text-muted"
                      }`}
                    >
                      {item.meta}
                    </span>
                    <span
                      className={`text-sm ${
                        isActive ? "text-background/80" : "text-muted"
                      }`}
                    >
                      {item.year}
                    </span>
                  </Link>
                </li>
              );
            })}
          </motion.ul>

          {canHover && (
            <div
              ref={previewRef}
              className="case-preview"
              aria-hidden
              data-on="0"
            >
              <div ref={innerRef} className="case-preview-inner">
                {images.map((src) => {
                  const isActive = preview?.src === src;
                  return (
                    <span
                      key={`${src}#${tickMap.current.get(src) ?? 0}`}
                      className={`case-preview-img${isActive ? " is-active" : ""}`}
                      style={{ zIndex: tickMap.current.get(src) ?? 0 }}
                      data-dir={isActive ? preview?.dir : undefined}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="280px"
                        className="object-cover"
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-x-2 gap-y-10 px-4 pb-[120px] md:grid-cols-12 md:gap-y-16"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          key={`grid-${filter}`}
          aria-label="Selected works grid"
        >
          {items.map((item, index) => (
            <GridCard
              key={item.id}
              item={item}
              index={index}
              reduceMotion={reduceMotion}
              slot={GRID_SLOTS[index % GRID_SLOTS.length]!}
            />
          ))}
        </motion.div>
      )}
    </section>
  );
}
