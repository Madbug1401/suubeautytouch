import Link from "next/link";
import { HORARIO, SITE } from "@/lib/config";
import { ContactLink } from "./ContactLink";
import { NAV } from "./nav";

export function Footer() {
  return (
    <footer className="on-pink overflow-hidden bg-barbie text-ivory">
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-12 pb-10 pt-24">
        <div className="col-span-12 md:col-span-5">
          <p className="eyebrow mb-5 text-ivory/80">Marcações</p>
          <p className="max-w-sm font-display text-3xl leading-tight font-light">
            Atendimento por marcação, com inícios entre as {HORARIO.inicio} e as {HORARIO.fim}.{" "}
            <Link href="/marcacao" className="link-draw italic underline decoration-1 underline-offset-[0.2em]">
              Ver horários livres
            </Link>
          </p>
        </div>
        <nav aria-label="Rodapé" className="col-span-6 md:col-span-3 md:col-start-7">
          <p className="eyebrow mb-5 text-ivory/80">Site</p>
          <ul className="space-y-2">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="link-draw text-ivory hover:text-berry">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-6 md:col-span-3">
          <p className="eyebrow mb-5 text-ivory/80">Contacto</p>
          <ul className="space-y-2 text-ivory">
            <li>
              <ContactLink tipo="whatsapp" className="link-draw hover:text-berry">WhatsApp</ContactLink>
            </li>
            <li>
              <ContactLink tipo="instagram" className="link-draw hover:text-berry">Instagram</ContactLink>
            </li>
            <li>
              <Link href="/pagamento" className="link-draw hover:text-berry">Dados de pagamento</Link>
            </li>
          </ul>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="select-none whitespace-nowrap pb-[2.5vw] text-center font-display text-[16.8vw] leading-[0.95] font-light tracking-[-0.05em] text-ivory italic"
      >
        {SITE.nome}
      </p>

      <div className="shell flex flex-wrap justify-between gap-4 border-t border-ivory/30 py-6 pb-24 md:pb-6">
        <p className="eyebrow text-ivory/80">© {new Date().getFullYear()} {SITE.nome}</p>
        <p className="eyebrow text-ivory/80">Todos os direitos reservados</p>
      </div>
    </footer>
  );
}
