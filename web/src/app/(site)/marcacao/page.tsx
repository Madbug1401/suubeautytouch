import type { Metadata } from "next";
import Link from "next/link";
import { BookingForm } from "@/components/booking/BookingForm";
import { PageTitle } from "@/components/site/PageTitle";
import { HORARIO, SERVICOS, TAXA_MARCACAO, formatPreco } from "@/lib/config";

export const metadata: Metadata = {
  title: "Agendamento",
  description: "Marque o seu atendimento de maquilhagem online: escolha o serviço, o dia e a hora disponível.",
};

export default async function MarcacaoPage({ searchParams }: { searchParams: Promise<{ servico?: string }> }) {
  const { servico } = await searchParams;
  const inicial = SERVICOS.find((s) => s.id === servico)?.nome ?? "";

  return (
    <div className="container-page">
      <PageTitle
        eyebrow="Agendamento"
        lines={["Reserve a *sua*", "cadeira."]}
        intro="Só aparecem as horas realmente livres. Depois de enviar, entramos em contacto para confirmar."
      />

      <div className="grid grid-cols-12 gap-x-6 gap-y-16">
        <aside className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
            <p className="eyebrow mb-6 text-muted">Antes de marcar</p>
            <ol className="space-y-6">
              {[
                ["Horário", `Inícios entre as ${HORARIO.inicio} e as ${HORARIO.fim}, de ${HORARIO.intervalo} em ${HORARIO.intervalo} minutos.`],
                ["Taxa de marcação", `${formatPreco(TAXA_MARCACAO)}, reembolsável com 48h de antecedência.`],
                ["Pagamento", "O serviço paga-se no estúdio, depois da maquilhagem."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2.5rem_1fr] border-t border-line pt-5">
                  <span className="font-display text-2xl italic text-accent tabular-nums">{i + 1}</span>
                  <div>
                    <p className="font-display text-2xl">{t}</p>
                    <p className="text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/regras" className="link-draw eyebrow pb-1">Regras do atendimento</Link>
              <Link href="/pagamento" className="link-draw eyebrow pb-1">Dados de pagamento</Link>
            </p>
          </div>
        </aside>
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <BookingForm key={inicial} servicoInicial={inicial} />
        </div>
      </div>
    </div>
  );
}
