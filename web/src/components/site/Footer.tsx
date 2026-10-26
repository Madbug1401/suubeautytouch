import Link from "next/link";
import { SITE } from "@/lib/config";
import { ContactLink } from "./ContactLink";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 pb-24 pt-10 text-center text-sm text-muted">
      <p className="font-title text-xl text-pink-main">{SITE.nome}</p>
      <p className="my-3 flex justify-center gap-5 text-fg">
        <ContactLink tipo="whatsapp" className="hover:text-pink-main">WhatsApp</ContactLink>
        <ContactLink tipo="instagram" className="hover:text-pink-main">Instagram</ContactLink>
        <Link href="/regras" className="hover:text-pink-main">Regras</Link>
      </p>
      <p>© {new Date().getFullYear()} {SITE.nome}. Todos os direitos reservados.</p>
    </footer>
  );
}
