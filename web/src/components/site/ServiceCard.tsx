import Image from "next/image";
import Link from "next/link";

type Props = {
  imagem: string;
  alt: string;
  titulo?: string;
  children: React.ReactNode;
  href?: string;
  cta?: { href: string; label: string };
};

export function ServiceCard({ imagem, alt, titulo, children, href, cta }: Props) {
  const body = (
    <>
      <div className="relative aspect-[4/3]">
        <Image src={imagem} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
      </div>
      <div className="p-6 text-center">
        {titulo && <h3 className="mb-2 text-xl text-pink-main">{titulo}</h3>}
        <div className="text-sm text-muted">{children}</div>
        {cta && (
          <Link href={cta.href} className="btn mt-4">
            {cta.label}
          </Link>
        )}
      </div>
    </>
  );
  const cls = "card fade-in block transition duration-300 hover:-translate-y-2";
  return href ? <Link href={href} className={cls}>{body}</Link> : <div className={cls}>{body}</div>;
}
