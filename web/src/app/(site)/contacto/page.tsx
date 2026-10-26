import type { Metadata } from "next";
import { ContactLink } from "@/components/site/ContactLink";
import { PageTitle } from "@/components/site/PageTitle";

export const metadata: Metadata = { title: "Contacto", description: "Fale com a Su Beauty Touch por WhatsApp ou Instagram." };

export default function ContactoPage() {
  return (
    <div className="container-page fade-in text-center">
      <PageTitle intro="Entre em contato via WhatsApp ou Instagram.">Contacto</PageTitle>
      <div className="flex flex-wrap justify-center gap-4">
        <ContactLink tipo="whatsapp" className="btn">WhatsApp</ContactLink>
        <ContactLink tipo="instagram" className="btn">Instagram</ContactLink>
      </div>
    </div>
  );
}
