"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { PortfolioItem } from "@/lib/types";

/** Grelha de imagens/vídeos com lightbox (Esc fecha, ← → navegam). */
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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, move]);

  if (!items.length) return <p className="text-center text-muted">Ainda não há conteúdos neste álbum.</p>;

  const atual = index !== null ? items[index] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            className="relative aspect-square overflow-hidden rounded-2xl transition hover:scale-[1.03] hover:shadow-xl"
            aria-label={`Ampliar ${item.tipo === "video" ? "vídeo" : "imagem"} ${i + 1} de ${alt}`}
          >
            {item.tipo === "video" ? (
              <video src={item.url} muted loop playsInline preload="metadata" className="size-full object-cover" />
            ) : (
              <Image src={item.url} alt={`${alt} - ${i + 1}`} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
            )}
          </button>
        ))}
      </div>

      {atual && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <button type="button" onClick={close} aria-label="Fechar" className="absolute right-5 top-4 text-4xl text-white">
            &times;
          </button>
          {items.length > 1 && (
            <>
              <button type="button" onClick={() => move(-1)} aria-label="Anterior" className="absolute left-3 text-5xl text-white">‹</button>
              <button type="button" onClick={() => move(1)} aria-label="Seguinte" className="absolute right-3 text-5xl text-white">›</button>
            </>
          )}
          {atual.tipo === "video" ? (
            <video key={atual.id} src={atual.url} controls autoPlay loop className="max-h-[85vh] max-w-[90vw] rounded-xl" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={atual.id} src={atual.url} alt={alt} className="max-h-[85vh] max-w-[90vw] rounded-xl" />
          )}
        </div>
      )}
    </>
  );
}
