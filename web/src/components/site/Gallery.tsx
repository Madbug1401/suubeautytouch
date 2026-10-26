"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { dur, ease } from "@/lib/motion";
import type { PortfolioItem } from "@/lib/types";

/** Grelha editorial de imagens/vídeos com lightbox (Esc fecha, ← → navegam). */
export function Gallery({ items, alt }: { items: PortfolioItem[]; alt: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const move = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [index, close, move]);

  if (!items.length) return <p className="font-display text-2xl italic text-muted">Novos trabalhos a caminho.</p>;

  const atual = index !== null ? items[index] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: dur.slow, ease: ease.out, delay: (i % 4) * 0.06 }}
            className={`group relative overflow-hidden bg-surface ${i % 7 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[3/4]"}`}
            aria-label={`Ampliar ${item.tipo === "video" ? "vídeo" : "imagem"} ${i + 1} de ${alt}`}
          >
            {item.tipo === "video" ? (
              <video src={item.url} muted loop playsInline preload="metadata" className="size-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]" />
            ) : (
              <Image
                src={item.url}
                alt={`${alt} - ${i + 1}`}
                fill
                sizes={i % 7 === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
                className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]"
              />
            )}
            <span className="eyebrow absolute bottom-3 left-3 text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              {item.tipo === "video" ? "Ver vídeo" : "Ampliar"}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {atual && index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Visualização ampliada"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-berry/95 p-4 text-ivory md:p-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.base, ease: ease.out }}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-gutter py-5">
              <p className="eyebrow tabular-nums text-ivory/70">
                {alt} — {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </p>
              <button type="button" onClick={close} className="eyebrow link-draw">
                Fechar
              </button>
            </div>
            {items.length > 1 && (
              <>
                <button type="button" onClick={() => move(-1)} aria-label="Anterior" className="eyebrow absolute bottom-6 left-gutter md:bottom-auto">
                  ← Anterior
                </button>
                <button type="button" onClick={() => move(1)} aria-label="Seguinte" className="eyebrow absolute bottom-6 right-gutter md:bottom-auto">
                  Seguinte →
                </button>
              </>
            )}
            <motion.div
              key={atual.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: dur.base, ease: ease.out }}
            >
              {atual.tipo === "video" ? (
                <video src={atual.url} controls autoPlay loop className="max-h-[80vh] max-w-[85vw]" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={atual.url} alt={alt} className="max-h-[80vh] max-w-[85vw] object-contain" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
