import type { Metadata, Viewport } from "next";
import { ThemeScript } from "@/components/ThemeScript";
import { SITE } from "@/lib/config";
import { cormorant, manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.nome, template: `%s · ${SITE.nome}` },
  description: SITE.descricao,
  openGraph: { siteName: SITE.nome, locale: "pt_PT", type: "website", images: ["/img/su-hero.jpeg"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#24101a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
