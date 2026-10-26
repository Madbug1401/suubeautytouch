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

const SECCOES: { titulo: string; albuns: { id: CategoriaId; nome?: string }[] }[] = [
  { titulo: "💄 Soft Glam", albuns: [{ id: "soft-glam" }] },
  { titulo: "✨ Glow Glam", albuns: [{ id: "glow-glam" }] },
  { titulo: "👑 Full Glam", albuns: [{ id: "full-glam" }] },
  {
    titulo: "👁️ Cílios",
    albuns: [
      { id: "cilios-natural", nome: "Cílios Natural" },
      { id: "cilios-volumoso", nome: "Cílios Volumoso" },
    ],
  },
];

export default async function PortfolioPage() {
  const items = await getPortfolio();

  return (
    <div className="container-page">
      <PageTitle intro="Veja alguns dos nossos trabalhos mais especiais. Cada detalhe pensado para realçar a sua beleza.">
        Portfólio
      </PageTitle>

      {SECCOES.map((s) => (
        <section key={s.titulo} className="mt-12">
          <h2>{s.titulo}</h2>
          {s.albuns.map((a) => (
            <div key={a.id} className="mt-4">
              {a.nome && <h3 className="mb-3 text-lg">{a.nome}</h3>}
              <Gallery items={items.filter((i) => i.album === a.id)} alt={a.nome ?? s.titulo} />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
