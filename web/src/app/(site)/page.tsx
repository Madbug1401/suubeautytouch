import Image from "next/image";
import Link from "next/link";
import { HeroSlideshow, type Slide } from "@/components/home/HeroSlideshow";
import { ServiceIndex, type ServiceRow } from "@/components/home/ServiceIndex";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { ScrubText } from "@/components/motion/ScrubText";
import { CILIOS, IMAGEM_PADRAO, SERVICOS, TAXA_MARCACAO, formatPreco } from "@/lib/config";
import { getImagensSite } from "@/lib/data";

export const revalidate = 60; // s — alterações no admin aparecem até 1 min depois

const servico = (id: (typeof SERVICOS)[number]["id"]) => SERVICOS.find((s) => s.id === id)!;

export default async function HomePage() {
  const imagens = await getImagensSite();
  const [soft, glow, full] = [servico("soft-glam"), servico("glow-glam"), servico("full-glam")];
  const ciliosDesde = formatPreco(Math.min(...CILIOS.map((c) => c.preco)));

  // O hero usa as fotografias locais (curadas, com ponto focal afinado); o resto da página segue o admin.
  const slides: Slide[] = [
    {
      id: "su",
      nome: "Su Beauty Touch",
      label: "Maquilhagem profissional",
      titulo: ["Beleza com", "*assinatura.*"],
      texto: "Cada rosto chega com a sua luz. O meu trabalho é encontrá-la — e deixá-la à vista.",
      imagem: "/img/su-hero.jpeg",
      foco: "50% 28%",
      cta: { href: "/marcacao", label: "Marcar atendimento" },
    },
    {
      id: soft.id,
      nome: soft.nome,
      label: soft.nome,
      titulo: ["Leve como", "a *própria pele.*"],
      texto: "A melhor versão de si, sem que se note o esforço. Pele uniforme, olhar limpo, zero máscara.",
      meta: `${formatPreco(soft.preco)} · ${soft.duracaoTexto}`,
      imagem: IMAGEM_PADRAO["soft-glam"],
      foco: "50% 38%",
      cta: { href: `/marcacao?servico=${soft.id}`, label: `Marcar ${soft.nome}` },
    },
    {
      id: glow.id,
      nome: glow.nome,
      label: glow.nome,
      titulo: ["Luz na", "medida *certa.*"],
      texto: "Sombra com presença e pele luminosa. Funciona de dia, brilha à noite.",
      meta: `${formatPreco(glow.preco)} · ${glow.duracaoTexto}`,
      imagem: IMAGEM_PADRAO["glow-glam"],
      foco: "50% 42%",
      cta: { href: `/marcacao?servico=${glow.id}`, label: `Marcar ${glow.nome}` },
    },
    {
      id: full.id,
      nome: full.nome,
      label: full.nome,
      titulo: ["Para o dia", "que *fica.*"],
      texto: "Casamentos, sessões fotográficas, a noite que vai rever mil vezes. Cílios postiços incluídos.",
      meta: `${formatPreco(full.preco)} · ${full.duracaoTexto}`,
      imagem: IMAGEM_PADRAO["full-glam"],
      foco: "50% 40%",
      cta: { href: `/marcacao?servico=${full.id}`, label: `Marcar ${full.nome}` },
    },
    {
      id: "cilios",
      nome: "Cílios",
      label: "Cílios postiços",
      titulo: ["O olhar", "*termina* aqui."],
      texto: "Natural ou volumoso — o detalhe que fecha qualquer look.",
      meta: `A partir de ${ciliosDesde}`,
      imagem: IMAGEM_PADRAO["cilios-natural"],
      foco: "50% 30%",
      cta: { href: "/servicos", label: "Ver cílios" },
    },
  ];

  const rows: ServiceRow[] = [
    ...SERVICOS.map((s) => ({
      id: s.id,
      nome: s.nome,
      resumo: s.descricao.split(".")[0] + ".",
      duracao: s.duracaoTexto,
      preco: formatPreco(s.preco),
      imagem: imagens[s.id],
      href: `/marcacao?servico=${s.id}`,
    })),
    {
      id: "cilios",
      nome: "Cílios",
      resumo: CILIOS.map((c) => c.nome).join(" ou ") + ", como extra.",
      duracao: "Complemento",
      preco: `+${ciliosDesde}`,
      imagem: imagens["cilios-volumoso"],
      href: "/servicos",
    },
  ];

  const faixa = [
    { src: imagens["full-glam"], nome: "Full Glam" },
    { src: imagens["soft-glam"], nome: "Soft Glam" },
    { src: "/img/su-hero.jpeg", nome: "Su" },
    { src: imagens["cilios-natural"], nome: "Cílios Natural" },
    { src: imagens["glow-glam"], nome: "Glow Glam" },
    { src: imagens["cilios-volumoso"], nome: "Cílios Volumoso" },
  ];

  const passos = [
    {
      titulo: "Escolha o look",
      texto: `${soft.nome}, ${glow.nome} ou ${full.nome}. Cílios à parte, se quiser fechar o olhar.`,
    },
    {
      titulo: "Reserve o horário",
      texto: `Dia e hora no calendário online. Uma taxa de ${formatPreco(TAXA_MARCACAO)} garante o lugar — devolvida se cancelar com 48 horas.`,
    },
    {
      titulo: "Chegue a horas",
      texto: "Pontualidade é tudo: cada atraso empurra a cliente seguinte. Uma acompanhante, no máximo.",
    },
    {
      titulo: "Saia pronta",
      texto: "Pele preparada, acabamento fixado, um rosto que aguenta o dia inteiro — e as fotografias.",
    },
  ];

  return (
    <>
      <HeroSlideshow slides={slides} />

      {/* ---------- A PROFISSIONAL ---------- */}
      <section className="shell grid grid-cols-12 gap-x-6 gap-y-14 py-section">
        <div className="col-span-12 flex items-baseline justify-between md:col-span-3 md:block">
          <p className="eyebrow text-muted">(01) A profissional</p>
          <Reveal className="mt-10 hidden md:block" delay={0.1}>
            <figure className="relative aspect-[3/4] w-full max-w-[15rem] overflow-hidden">
              <Image src="/img/su-hero.jpeg" alt="Su, maquilhadora da Su Beauty Touch" fill sizes="15rem" className="object-cover object-[50%_25%]" />
            </figure>
            <figcaption className="eyebrow mt-4 text-muted">Su — fundadora</figcaption>
          </Reveal>
        </div>
        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <ScrubText
            className="font-display text-lede font-light"
            text="Sou apaixonada por realçar a beleza com técnica moderna, produtos de qualidade e *atenção ao detalhe.* Não aplico a mesma cara a toda a gente: cada atendimento começa por olhar para si — a sua pele, a sua luz, o seu momento — e só depois *pegar no pincel.*"
          />
          <Reveal className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4" delay={0.1}>
            <Link href="/portfolio" className="link-draw eyebrow pb-1">
              Ver o portfólio →
            </Link>
            <Link href="/regras" className="link-draw eyebrow pb-1 text-muted">
              Como funciona o atendimento
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- SERVIÇOS ---------- */}
      <section className="shell pb-section">
        <div className="mb-14 grid grid-cols-12 items-end gap-6">
          <p className="eyebrow col-span-12 text-muted md:col-span-3">(02) Serviços</p>
          <RevealLines lines={["Três looks.", "*Um* padrão."]} className="col-span-12 mb-0 text-h1 md:col-span-6" />
          <Reveal className="col-span-12 md:col-span-3 md:text-right" delay={0.2}>
            <p className="text-muted">Preços em escudos. Pagamento no estúdio, depois da maquilhagem.</p>
          </Reveal>
        </div>
        <ServiceIndex items={rows} />
      </section>

      {/* ---------- FAIXA DE TRABALHOS ---------- */}
      <section aria-labelledby="faixa-titulo" className="overflow-hidden pb-section">
        <div className="shell mb-10 flex items-end justify-between gap-6">
          <h2 id="faixa-titulo" className="mb-0 text-h2">
            Rostos que <em className="font-light">passaram</em> por cá
          </h2>
          <Link href="/portfolio" className="link-draw eyebrow mb-2 shrink-0 pb-1">
            Portfólio completo →
          </Link>
        </div>
        <div className="group flex w-max animate-marquee gap-4 hover:[animation-play-state:paused] md:gap-6">
          {[...faixa, ...faixa].map((f, i) => (
            <figure key={i} aria-hidden={i >= faixa.length} className="w-[clamp(13rem,24vw,22rem)] shrink-0">
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <Image src={f.src} alt={i < faixa.length ? `Trabalho ${f.nome}` : ""} fill sizes="24vw" className="object-cover transition-transform duration-[1200ms] ease-out-expo hover:scale-105" />
              </div>
              <figcaption className="eyebrow mt-3 flex gap-3 text-muted">
                <span className="tabular-nums text-fg">{String((i % faixa.length) + 1).padStart(2, "0")}</span>
                <span>{f.nome}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- PROCESSO (escuro, título fixo) ---------- */}
      <section className="on-pink bg-barbie text-ivory">
        <div className="shell grid grid-cols-12 gap-x-6 gap-y-16 py-section">
          <div className="col-span-12 md:col-span-6">
            <div className="md:sticky md:top-[calc(var(--spacing-header)+3rem)]">
              <p className="eyebrow mb-8 text-ivory/85">(03) Como funciona</p>
              <RevealLines lines={["Da marcação", "*ao espelho.*"]} className="mb-8 text-h1" />
              <Reveal delay={0.2}>
                <Link href="/marcacao" className="btn bg-ivory text-berry hover:bg-berry hover:text-ivory">
                  Ver horários livres <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </div>
          </div>
          <ol className="col-span-12 md:col-span-6 md:col-start-7">
            {passos.map((p, i) => (
              <li key={p.titulo} className="border-t border-ivory/30 py-10 first:border-t-0 first:pt-0 md:py-14">
                <Reveal className="grid grid-cols-[auto_1fr] gap-x-8">
                  <span className="font-display text-7xl leading-[0.8] font-light text-ivory italic tabular-nums md:text-8xl">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="mb-3 text-3xl md:text-4xl">{p.titulo}</h3>
                    <p className="max-w-md text-ivory/90">{p.texto}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- O QUE DIZEM ---------- */}
      <section className="shell grid grid-cols-12 gap-x-6 gap-y-20 py-section">
        <p className="eyebrow col-span-12 text-muted">(04) O que dizem as clientes</p>
        <blockquote className="col-span-12 md:col-span-9">
          <RevealLines as="p" lines={["“Maquiagem impecável,", "*senti-me linda!*”"]} className="font-display text-h1 font-light" />
          <footer className="eyebrow mt-8 text-muted">— Cliente</footer>
        </blockquote>
        <blockquote className="col-span-12 md:col-span-6 md:col-start-7">
          <RevealLines as="p" lines={["“Profissional incrível,", "*super recomendo.*”"]} className="font-display text-h2 font-light" delay={0.1} />
          <footer className="eyebrow mt-6 text-muted">— Cliente</footer>
        </blockquote>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="relative overflow-hidden bg-surface">
        <div className="shell grid grid-cols-12 items-center gap-y-12 py-section">
          <div className="col-span-12 lg:col-span-9">
            <p className="eyebrow mb-8 text-muted">(05) Marcação</p>
            <RevealLines as="h2" lines={["Marque o seu", "*momento.*"]} className="mb-0 text-display" />
          </div>
          <div className="col-span-12 flex lg:col-span-3 lg:justify-end">
            <Magnetic>
              <Link
                href="/marcacao"
                className="grid size-40 place-items-center rounded-full bg-accent text-center text-on-accent transition-colors duration-500 ease-out-expo hover:bg-fg hover:text-bg md:size-48"
              >
                <span className="eyebrow leading-relaxed">
                  Escolher
                  <br />
                  dia e hora
                </span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  );
}
