import type { Metadata } from "next";
import { PageTitle } from "@/components/site/PageTitle";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CILIOS, SERVICOS, formatPreco } from "@/lib/config";
import { getImagensSite } from "@/lib/data";

export const revalidate = 60; // s — alterações no admin aparecem até 1 min depois

export const metadata: Metadata = {
  title: "Serviços e Preços",
  description: "Preços e detalhes dos serviços de maquilhagem Soft Glam, Glow Glam, Full Glam e cílios postiços.",
};

export default async function ServicosPage() {
  const imagens = await getImagensSite();

  return (
    <div className="container-page">
      <PageTitle>Serviços &amp; Preços</PageTitle>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICOS.map((s) => (
          <ServiceCard
            key={s.id}
            imagem={imagens[s.id]}
            alt={s.nome}
            titulo={`${s.emoji} ${s.nome} – ${formatPreco(s.preco)}`}
            cta={{ href: `/marcacao?servico=${s.id}`, label: "Marcar este serviço" }}
          >
            <p>{s.descricao}</p>
            <p className="mt-1">Duração: {s.duracaoTexto}</p>
          </ServiceCard>
        ))}
      </div>

      <h2 className="mt-16 text-center">👁️ Cílios Postiços (Extra)</h2>
      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {CILIOS.map((c) => (
          <ServiceCard key={c.id} imagem={imagens[c.id]} alt={`Cílios ${c.nome}`}>
            <p className="text-base">
              {c.nome} – {formatPreco(c.preco)}
            </p>
          </ServiceCard>
        ))}
      </div>
    </div>
  );
}
