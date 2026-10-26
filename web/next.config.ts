import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Imagens enviadas pelo admin (Firebase Storage)
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "*.firebasestorage.app" },
    ],
  },
  async redirects() {
    // URLs da versão antiga do site
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/services.html", destination: "/servicos", permanent: true },
      { source: "/servicos.html", destination: "/servicos", permanent: true },
      { source: "/portfolio.html", destination: "/portfolio", permanent: true },
      { source: "/appointment.html", destination: "/marcacao", permanent: true },
      { source: "/marcacao.html", destination: "/marcacao", permanent: true },
      { source: "/rules.html", destination: "/regras", permanent: true },
      { source: "/regras.html", destination: "/regras", permanent: true },
      { source: "/payment.html", destination: "/pagamento", permanent: true },
      { source: "/pagamento.html", destination: "/pagamento", permanent: true },
      { source: "/contact.html", destination: "/contacto", permanent: true },
      { source: "/contacto.html", destination: "/contacto", permanent: true },
      { source: "/admin-login-9f3k2.html", destination: "/admin/login", permanent: true },
      { source: "/admin-9f3k2.html", destination: "/admin", permanent: true },
      { source: "/admin-9f3k2/:path*", destination: "/admin", permanent: true },
      { source: "/admin/:page.html", destination: "/admin/:page", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
