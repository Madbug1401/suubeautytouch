// motion.ts — tokens de movimento (espelham as variáveis --ease-* / --duration-* do globals.css).

export const ease = {
  out: [0.16, 1, 0.3, 1], // expo-out: revelações
  inOut: [0.76, 0, 0.24, 1], // quart-in-out: cortinas e transições de slide
  snappy: [0.2, 0.8, 0.2, 1],
} as const;

/** Os mesmos easings em sintaxe GSAP. */
export const gsapEase = {
  out: "expo.out",
  inOut: "power4.inOut",
  snappy: "power3.out",
} as const;

export const dur = { fast: 0.2, base: 0.5, slow: 0.9, cinematic: 1.4 } as const;

export const spring = { type: "spring", stiffness: 300, damping: 30 } as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
