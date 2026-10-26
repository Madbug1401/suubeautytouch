// admin/layout.js — navbar partilhada do painel admin. Página ativa: <body data-page="...">.
import { logout, requireAdmin } from "./auth.js";

requireAdmin();
const TABS = [
  { page: "agendamentos", href: "agendamentos.html", label: "Agendamentos" },
  { page: "imagens", href: "imagens.html", label: "Imagens do Site" },
  { page: "portfolio", href: "portfolio.html", label: "Portfólio" },
];

const current = document.body.dataset.page;
const nav = document.getElementById("admin-navbar");

if (nav) {
  nav.className = "admin-navbar";
  nav.innerHTML = `
    <div class="logo">
      <a href="index.html" class="logo-link">Su Beauty Touch · Admin</a>
      <button id="theme-toggle-btn" class="theme-toggle" type="button" aria-label="Mudar tema">🌙</button>
    </div>
    <ul class="nav-tabs">
      ${TABS.map((t) => `<li><a href="${t.href}" class="tab-link${t.page === current ? " active" : ""}">${t.label}</a></li>`).join("")}
    </ul>
    <button class="logout-btn" type="button" id="logout-btn">Sair</button>
  `;
  nav.querySelector("#theme-toggle-btn").addEventListener("click", () => window.toggleTheme());
  nav.querySelector("#logout-btn").addEventListener("click", logout);
  window.syncThemeButton?.();
}
