// ocupacao.ts — horários ocupados (coleção pública `ocupacao`, sem dados pessoais).
// Cada marcação ocupa blocos de HORARIO.intervalo min; um documento por bloco:
//   ocupacao/{AAAA-MM-DD_HH:MM} = { data, hora, agendamentoId }
// As Security Rules impedem o público de criar um bloco que já exista → sem marcações duplicadas.
import { collection, doc, getDocs, query, where, type WriteBatch } from "firebase/firestore";
import { db } from "./firebase/client";
import { HORARIO, duracaoDe } from "./config";

export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
export const toTime = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export const slotId = (data: string, hora: string) => `${data}_${hora}`;

export type Bloco = { id: string; data: string; hora: string };

export function blocos(data: string, hora: string, servico: string): Bloco[] {
  const inicio = toMin(hora);
  const n = Math.max(1, Math.ceil(duracaoDe(servico) / HORARIO.intervalo));
  return Array.from({ length: n }, (_, i) => {
    const h = toTime(inicio + i * HORARIO.intervalo);
    return { id: slotId(data, h), data, hora: h };
  });
}

/** Mapa slotId → agendamentoId para um dia. */
export async function ocupadosNoDia(data: string) {
  const snap = await getDocs(query(collection(db, "ocupacao"), where("data", "==", data)));
  return new Map(snap.docs.map((d) => [d.id, d.data().agendamentoId as string]));
}

export async function blocosDoAgendamento(agendamentoId: string) {
  const snap = await getDocs(query(collection(db, "ocupacao"), where("agendamentoId", "==", agendamentoId)));
  return snap.docs.map((d) => d.ref);
}

/** Acrescenta ao batch os blocos de uma marcação. `ignorar` = ids que não devem ser escritos. */
export function reservar(
  batch: WriteBatch,
  agendamentoId: string,
  { data, hora, servico }: { data: string; hora: string; servico: string },
  ignorar: Set<string> = new Set(),
) {
  for (const b of blocos(data, hora, servico)) {
    if (ignorar.has(b.id)) continue;
    batch.set(doc(db, "ocupacao", b.id), { data: b.data, hora: b.hora, agendamentoId });
  }
}

export function horariosPossiveis() {
  const out: string[] = [];
  for (let m = toMin(HORARIO.inicio); m <= toMin(HORARIO.fim); m += HORARIO.intervalo) out.push(toTime(m));
  return out;
}

/** Data local em AAAA-MM-DD (evita o desvio de fuso do toISOString). */
export function localISODate(d = new Date()) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0];
}
