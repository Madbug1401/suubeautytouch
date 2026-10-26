"use client";

import { motion } from "motion/react";
import { Rich } from "@/components/site/Rich";
import { dur, ease } from "@/lib/motion";

const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Entra suavemente quando aparece no ecrã. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: dur.slow, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Título revelado linha a linha, por máscara. Cada linha aceita *itálico*. */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className,
  delay = 0,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
}) {
  // O observador fica no título: as linhas começam escondidas pela máscara (overflow-hidden)
  // e o IntersectionObserver nunca as veria "entrar".
  const MotionTag = motion[Tag];
  return (
    <MotionTag className={className} initial="hidden" whileInView="show" viewport={viewport}>
      {lines.map((l, i) => (
        <span key={i} className="mask">
          <motion.span
            className="block"
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: dur.cinematic, ease: ease.out, delay: delay + i * 0.08 }}
          >
            <Rich text={l} />
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
