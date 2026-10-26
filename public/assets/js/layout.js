// layout.js — header, footer e botão WhatsApp partilhados por todas as páginas públicas.
// A página ativa vem de <body data-page="...">.
import { SITE, whatsappUrl, instagramUrl } from "./config.js";

const NAV = [
  { page: "home", href: "index.html", label: "Home" },
  { page: "servicos", href: "servicos.html", label: "Serviços" },
  { page: "portfolio", href: "portfolio.html", label: "Portfólio" },
  { page: "marcacao", href: "marcacao.html", label: "Agendamento" },
  { page: "regras", href: "regras.html", label: "Regras" },
  { page: "pagamento", href: "pagamento.html", label: "Pagamento" },
  { page: "contacto", href: "contacto.html", label: "Contacto" },
];

// Em páginas fora da raiz (ex.: 404 servido noutro caminho) usa <body data-base="/">.
const base = document.body.dataset.base ?? "";
const current = document.body.dataset.page;

function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const links = NAV.map(({ page, href, label }) => {
    const active = page === current ? ' class="active" aria-current="page"' : "";
    return `<li><a href="${base}${href}"${active}>${label}</a></li>`;
  }).join("");

  header.innerHTML = `
    <div class="logo">
      <a href="${base}index.html" class="logo-link">${SITE.nome}</a>
      <button id="theme-toggle-btn" class="theme-toggle" type="button" aria-label="Mudar tema">🌙</button>
    </div>
    <nav aria-label="Navegação principal"><ul>${links}</ul></nav>
  `;
  header.querySelector("#theme-toggle-btn").addEventListener("click", () => window.toggleTheme());
  window.syncThemeButton?.();
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.className = "site-footer";
  footer.innerHTML = `
    <p class="site-footer__brand">${SITE.nome}</p>
    <p class="site-footer__links">
      <a data-link="whatsapp">WhatsApp</a>
      <a data-link="instagram">Instagram</a>
      <a href="${base}regras.html">Regras</a>
    </p>
    <p class="site-footer__copy">© ${year} ${SITE.nome}. Todos os direitos reservados.</p>
  `;
}

function renderWhatsappFloat() {
  if (document.querySelector(".whatsapp-btn")) return;
  const a = document.createElement("a");
  a.className = "whatsapp-btn";
  a.dataset.link = "whatsapp";
  a.setAttribute("aria-label", "Falar connosco no WhatsApp");
  a.innerHTML = '<span aria-hidden="true">💬</span>';
  document.body.appendChild(a);
}

// Preenche todos os <a data-link="whatsapp|instagram" [data-text="..."]>.
// Se o contacto ainda não estiver configurado em config.js, o link fica escondido.
function wireContactLinks() {
  document.querySelectorAll("a[data-link]").forEach((a) => {
    const url =
      a.dataset.link === "whatsapp" ? whatsappUrl(a.dataset.text) :
      a.dataset.link === "instagram" ? instagramUrl() : null;
    if (!url) { a.hidden = true; return; }
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

renderHeader();
renderFooter();
renderWhatsappFloat();
wireContactLinks();
