// lib/ocupacao.js — horários ocupados (coleção pública `ocupacao`, sem dados pessoais).
// Cada marcação ocupa blocos de HORARIO.intervalo min; um documento por bloco:
//   ocupacao/{AAAA-MM-DD_HH:MM} = { data, hora, agendamentoId }
// As Security Rules impedem o público de criar um bloco que já exista → sem marcações duplicadas.
import { db, collection, doc, query, where, getDocs } from "../firebase.js";
import { HORARIO, duracaoDe } from "../config.js";

export const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
export const toTime = (min) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export const slotId = (data, hora) => `${data}_${hora}`;

// Blocos ocupados por uma marcação.
export function blocos(data, hora, servico) {
  const inicio = toMin(hora);
  const n = Math.max(1, Math.ceil(duracaoDe(servico) / HORARIO.intervalo));
  return Array.from({ length: n }, (_, i) => {
    const h = toTime(inicio + i * HORARIO.intervalo);
    return { id: slotId(data, h), data, hora: h };
  });
}

// Mapa slotId → agendamentoId para um dia.
export async function ocupadosNoDia(data) {
  const snap = await getDocs(query(collection(db, "ocupacao"), where("data", "==", data)));
  return new Map(snap.docs.map((d) => [d.id, d.data().agendamentoId]));
}

export async function blocosDoAgendamento(agendamentoId) {
  const snap = await getDocs(query(collection(db, "ocupacao"), where("agendamentoId", "==", agendamentoId)));
  return snap.docs.map((d) => d.ref);
}

// Acrescenta ao batch os blocos de uma marcação. `ignorar` = ids que não devem ser escritos.
export function reservar(batch, agendamentoId, { data, hora, servico }, ignorar = new Set()) {
  for (const b of blocos(data, hora, servico)) {
    if (ignorar.has(b.id)) continue;
    batch.set(doc(db, "ocupacao", b.id), { data: b.data, hora: b.hora, agendamentoId });
  }
}

export function horariosPossiveis() {
  const out = [];
  for (let m = toMin(HORARIO.inicio); m <= toMin(HORARIO.fim); m += HORARIO.intervalo) out.push(toTime(m));
  return out;
}

// Estados que bloqueiam horário.
export const ESTADOS_ATIVOS = ["pendente", "confirmado"];
