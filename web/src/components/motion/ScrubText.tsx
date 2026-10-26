"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Parágrafo cujas palavras "acendem" ao ritmo do scroll. *texto* fica em itálico. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current!.querySelectorAll("[data-w]"),
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 82%", end: "bottom 50%", scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );

  const words = text.split("*").flatMap((seg, i) => seg.split(/\s+/).filter(Boolean).map((w) => ({ w, it: i % 2 === 1 })));

  return (
    <p ref={ref} className={className}>
      {words.map(({ w, it }, i) => (
        <span key={i} data-w className={it ? "font-display font-light italic text-accent" : undefined}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
