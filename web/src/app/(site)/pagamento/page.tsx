import type { Metadata } from "next";
import { ContactLink } from "@/components/site/ContactLink";
import { CopyButton } from "@/components/site/CopyButton";
import { PageTitle } from "@/components/site/PageTitle";
import { SITE, TAXA_MARCACAO, formatPreco } from "@/lib/config";

export const metadata: Metadata = { title: "Pagamento", description: "Dados para pagamento da taxa de marcação." };

export default function PagamentoPage() {
  const { titular, conta, nib } = SITE.pagamento;
  const linhas = [
    { label: "Titular", value: titular },
    { label: "Conta", value: conta },
    { label: "NIB", value: nib },
  ];

  return (
    <div className="container-page">
      <PageTitle
        eyebrow="Pagamento"
        lines={["Taxa de", "*marcação.*"]}
        intro={`${formatPreco(TAXA_MARCACAO)} por transferência garantem o seu lugar. Reembolsável com 48 horas de antecedência.`}
      />

      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        <dl className="col-span-12 border-t border-fg lg:col-span-8">
          {linhas.map((l) => (
            <div key={l.label} className="grid grid-cols-[1fr_auto] items-end gap-x-6 gap-y-2 border-b border-line py-7 md:grid-cols-[10rem_1fr_auto]">
              <dt className="eyebrow col-span-2 text-muted md:col-span-1 md:pb-2">{l.label}</dt>
              <dd className="min-w-0 break-all font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-none tabular-nums">{l.value}</dd>
              <dd>{l.label !== "Titular" && <CopyButton value={l.value} label={l.label} />}</dd>
            </div>
          ))}
        </dl>
        <aside className="col-span-12 lg:col-span-3 lg:col-start-10">
          <p className="eyebrow mb-4 text-muted">Depois de transferir</p>
          <p className="mb-8 text-muted">Envie o comprovativo pelo WhatsApp para confirmarmos a sua marcação.</p>
          <ContactLink tipo="whatsapp" texto="Já efetuei o pagamento" className="btn">
            Já efetuei o pagamento <span aria-hidden="true">→</span>
          </ContactLink>
        </aside>
      </div>
    </div>
  );
}
