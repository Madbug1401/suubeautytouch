import { ContactLink } from "./ContactLink";

export function WhatsAppButton() {
  return (
    <ContactLink
      tipo="whatsapp"
      aria-label="Falar connosco no WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid size-16 place-items-center rounded-full bg-pink-main text-3xl shadow-xl transition hover:scale-110"
    >
      <span aria-hidden="true">💬</span>
    </ContactLink>
  );
}
