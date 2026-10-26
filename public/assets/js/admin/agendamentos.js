// admin/agendamentos.js — lista, filtro, paginação e CRUD de agendamentos.
import {
  db, collection, doc, query, orderBy,
  getDocs, getDoc, updateDoc, writeBatch, Timestamp,
} from "../firebase.js";
import { SERVICOS, CILIOS, ESTADOS } from "../config.js";
import { esc, setMsg, fillSelect } from "../lib/dom.js";
import { blocos, ocupadosNoDia, blocosDoAgendamento, reservar, ESTADOS_ATIVOS } from "../lib/ocupacao.js";
import { requireAdmin } from "./auth.js";

const ITEMS_PER_PAGE = 10;
const COLS = 8;

const tbody = document.querySelector("#admin-table tbody");
const mensagem = document.getElementById("admin-mensagem");
const filtroStatus = document.getElementById("filtro-status");
const btnPrev = document.getElementById("btn-prev-page");
const btnNext = document.getElementById("btn-next-page");
const pageInfo = document.getElementById("page-info");

const modal = document.getElementById("modal-agendamento");
const modalTitle = document.getElementById("modal-agendamento-title");
const form = document.getElementById("form-agendamento");
const field = (id) => document.getElementById(id);

let agendamentos = [];
let editingId = null;
let currentPage = 1;
let currentFilter = "todos";

// Selects gerados a partir do config (iguais ao formulário público).
fillSelect(field("servico"), SERVICOS, { placeholder: "Serviço", value: (s) => s.nome });
fillSelect(field("cilios"), CILIOS, { placeholder: "Cílios (opcional)", value: (c) => c.nome });
const estados = Object.entries(ESTADOS).map(([id, nome]) => ({ id, nome }));
fillSelect(field("status"), estados);
fillSelect(filtroStatus, [{ id: "todos", nome: "Todos" }, ...estados]);

const rowMessage = (cls, text) => `<tr><td colspan="${COLS}" class="${cls}">${text}</td></tr>`;

async function load() {
  tbody.innerHTML = rowMessage("loading", "A carregar agendamentos...");
  try {
    const snapshot = await getDocs(query(collection(db, "agendamentos"), orderBy("createdAt", "desc")));
    agendamentos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    render();
  } catch (err) {
    console.error("Erro ao carregar agendamentos:", err);
    setMsg(mensagem, "Erro ao carregar agendamentos.", "error");
    tbody.innerHTML = rowMessage("error", "Erro ao carregar.");
  }
}

function render() {
  const list = currentFilter === "todos" ? agendamentos : agendamentos.filter((a) => a.status === currentFilter);
  const totalPages = Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE));
  currentPage = Math.min(currentPage, totalPages);

  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  btnPrev.disabled = currentPage <= 1;
  btnNext.disabled = currentPage >= totalPages;

  if (!list.length) {
    tbody.innerHTML = rowMessage("empty", "Nenhum agendamento encontrado.");
    return;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  tbody.innerHTML = list.slice(start, start + ITEMS_PER_PAGE).map((a) => {
    const tel = String(a.telefone ?? "").replace(/\D/g, "");
    const status = ESTADOS[a.status] ? a.status : "pendente";
    return `
      <tr>
        <td>${esc(a.nome || "N/A")}${a.observacoes ? `<br><small class="obs">${esc(a.observacoes)}</small>` : ""}</td>
        <td>${tel ? `<a href="https://wa.me/${tel}" target="_blank" rel="noopener">${esc(a.telefone)}</a>` : "N/A"}</td>
        <td>${esc(a.servico || "N/A")}</td>
        <td>${esc(a.cilios || "—")}</td>
        <td>${esc(a.data || "N/A")}</td>
        <td>${esc(a.hora || "N/A")}</td>
        <td><span class="status-badge status-${status}">${ESTADOS[status]}</span></td>
        <td class="acoes">
          ${status === "pendente" ? `<button class="btn confirmar" data-action="confirmar" data-id="${esc(a.id)}">Confirmar</button>` : ""}
          <button class="btn editar" data-action="editar" data-id="${esc(a.id)}">Editar</button>
          <button class="btn excluir" data-action="excluir" data-id="${esc(a.id)}">Excluir</button>
        </td>
      </tr>`;
  }).join("");
}

// Delegação de eventos na tabela.
tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === "confirmar") confirmar(id);
  if (action === "editar") editar(id);
  if (action === "excluir") excluir(id);
});

async function confirmar(id) {
  if (!confirm("Confirmar este agendamento?")) return;
  try {
    await updateDoc(doc(db, "agendamentos", id), { status: "confirmado" });
    setMsg(mensagem, "Agendamento confirmado!", "success");
    load();
  } catch (err) {
    console.error(err);
    setMsg(mensagem, "Erro ao confirmar.", "error");
  }
}

async function excluir(id) {
  if (!confirm("Excluir este agendamento?")) return;
  try {
    // Apaga a marcação e liberta os horários que ocupava.
    const batch = writeBatch(db);
    (await blocosDoAgendamento(id)).forEach((ref) => batch.delete(ref));
    batch.delete(doc(db, "agendamentos", id));
    await batch.commit();
    setMsg(mensagem, "Agendamento excluído!", "success");
    load();
  } catch (err) {
    console.error(err);
    setMsg(mensagem, "Erro ao excluir.", "error");
  }
}

async function editar(id) {
  try {
    const snap = await getDoc(doc(db, "agendamentos", id));
    if (!snap.exists()) return;
    const a = snap.data();
    field("nome").value = a.nome || "";
    field("whatsapp").value = a.telefone || "";
    field("servico").value = a.servico || "";
    field("cilios").value = a.cilios || "";
    field("data").value = a.data || "";
    field("hora").value = a.hora || "";
    field("status").value = a.status || "pendente";
    editingId = id;
    openModal("Editar Agendamento");
  } catch (err) {
    console.error(err);
    setMsg(mensagem, "Erro ao carregar dados para edição.", "error");
  }
}

function openModal(title) {
  modalTitle.textContent = title;
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
  editingId = null;
  form.reset();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = {
    nome: field("nome").value.trim(),
    telefone: field("whatsapp").value.trim(),
    servico: field("servico").value,
    cilios: field("cilios").value || null,
    data: field("data").value,
    hora: field("hora").value,
    status: field("status").value,
  };
  try {
    const id = editingId ?? doc(collection(db, "agendamentos")).id;

    // Verifica sobreposição com outras marcações.
    const ocupados = await ocupadosNoDia(dados.data);
    const conflitos = new Set(
      blocos(dados.data, dados.hora, dados.servico)
        .map((b) => b.id)
        .filter((sid) => ocupados.has(sid) && ocupados.get(sid) !== id)
    );
    if (conflitos.size && !confirm("Este horário sobrepõe-se a outra marcação. Guardar mesmo assim?")) return;

    const batch = writeBatch(db);
    // Liberta os blocos antigos desta marcação e reserva os novos (sem tocar nos de outras).
    if (editingId) (await blocosDoAgendamento(id)).forEach((ref) => batch.delete(ref));
    if (ESTADOS_ATIVOS.includes(dados.status)) reservar(batch, id, dados, conflitos);

    const agRef = doc(db, "agendamentos", id);
    if (editingId) batch.update(agRef, dados);
    else batch.set(agRef, { ...dados, createdAt: Timestamp.now() });
    await batch.commit();

    setMsg(mensagem, editingId ? "Agendamento atualizado!" : "Agendamento criado!", "success");
    closeModal();
    load();
  } catch (err) {
    console.error(err);
    setMsg(mensagem, "Erro ao salvar agendamento.", "error");
  }
});

document.getElementById("btn-novo-agendamento").addEventListener("click", () => {
  editingId = null;
  form.reset();
  openModal("Novo Agendamento");
});
modal.querySelector(".close-modal").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.style.display === "flex") closeModal(); });

filtroStatus.addEventListener("change", (e) => {
  currentFilter = e.target.value;
  currentPage = 1;
  render();
});
btnPrev.addEventListener("click", () => { currentPage--; render(); });
btnNext.addEventListener("click", () => { currentPage++; render(); });

// Recria a coleção `ocupacao` a partir das marcações futuras ativas.
// Necessário uma vez (marcações anteriores à coleção) ou se algo ficar dessincronizado.
document.getElementById("btn-sync-ocupacao").addEventListener("click", async () => {
  if (!confirm("Reconstruir os horários ocupados a partir das marcações futuras?")) return;
  setMsg(mensagem, "A sincronizar horários...", "loading");
  try {
    const hoje = new Date().toISOString().split("T")[0];
    const ativos = agendamentos.filter((a) => a.data >= hoje && a.hora && a.servico && ESTADOS_ATIVOS.includes(a.status ?? "pendente"));
    let batch = writeBatch(db);
    let ops = 0;
    for (const a of ativos) {
      for (const b of blocos(a.data, a.hora, a.servico)) {
        batch.set(doc(db, "ocupacao", b.id), { data: b.data, hora: b.hora, agendamentoId: a.id });
        if (++ops === 450) { await batch.commit(); batch = writeBatch(db); ops = 0; }
      }
    }
    if (ops) await batch.commit();
    setMsg(mensagem, `Horários sincronizados (${ativos.length} marcações).`, "success");
  } catch (err) {
    console.error(err);
    setMsg(mensagem, "Erro ao sincronizar horários.", "error");
  }
});

requireAdmin().then(load);
