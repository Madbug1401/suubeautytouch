"use client";

// Índice de serviços em linhas finas. No desktop, uma fotografia segue o cursor
// e troca de look conforme a linha; no telemóvel, a fotografia aparece na própria linha.
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { dur, ease } from "@/lib/motion";

export type ServiceRow = {
  id: string;
  nome: string;
  resumo: string;
  duracao: string;
  preco: string;
  imagem: string;
  href: string;
};

export function ServiceIndex({ items }: { items: ServiceRow[] }) {
  const list = useRef<HTMLUListElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  return (
    <ul
      ref={list}
      className="relative border-t border-line"
      onPointerMove={(e) => {
        const r = list.current!.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setHover(null)}
    >
      {/* Fotografia flutuante */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block"
        style={{ x: sx, y: sy }}
      >
        <motion.div
          className="relative -ml-[8rem] -mt-[10.5rem] aspect-[3/4] w-[16rem] overflow-hidden"
          initial={false}
          animate={{ opacity: hover === null ? 0 : 1, scale: hover === null ? 0.85 : 1, rotate: hover === null ? -4 : 0 }}
          transition={{ duration: dur.base, ease: ease.out }}
        >
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              className="absolute inset-0"
              initial={false}
              animate={{ clipPath: hover === i ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", scale: hover === i ? 1 : 1.25 }}
              transition={{ duration: dur.slow, ease: ease.inOut }}
              style={{ zIndex: hover === i ? 2 : 1 }}
            >
              <Image src={it.imagem} alt="" fill sizes="16rem" className="object-cover" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {items.map((it, i) => (
        <li key={it.id} className="border-b border-line" onPointerEnter={() => setHover(i)}>
          <Link
            href={it.href}
            className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-5 gap-y-1 py-6 md:grid-cols-12 md:gap-x-6 md:py-9"
          >
            <span className="relative row-span-2 aspect-[3/4] w-full overflow-hidden md:hidden">
              <Image src={it.imagem} alt="" fill sizes="5rem" className="object-cover" />
            </span>
            <span className="eyebrow hidden text-muted tabular-nums md:col-span-1 md:block">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] transition-[translate,font-style] duration-700 ease-out-expo group-hover:translate-x-4 group-hover:italic md:col-span-5">
              {it.nome}
            </span>
            <span className="col-start-2 text-sm text-muted md:col-span-3 md:col-start-auto md:text-base">
              {it.resumo}
              <span className="eyebrow mt-1 block text-muted/80 md:mt-2">{it.duracao}</span>
            </span>
            <span className="col-start-3 row-span-2 row-start-1 flex items-center gap-4 justify-self-end md:col-span-3 md:col-start-auto md:row-auto">
              <span className="font-display text-2xl tabular-nums md:text-4xl">{it.preco}</span>
              <span
                aria-hidden="true"
                className="hidden size-12 place-items-center rounded-full ring-1 ring-line transition-colors duration-500 group-hover:bg-accent group-hover:text-on-accent group-hover:ring-accent md:grid"
              >
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
