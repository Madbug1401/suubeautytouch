import type { Metadata } from "next";
import { Gallery } from "@/components/site/Gallery";
import { PageTitle } from "@/components/site/PageTitle";
import type { CategoriaId } from "@/lib/config";
import { getPortfolio } from "@/lib/data";

export const revalidate = 60; // s — alterações no admin aparecem até 1 min depois

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Galeria de trabalhos de maquilhagem: Soft Glam, Glow Glam, Full Glam e cílios.",
};

const SECCOES: { id: string; titulo: string; albuns: { id: CategoriaId; nome?: string }[] }[] = [
  { id: "soft-glam", titulo: "Soft Glam", albuns: [{ id: "soft-glam" }] },
  { id: "glow-glam", titulo: "Glow Glam", albuns: [{ id: "glow-glam" }] },
  { id: "full-glam", titulo: "Full Glam", albuns: [{ id: "full-glam" }] },
  {
    id: "cilios",
    titulo: "Cílios",
    albuns: [
      { id: "cilios-natural", nome: "Natural" },
      { id: "cilios-volumoso", nome: "Volumoso" },
    ],
  },
];

export default async function PortfolioPage() {
  const items = await getPortfolio();
  const total = (s: (typeof SECCOES)[number]) => items.filter((i) => s.albuns.some((a) => a.id === i.album)).length;

  return (
    <div className="container-page">
      <PageTitle
        eyebrow="Portfólio"
        lines={["Rostos, luz", "e *detalhe.*"]}
        intro="Trabalhos reais, sem filtros de app. Cada detalhe pensado para realçar quem está na cadeira."
      />

      <nav aria-label="Álbuns" className="sticky top-0 z-20 -mx-gutter mb-16 border-b border-line bg-bg px-gutter">
        <ul className="flex gap-8 overflow-x-auto py-4">
          {SECCOES.map((s) => (
            <li key={s.id} className="shrink-0">
              <a href={`#${s.id}`} className="link-draw eyebrow py-1">
                {s.titulo} <span className="text-muted tabular-nums">({total(s)})</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-24 md:space-y-36">
        {SECCOES.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-40">
            <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-6">
              <h2 className="mb-0 text-h2">{s.titulo}</h2>
              <p className="eyebrow mb-2 text-muted tabular-nums">({String(i + 1).padStart(2, "0")})</p>
            </div>
            <div className="space-y-12">
              {s.albuns.map((a) => (
                <div key={a.id}>
                  {a.nome && <h3 className="mb-6 text-2xl italic">{a.nome}</h3>}
                  <Gallery items={items.filter((it) => it.album === a.id)} alt={a.nome ? `${s.titulo} ${a.nome}` : s.titulo} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
