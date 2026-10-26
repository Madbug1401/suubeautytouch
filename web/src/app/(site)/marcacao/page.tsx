import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";
import { PageTitle } from "@/components/site/PageTitle";
import { SERVICOS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Agendamento",
  description: "Marque o seu atendimento de maquilhagem online: escolha o serviço, o dia e a hora disponível.",
};

export default async function MarcacaoPage({ searchParams }: { searchParams: Promise<{ servico?: string }> }) {
  const { servico } = await searchParams;
  const inicial = SERVICOS.find((s) => s.id === servico)?.nome ?? "";

  return (
    <div className="container-page">
      <PageTitle>Agendamento</PageTitle>
      <BookingForm key={inicial} servicoInicial={inicial} />
    </div>
  );
}
