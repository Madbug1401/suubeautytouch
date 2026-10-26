import { instagramUrl, whatsappUrl } from "@/lib/config";

type Props = {
  tipo: "whatsapp" | "instagram";
  texto?: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

/** Link de contacto a partir do config. Se o contacto não estiver configurado, não renderiza nada. */
export function ContactLink({ tipo, texto, className, children, ...rest }: Props) {
  const href = tipo === "whatsapp" ? whatsappUrl(texto) : instagramUrl();
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
    </a>
  );
}
