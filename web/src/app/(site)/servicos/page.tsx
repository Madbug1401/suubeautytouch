import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PageTitle } from "@/components/site/PageTitle";
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
      <PageTitle
        eyebrow="Serviços & preços"
        lines={["Escolha o *seu*", "nível de glamour."]}
        intro="Três looks, do quase invisível ao inesquecível. Preços em escudos; pagamento no estúdio, depois da maquilhagem."
      />

      <div className="space-y-24 md:space-y-40">
        {SERVICOS.map((s, i) => (
          <article key={s.id} className="grid grid-cols-12 items-center gap-x-6 gap-y-10">
            <Reveal className={`col-span-12 md:col-span-5 ${i % 2 ? "md:order-2 md:col-start-8" : ""}`}>
              <Link href={`/marcacao?servico=${s.id}`} className="group relative block aspect-[4/5] overflow-hidden bg-surface" tabIndex={-1} aria-hidden="true">
                <Image src={imagens[s.id]} alt="" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]" />
              </Link>
            </Reveal>
            <Reveal className={`col-span-12 md:col-span-6 ${i % 2 ? "md:order-1" : "md:col-start-7"}`} delay={0.1}>
              <p className="eyebrow mb-6 text-muted tabular-nums">({String(i + 1).padStart(2, "0")}) {s.resumo}</p>
              <h2 className="mb-6 text-h1">{s.nome}</h2>
              <p className="max-w-md text-lg text-muted">{s.descricao}</p>
              <dl className="my-10 grid max-w-md grid-cols-2 border-y border-line">
                <div className="py-5">
                  <dt className="eyebrow mb-2 text-muted">Preço</dt>
                  <dd className="font-display text-4xl tabular-nums">{formatPreco(s.preco)}</dd>
                </div>
                <div className="border-l border-line py-5 pl-6">
                  <dt className="eyebrow mb-2 text-muted">Duração</dt>
                  <dd className="font-display text-4xl">{s.duracaoTexto}</dd>
                </div>
              </dl>
              <Link href={`/marcacao?servico=${s.id}`} className="btn">
                Marcar {s.nome} <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </article>
        ))}
      </div>

      {/* Cílios — bloco compacto, em contraste com os looks */}
      <section className="mt-section border-t border-line pt-16">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow mb-6 text-muted">Extra</p>
            <h2 className="text-h2">
              Cílios <em>postiços</em>
            </h2>
            <p className="max-w-xs text-muted">Acrescente a qualquer look. No Full Glam já estão incluídos.</p>
          </div>
          {CILIOS.map((c) => (
            <Reveal key={c.id} className="col-span-6 md:col-span-4">
              <figure>
                <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                  <Image src={imagens[c.id]} alt={`Cílios ${c.nome}`} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-cover" />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-3 border-b border-line pb-4">
                  <span className="font-display text-xl md:text-3xl">{c.nome}</span>
                  <span className="font-display text-xl tabular-nums text-accent md:text-3xl">+{formatPreco(c.preco)}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
