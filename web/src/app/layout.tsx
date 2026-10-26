import type { Metadata, Viewport } from "next";
import { ThemeScript } from "@/components/ThemeScript";
import { SITE } from "@/lib/config";
import { playfair, poppins } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.nome, template: `%s · ${SITE.nome}` },
  description: SITE.descricao,
  openGraph: { siteName: SITE.nome, locale: "pt_PT", type: "website", images: ["/img/su-hero.jpeg"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffdbdb" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${playfair.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
