// pages/marcacao.js — formulário público de agendamento.
// Lê apenas a coleção pública `ocupacao` (sem dados pessoais) e grava a marcação +
// os blocos ocupados num único batch atómico.
import { db, collection, doc, writeBatch, serverTimestamp } from "../firebase.js";
import { SERVICOS, CILIOS, TAXA_MARCACAO, formatPreco } from "../config.js";
import { blocos, ocupadosNoDia, reservar, horariosPossiveis } from "../lib/ocupacao.js";
import { fillSelect } from "../lib/dom.js";

const form = document.getElementById("appointment-form");
const dataInput = document.getElementById("data");
const horaSelect = document.getElementById("hora");
const servicoSelect = document.getElementById("servico");
const ciliosSelect = document.getElementById("cilios");
const mensagem = document.getElementById("mensagem");
const loader = document.getElementById("loader");
const submitBtn = form.querySelector('button[type="submit"]');

fillSelect(servicoSelect, SERVICOS, {
  placeholder: "Serviço escolhido",
  value: (s) => s.nome,
  label: (s) => `${s.nome} - ${formatPreco(s.preco)} (${s.duracao} min)`,
});
fillSelect(ciliosSelect, CILIOS, {
  placeholder: "Cílios (opcional)",
  value: (c) => c.nome,
  label: (c) => `${c.nome} - ${formatPreco(c.preco)}`,
});

// Pré-seleção via URL: marcacao.html?servico=soft-glam
const preset = SERVICOS.find((s) => s.id === new URLSearchParams(location.search).get("servico"));
if (preset) servicoSelect.value = preset.nome;

function localISODate(d = new Date()) {
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().split("T")[0];
}
dataInput.min = localISODate();

function resetHoras() {
  horaSelect.innerHTML = '<option value="">Hora disponível</option>';
}

async function updateHours() {
  const data = dataInput.value;
  const servico = servicoSelect.value;
  resetHoras();
  if (!data || !servico) return;

  try {
    const ocupados = await ocupadosNoDia(data);
    const agora = new Date();
    const hoje = data === localISODate(agora);
    const minAgora = agora.getHours() * 60 + agora.getMinutes();

    horariosPossiveis()
      .filter((h) => !hoje || Number(h.slice(0, 2)) * 60 + Number(h.slice(3)) > minAgora)
      .filter((h) => blocos(data, h, servico).every((b) => !ocupados.has(b.id)))
      .forEach((h) => horaSelect.add(new Option(h, h)));

    mensagem.textContent = horaSelect.options.length === 1 ? "Sem horários disponíveis neste dia." : "";
  } catch (err) {
    console.error(err);
    mensagem.textContent = "Não foi possível carregar os horários. Tente novamente.";
  }
}

dataInput.addEventListener("change", updateHours);
servicoSelect.addEventListener("change", updateHours);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!horaSelect.value) {
    mensagem.textContent = "Escolha um horário disponível.";
    return;
  }
  if (!confirm(`Para confirmar a marcação é necessário pagar a taxa de ${formatPreco(TAXA_MARCACAO)}. Deseja continuar?`)) return;

  loader.hidden = false;
  submitBtn.disabled = true;
  mensagem.textContent = "";

  const observacoes = document.getElementById("observacoes").value.trim().slice(0, 500);
  const agendamento = {
    nome: document.getElementById("nome").value.trim().slice(0, 100),
    telefone: document.getElementById("whatsapp").value.trim().slice(0, 25),
    servico: servicoSelect.value,
    cilios: ciliosSelect.value || null,
    data: dataInput.value,
    hora: horaSelect.value,
    observacoes,
    status: "pendente",
    createdAt: serverTimestamp(),
  };

  try {
    const agRef = doc(collection(db, "agendamentos"));
    const batch = writeBatch(db);
    batch.set(agRef, agendamento);
    reservar(batch, agRef.id, agendamento);
    await batch.commit();

    mensagem.textContent = "Agendamento registado! Aguarde contacto 💖";
    form.reset();
    resetHoras();
  } catch (err) {
    console.error(err);
    if (err.code === "permission-denied") {
      await updateHours();
      mensagem.textContent = "Este horário acabou de ser ocupado ou os dados são inválidos. Escolha outro horário.";
    } else {
      mensagem.textContent = "Erro ao agendar. Tente novamente.";
    }
  } finally {
    loader.hidden = true;
    submitBtn.disabled = false;
  }
});
