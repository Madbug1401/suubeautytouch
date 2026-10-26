// Fontes alojadas no próprio site (sem pedidos ao Google Fonts — melhor para RGPD e para o build).
import localFont from "next/font/local";

// Os caminhos têm de ser strings literais (o next/font analisa-os em tempo de build).

/** Display — serifa de revista, usada grande e com itálico misturado. */
export const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  src: [
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
});

/** Texto — grotesca disciplinada, variável (200–800). */
export const manrope = localFont({
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
  src: [{ path: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2", style: "normal" }],
});
