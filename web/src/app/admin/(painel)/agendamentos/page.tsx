import type { Metadata } from "next";
import { AgendamentosManager } from "@/components/admin/AgendamentosManager";

export const metadata: Metadata = { title: "Agendamentos" };

export default function Page() {
  return <AgendamentosManager />;
}
