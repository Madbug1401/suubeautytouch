import type { Metadata } from "next";
import { PortfolioManager } from "@/components/admin/PortfolioManager";

export const metadata: Metadata = { title: "Portfólio" };

export default function Page() {
  return <PortfolioManager />;
}
