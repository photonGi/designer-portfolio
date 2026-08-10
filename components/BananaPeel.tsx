"use client";

import { AnimatePresence, motion } from "motion/react";

type BananaPeelProps = {
  open: boolean;
  reduceMotion?: boolean | null;
};

export default function BananaPeel({ open, reduceMotion }: BananaPeelProps) {
  const instant = Boolean(reduceMotion);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-none absolute left-[4%] top-[2%] z-[5] w-[min(150px,46%)]"
          initial={instant ? false : { opacity: 0, scale: 0.55, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 10 }}
          transition={
            instant
              ? { duration: 0 }
              : { type: "spring", stiffness: 380, damping: 20 }
          }
          aria-hidden
        >
          {/* object keeps SMIL animations running (img often freezes them) */}
          <object
            data="/images/banana-animation.svg"
            type="image/svg+xml"
            className="h-auto w-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
            tabIndex={-1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/banana-animation.svg"
              alt=""
              className="h-auto w-full"
            />
          </object>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
