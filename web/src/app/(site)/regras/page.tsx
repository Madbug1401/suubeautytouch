import type { Metadata } from "next";
import { PageTitle } from "@/components/site/PageTitle";
import { REGRAS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Regras do Atendimento",
  description: "Regras e informações importantes para o seu atendimento de maquilhagem.",
};

export default function RegrasPage() {
  return (
    <div className="container-page max-w-3xl fade-in">
      <PageTitle>Regras do Atendimento</PageTitle>
      <h2>Informações Importantes</h2>
      <ul className="list-inside list-disc space-y-2">
        {REGRAS.map((r) => <li key={r}>{r}</li>)}
      </ul>
      <p className="mt-8 text-center italic">Assinatura: Su Beauty Touch 💘</p>
    </div>
  );
}
