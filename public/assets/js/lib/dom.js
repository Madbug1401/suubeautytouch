// lib/dom.js — utilitários de DOM partilhados.

// Escapa texto para inserir em HTML (evita XSS com dados vindos do Firestore).
export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function setMsg(el, texto, tipo = "") {
  if (!el) return;
  el.textContent = texto;
  el.className = `mensagem ${tipo}`.trim();
}

export function fillSelect(select, items, { placeholder, value = (i) => i.id, label = (i) => i.nome } = {}) {
  if (!select) return;
  select.innerHTML = "";
  if (placeholder !== undefined) select.add(new Option(placeholder, ""));
  items.forEach((item) => select.add(new Option(label(item), value(item))));
}
