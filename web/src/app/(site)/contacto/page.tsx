import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/site/PageTitle";
import { instagramUrl, whatsappUrl } from "@/lib/config";

export const metadata: Metadata = { title: "Contacto", description: "Fale com a Su Beauty Touch por WhatsApp ou Instagram." };

export default function ContactoPage() {
  const canais = [
    { nome: "WhatsApp", nota: "Dúvidas, confirmações, comprovativos", href: whatsappUrl() },
    { nome: "Instagram", nota: "Trabalhos recentes e bastidores", href: instagramUrl() },
  ].filter((c) => c.href);

  return (
    <div className="container-page">
      <PageTitle eyebrow="Contacto" lines={["Vamos *falar.*"]} intro="Respondemos por mensagem. Para marcar, o mais rápido é o calendário online." />

      <ul className="border-t border-line">
        {canais.map((c) => (
          <li key={c.nome} className="border-b border-line">
            <a href={c.href!} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[1fr_auto] items-center gap-6 py-8 md:py-12">
              <span>
                <span className="block font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-[-0.03em] transition-transform duration-700 ease-out-expo group-hover:translate-x-4 group-hover:italic">
                  {c.nome}
                </span>
                <span className="eyebrow mt-3 block text-muted">{c.nota}</span>
              </span>
              <span aria-hidden="true" className="grid size-14 place-items-center rounded-full ring-1 ring-line transition-colors duration-500 group-hover:bg-accent group-hover:text-on-accent group-hover:ring-accent md:size-20">
                ↗
              </span>
            </a>
          </li>
        ))}
        <li className="border-b border-line">
          <Link href="/marcacao" className="group grid grid-cols-[1fr_auto] items-center gap-6 py-8 md:py-12">
            <span>
              <span className="block font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-[-0.03em] italic text-accent transition-transform duration-700 ease-out-expo group-hover:translate-x-4">
                Marcar online
              </span>
              <span className="eyebrow mt-3 block text-muted">Horas livres em tempo real</span>
            </span>
            <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-accent text-on-accent md:size-20">
              →
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
