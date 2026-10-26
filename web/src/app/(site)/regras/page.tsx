import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PageTitle } from "@/components/site/PageTitle";
import { REGRAS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Regras do Atendimento",
  description: "Regras e informações importantes para o seu atendimento de maquilhagem.",
};

export default function RegrasPage() {
  return (
    <div className="container-page">
      <PageTitle
        eyebrow="Regras do atendimento"
        lines={["Poucas regras.", "*Todas* importantes."]}
        intro="Existem para que cada cliente tenha o tempo e a atenção que merece — incluindo a que vem depois de si."
      />

      <ol className="grid grid-cols-12 gap-x-6">
        {REGRAS.map((r, i) => (
          <li key={r} className="col-span-12 border-b border-line first:border-t lg:col-span-10 lg:col-start-3">
            <Reveal className="grid grid-cols-[3.5rem_1fr] items-baseline gap-x-6 py-8 md:grid-cols-[6rem_1fr] md:py-12">
              <span className="font-display text-5xl font-light italic text-accent tabular-nums md:text-7xl">{i + 1}</span>
              <p className="font-display text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">{r}</p>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="mt-20 grid grid-cols-12 gap-6">
        <p className="col-span-12 font-display text-4xl italic md:col-span-6 lg:col-start-3">— Su Beauty Touch</p>
        <div className="col-span-12 md:col-span-4 md:text-right">
          <Link href="/marcacao" className="btn">
            Marcar atendimento <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
