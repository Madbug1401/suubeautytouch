import type { Metadata } from "next";
import { ContactLink } from "@/components/site/ContactLink";
import { CopyButton } from "@/components/site/CopyButton";
import { PageTitle } from "@/components/site/PageTitle";
import { SITE } from "@/lib/config";

export const metadata: Metadata = { title: "Pagamento", description: "Dados para pagamento da taxa de marcação." };

export default function PagamentoPage() {
  const { titular, conta, nib } = SITE.pagamento;
  const linhas = [
    { label: "Titular", value: titular },
    { label: "Conta", value: conta },
    { label: "NIB", value: nib },
  ];

  return (
    <div className="container-page max-w-xl fade-in text-center">
      <PageTitle>Pagamento</PageTitle>
      <dl className="card divide-y divide-line text-left">
        {linhas.map((l) => (
          <div key={l.label} className="flex items-center justify-between gap-4 p-4">
            <div>
              <dt className="text-sm text-muted">{l.label}</dt>
              <dd className="font-medium break-all">{l.value}</dd>
            </div>
            {l.label !== "Titular" && <CopyButton value={l.value} label={l.label} />}
          </div>
        ))}
      </dl>
      <ContactLink tipo="whatsapp" texto="Já efetuei o pagamento" className="btn mt-8">
        👉 Já efetuei o pagamento
      </ContactLink>
    </div>
  );
}
