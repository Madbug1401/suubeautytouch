import { Reveal, RevealLines } from "@/components/motion/Reveal";

/** Cabeçalho editorial das páginas internas: legenda, título por linhas (*itálico*) e introdução. */
export function PageTitle({ eyebrow, lines, intro }: { eyebrow: string; lines: string[]; intro?: React.ReactNode }) {
  return (
    <header className="mb-16 grid grid-cols-12 gap-x-6 gap-y-8 border-b border-line pb-14 pt-8 md:mb-24 md:pb-20 md:pt-16">
      <p className="eyebrow col-span-12 text-muted">{eyebrow}</p>
      <RevealLines as="h1" lines={lines} className="col-span-12 mb-0 text-h1 lg:col-span-8" />
      {intro && (
        <Reveal className="col-span-12 self-end md:col-span-6 lg:col-span-4" delay={0.25}>
          <p className="text-lg text-muted">{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
