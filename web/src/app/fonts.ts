// Fontes alojadas no próprio site (sem pedidos ao Google Fonts — melhor para RGPD e para o build).
import localFont from "next/font/local";

// Os caminhos têm de ser strings literais (o next/font analisa-os em tempo de build).
export const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const playfair = localFont({
  variable: "--font-playfair",
  display: "swap",
  src: [
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});
