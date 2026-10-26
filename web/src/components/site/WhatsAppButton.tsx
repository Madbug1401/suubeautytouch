"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ContactLink } from "./ContactLink";

/** Na home só aparece depois do hero (não tapa o cartão "A seguir"). */
export function WhatsAppButton() {
  const pathname = usePathname();
  const [show, setShow] = useState(pathname !== "/");

  useEffect(() => {
    if (pathname !== "/") return setShow(true);
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <ContactLink
      tipo="whatsapp"
      aria-label="Falar connosco no WhatsApp"
      className={`group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-accent py-3 pl-5 pr-3 text-on-accent transition-[translate,opacity,background-color,color] duration-700 ease-out-expo hover:bg-fg hover:text-bg ${
        show ? "" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="eyebrow">Conversar</span>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    </ContactLink>
  );
}
