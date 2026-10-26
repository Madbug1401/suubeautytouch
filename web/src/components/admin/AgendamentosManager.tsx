"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Timestamp, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { CILIOS, ESTADOS, ESTADOS_ATIVOS, SERVICOS, type Estado } from "@/lib/config";
import { blocos, blocosDoAgendamento, localISODate, ocupadosNoDia, reservar } from "@/lib/ocupacao";
import type { Agendamento } from "@/lib/types";
import { Message, type Msg } from "@/components/ui/Message";

const POR_PAGINA = 10;

type Form = Omit<Agendamento, "id" | "createdAt" | "observacoes"> & { observacoes: string };
const VAZIO: Form = { nome: "", telefone: "", servico: "", cilios: "", data: "", hora: "", status: "pendente", observacoes: "" };

export function AgendamentosManager() {
  const [lista, setLista] = useState<Agendamento[] | null>(null);
  const [filtro, setFiltro] = useState<"todos" | Estado>("todos");
  const [pagina, setPagina] = useState(1);
  const [msg, setMsg] = useState<Msg>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form | null>(null);

  const load = useCallback(async () => {
    try {
      const snap = await getDocs(query(collection(db, "agendamentos"), orderBy("createdAt", "desc")));
      setLista(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Agendamento));
    } catch (err) {
      console.error(err);
      setLista([]);
      setMsg({ tipo: "error", texto: "Erro ao carregar agendamentos." });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtrados = useMemo(
    () => (lista ?? []).filter((a) => filtro === "todos" || a.status === filtro),
    [lista, filtro],
  );
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  async function confirmar(id: string) {
    if (!confirm("Confirmar este agendamento?")) return;
    try {
      await updateDoc(doc(db, "agendamentos", id), { status: "confirmado" });
      setMsg({ tipo: "success", texto: "Agendamento confirmado!" });
      load();
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "error", texto: "Erro ao confirmar." });
    }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este agendamento?")) return;
    try {
      // Apaga a marcação e liberta os horários que ocupava.
      const batch = writeBatch(db);
      (await blocosDoAgendamento(id)).forEach((ref) => batch.delete(ref));
      batch.delete(doc(db, "agendamentos", id));
      await batch.commit();
      setMsg({ tipo: "success", texto: "Agendamento excluído!" });
      load();
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "error", texto: "Erro ao excluir." });
    }
  }

  async function editar(id: string) {
    const snap = await getDoc(doc(db, "agendamentos", id));
    if (!snap.exists()) return;
    const a = snap.data() as Agendamento;
    setEditId(id);
    setForm({
      nome: a.nome ?? "", telefone: a.telefone ?? "", servico: a.servico ?? "", cilios: a.cilios ?? "",
      data: a.data ?? "", hora: a.hora ?? "", status: a.status ?? "pendente", observacoes: a.observacoes ?? "",
    });
  }

  function fechar() {
    setForm(null);
    setEditId(null);
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const dados = { ...form, nome: form.nome.trim(), telefone: form.telefone.trim(), cilios: form.cilios || null };
    try {
      const id = editId ?? doc(collection(db, "agendamentos")).id;

      // Verifica sobreposição com outras marcações.
      const ocupados = await ocupadosNoDia(dados.data);
      const conflitos = new Set(
        blocos(dados.data, dados.hora, dados.servico)
          .map((b) => b.id)
          .filter((sid) => ocupados.has(sid) && ocupados.get(sid) !== id),
      );
      if (conflitos.size && !confirm("Este horário sobrepõe-se a outra marcação. Guardar mesmo assim?")) return;

      const batch = writeBatch(db);
      if (editId) (await blocosDoAgendamento(id)).forEach((ref) => batch.delete(ref));
      if (ESTADOS_ATIVOS.includes(dados.status)) reservar(batch, id, dados, conflitos);

      const ref = doc(db, "agendamentos", id);
      if (editId) batch.update(ref, dados);
      else batch.set(ref, { ...dados, createdAt: Timestamp.now() });
      await batch.commit();

      setMsg({ tipo: "success", texto: editId ? "Agendamento atualizado!" : "Agendamento criado!" });
      fechar();
      load();
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "error", texto: "Erro ao guardar agendamento." });
    }
  }

  // Recria `ocupacao` a partir das marcações futuras ativas.
  async function sincronizar() {
    if (!confirm("Reconstruir os horários ocupados a partir das marcações futuras?")) return;
    setMsg({ tipo: "info", texto: "A sincronizar horários..." });
    try {
      const hoje = localISODate();
      const ativos = (lista ?? []).filter(
        (a) => a.data >= hoje && a.hora && a.servico && ESTADOS_ATIVOS.includes(a.status ?? "pendente"),
      );
      let batch = writeBatch(db);
      let ops = 0;
      for (const a of ativos) {
        for (const b of blocos(a.data, a.hora, a.servico)) {
          batch.set(doc(db, "ocupacao", b.id), { data: b.data, hora: b.hora, agendamentoId: a.id });
          if (++ops === 450) { await batch.commit(); batch = writeBatch(db); ops = 0; }
        }
      }
      if (ops) await batch.commit();
      setMsg({ tipo: "success", texto: `Horários sincronizados (${ativos.length} marcações).` });
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "error", texto: "Erro ao sincronizar horários." });
    }
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="mb-0">Gestão de Agendamentos</h1>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-outline" onClick={sincronizar} title="Recria os horários ocupados a partir das marcações futuras">
            ↻ Sincronizar horários
          </button>
          <button type="button" className="btn btn-success" onClick={() => { setEditId(null); setForm({ ...VAZIO }); }}>
            + Novo Agendamento
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="filtro">Status:</label>
        <select id="filtro" className="field w-auto py-1.5" value={filtro} onChange={(e) => { setFiltro(e.target.value as typeof filtro); setPagina(1); }}>
          <option value="todos">Todos</option>
          {Object.entries(ESTADOS).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
        </select>
      </div>

      <Message msg={msg} />

      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="w-full border-collapse text-left">
          <thead className="bg-pink-main text-white">
            <tr>
              {["Nome", "WhatsApp", "Serviço", "Cílios", "Data", "Hora", "Status", "Ações"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista === null ? (
              <tr><td colSpan={8} className="p-6 text-center text-muted">A carregar agendamentos...</td></tr>
            ) : !visiveis.length ? (
              <tr><td colSpan={8} className="p-6 text-center text-muted">Nenhum agendamento encontrado.</td></tr>
            ) : (
              visiveis.map((a) => {
                const tel = String(a.telefone ?? "").replace(/\D/g, "");
                const status: Estado = a.status in ESTADOS ? a.status : "pendente";
                return (
                  <tr key={a.id} className="border-b border-pink-light hover:bg-surface dark:border-line">
                    <td className="px-4 py-3">
                      {a.nome || "N/A"}
                      {a.observacoes && <small className="block italic text-muted">{a.observacoes}</small>}
                    </td>
                    <td className="px-4 py-3">
                      {tel ? <a href={`https://wa.me/${tel}`} target="_blank" rel="noopener noreferrer" className="underline">{a.telefone}</a> : "N/A"}
                    </td>
                    <td className="px-4 py-3">{a.servico || "N/A"}</td>
                    <td className="px-4 py-3">{a.cilios || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{a.data || "N/A"}</td>
                    <td className="px-4 py-3">{a.hora || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${status === "pendente" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                        {ESTADOS[status]}
                      </span>
                    </td>
                    <td className="space-x-1 whitespace-nowrap px-4 py-3">
                      {status === "pendente" && <button type="button" className="btn btn-sm" onClick={() => confirmar(a.id)}>Confirmar</button>}
                      <button type="button" className="btn btn-sm btn-warning" onClick={() => editar(a.id)}>Editar</button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => excluir(a.id)}>Excluir</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" className="btn btn-outline btn-sm" disabled={paginaAtual <= 1} onClick={() => setPagina(paginaAtual - 1)}>Anterior</button>
        <span>Página {paginaAtual} de {totalPaginas}</span>
        <button type="button" className="btn btn-outline btn-sm" disabled={paginaAtual >= totalPaginas} onClick={() => setPagina(paginaAtual + 1)}>Próximo</button>
      </div>

      {form && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={(e) => e.target === e.currentTarget && fechar()}
          onKeyDown={(e) => e.key === "Escape" && fechar()}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-bg p-8 shadow-2xl dark:bg-surface">
            <div className="flex items-start justify-between">
              <h2 id="modal-title">{editId ? "Editar Agendamento" : "Novo Agendamento"}</h2>
              <button type="button" onClick={fechar} aria-label="Fechar" className="text-3xl leading-none">&times;</button>
            </div>
            <form onSubmit={guardar} className="mt-4 grid gap-3">
              <input className="field" placeholder="Nome completo" required value={form.nome} onChange={(e) => set("nome", e.target.value)} />
              <input className="field" type="tel" placeholder="WhatsApp" required value={form.telefone} onChange={(e) => set("telefone", e.target.value)} />
              <select className="field" required value={form.servico} onChange={(e) => set("servico", e.target.value)}>
                <option value="">Serviço</option>
                {SERVICOS.map((s) => <option key={s.id} value={s.nome}>{s.nome}</option>)}
              </select>
              <select className="field" value={form.cilios ?? ""} onChange={(e) => set("cilios", e.target.value)}>
                <option value="">Cílios (opcional)</option>
                {CILIOS.map((c) => <option key={c.id} value={c.nome}>{c.nome}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input className="field" type="date" required value={form.data} onChange={(e) => set("data", e.target.value)} />
                <input className="field" type="time" required value={form.hora} onChange={(e) => set("hora", e.target.value)} />
              </div>
              <textarea className="field" placeholder="Observações" maxLength={500} value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} />
              <select className="field" value={form.status} onChange={(e) => set("status", e.target.value as Estado)}>
                {Object.entries(ESTADOS).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
              </select>
              <button type="submit" className="btn btn-success">Guardar</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
