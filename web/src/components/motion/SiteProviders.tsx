"use client";

import { MotionConfig } from "motion/react";
import { SmoothScroll } from "./SmoothScroll";

/** Movimento do site público: respeita reduced-motion e liga o smooth scroll. */
export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      {children}
    </MotionConfig>
  );
}
