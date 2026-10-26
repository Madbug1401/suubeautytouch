"use client";

// Formulário público de agendamento.
// Lê apenas a coleção pública `ocupacao` e grava a marcação + blocos ocupados num batch atómico.
import { useEffect, useMemo, useState } from "react";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { db } from "@/lib/firebase/client";
import { CILIOS, SERVICOS, TAXA_MARCACAO, formatPreco } from "@/lib/config";
import { blocos, horariosPossiveis, localISODate, ocupadosNoDia, reservar, toMin } from "@/lib/ocupacao";

type Msg = { tipo: "success" | "error" | "info"; texto: string } | null;

export function BookingForm({ servicoInicial = "" }: { servicoInicial?: string }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState(servicoInicial);
  const [cilios, setCilios] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [aceito, setAceito] = useState(false);

  const [horas, setHoras] = useState<string[]>([]);
  const [aCarregarHoras, setACarregarHoras] = useState(false);
  const [aEnviar, setAEnviar] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [reload, setReload] = useState(0);

  const hoje = useMemo(() => localISODate(), []);

  useEffect(() => {
    setHora("");
    setHoras([]);
    if (!data || !servico) return;
    let cancel = false;
    setACarregarHoras(true);
    ocupadosNoDia(data)
      .then((ocupados) => {
        if (cancel) return;
        const agora = new Date();
        const minAgora = agora.getHours() * 60 + agora.getMinutes();
        const livres = horariosPossiveis()
          .filter((h) => data !== localISODate(agora) || toMin(h) > minAgora)
          .filter((h) => blocos(data, h, servico).every((b) => !ocupados.has(b.id)));
        setHoras(livres);
      })
      .catch((err) => {
        console.error(err);
        if (!cancel) setMsg({ tipo: "error", texto: "Não foi possível carregar os horários. Tente novamente." });
      })
      .finally(() => !cancel && setACarregarHoras(false));
    return () => {
      cancel = true;
    };
  }, [data, servico, reload]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hora) return setMsg({ tipo: "error", texto: "Escolha um horário disponível." });

    setAEnviar(true);
    setMsg(null);
    try {
      const agRef = doc(collection(db, "agendamentos"));
      const agendamento = {
        nome: nome.trim().slice(0, 100),
        telefone: telefone.trim().slice(0, 25),
        servico,
        cilios: cilios || null,
        data,
        hora,
        observacoes: observacoes.trim().slice(0, 500),
        status: "pendente",
        createdAt: serverTimestamp(),
      };
      const batch = writeBatch(db);
      batch.set(agRef, agendamento);
      reservar(batch, agRef.id, agendamento);
      await batch.commit();

      setMsg({ tipo: "success", texto: "Agendamento registado! Entraremos em contacto para confirmar." });
      setNome(""); setTelefone(""); setCilios(""); setData(""); setHora(""); setObservacoes(""); setAceito(false);
    } catch (err) {
      console.error(err);
      if (err instanceof FirebaseError && err.code === "permission-denied") {
        setReload((r) => r + 1);
        setMsg({ tipo: "error", texto: "Este horário acabou de ser ocupado ou os dados são inválidos. Escolha outro horário." });
      } else {
        setMsg({ tipo: "error", texto: "Erro ao agendar. Tente novamente." });
      }
    } finally {
      setAEnviar(false);
    }
  }

  const passo = "eyebrow mb-5 flex items-center gap-3 text-muted";
  const num = "font-display text-xl italic normal-case tracking-normal text-accent";

  return (
    <form onSubmit={onSubmit} className="grid gap-14">
      {/* 1 — Serviço */}
      <fieldset>
        <legend className={passo}><span className={num}>1</span> Serviço</legend>
        <div className="border-t border-line">
          {SERVICOS.map((s) => (
            <label
              key={s.id}
              className="group flex cursor-pointer items-baseline justify-between gap-4 border-b border-line py-5 transition-colors has-[:checked]:text-accent has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-accent"
            >
              <input type="radio" name="servico" value={s.nome} required checked={servico === s.nome} onChange={(e) => setServico(e.target.value)} className="sr-only" />
              <span className="flex items-baseline gap-4">
                <span aria-hidden="true" className="relative top-[-0.2em] grid size-4 place-items-center rounded-full ring-1 ring-current">
                  <span className="size-2 scale-0 rounded-full bg-current transition-transform duration-300 group-has-[:checked]:scale-100" />
                </span>
                <span className="font-display text-3xl transition-transform duration-500 ease-out-expo group-hover:translate-x-1 md:text-4xl">{s.nome}</span>
              </span>
              <span className="text-right">
                <span className="block font-display text-2xl tabular-nums">{formatPreco(s.preco)}</span>
                <span className="eyebrow text-muted">{s.duracaoTexto}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-8">
          <label htmlFor="cilios" className="label">Cílios (opcional)</label>
          <select id="cilios" className="field" value={cilios} onChange={(e) => setCilios(e.target.value)}>
            <option value="">Sem cílios extra</option>
            {CILIOS.map((c) => (
              <option key={c.id} value={c.nome}>{c.nome} — +{formatPreco(c.preco)}</option>
            ))}
          </select>
        </div>
      </fieldset>

      {/* 2 — Dia e hora */}
      <fieldset>
        <legend className={passo}><span className={num}>2</span> Dia e hora</legend>
        <label htmlFor="data" className="label">Data</label>
        <input id="data" type="date" className="field max-w-xs" min={hoje} required value={data} onChange={(e) => { setMsg(null); setData(e.target.value); }} />
        <div className="mt-8" role="group" aria-labelledby="hora-label">
          <p id="hora-label" className="label">Hora</p>
          {!data || !servico ? (
            <p className="py-3 text-muted">Escolha o serviço e a data para ver as horas livres.</p>
          ) : aCarregarHoras ? (
            <p className="py-3 text-muted" role="status">A procurar horas livres…</p>
          ) : !horas.length ? (msg?.tipo === "error" ? null : (
            <p className="py-3 font-display text-2xl italic text-muted">Dia completo — experimente outra data.</p>
          )
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {horas.map((h) => (
                <button
                  key={h}
                  type="button"
                  aria-pressed={hora === h}
                  onClick={() => setHora(h)}
                  className="rounded-full px-4 py-2 text-sm tabular-nums ring-1 ring-line transition-colors duration-300 hover:ring-fg aria-pressed:bg-accent aria-pressed:text-on-accent aria-pressed:ring-accent"
                >
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>
      </fieldset>

      {/* 3 — Os seus dados */}
      <fieldset className="grid gap-8">
        <legend className={passo}><span className={num}>3</span> Os seus dados</legend>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="nome" className="label">Nome completo</label>
            <input id="nome" className="field" autoComplete="name" minLength={2} maxLength={100} required value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div>
            <label htmlFor="whatsapp" className="label">WhatsApp</label>
            <input id="whatsapp" type="tel" className="field" autoComplete="tel" minLength={7} maxLength={25} required value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </div>
        </div>
        <div>
          <label htmlFor="observacoes" className="label">Observações</label>
          <textarea id="observacoes" className="field min-h-24" maxLength={500} placeholder="Evento, alergias, referências de look…" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
        </div>
      </fieldset>

      <div className="border-l-2 border-accent bg-surface p-6 md:p-8">
        <p className="eyebrow mb-4 text-accent">Antes de confirmar</p>
        <p>
          Para garantir o seu lugar é necessária uma taxa de marcação de <strong className="font-semibold">{formatPreco(TAXA_MARCACAO)}</strong>,
          reembolsada em caso de cancelamento com <strong className="font-semibold">48 horas</strong> de antecedência.
        </p>
        <ul className="mt-4 space-y-1 text-muted">
          <li>— Apenas 1 acompanhante mulher</li>
          <li>— Pagamento em estúdio após a maquilhagem</li>
          <li>— Taxa de atraso: 500$ após 15 minutos</li>
        </ul>
        <label className="mt-6 flex cursor-pointer items-start gap-3 font-medium">
          <input type="checkbox" required checked={aceito} onChange={(e) => setAceito(e.target.checked)} className="mt-1 size-4 accent-[var(--accent)]" />
          Li e aceito as condições, incluindo a taxa de marcação de {formatPreco(TAXA_MARCACAO)}.
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" className="btn" disabled={aEnviar}>
          {aEnviar ? "A enviar…" : "Confirmar agendamento"} <span aria-hidden="true">→</span>
        </button>
        {servico && hora && (
          <p className="text-muted">
            {servico} · {data.split("-").reverse().join("/")} · {hora}
          </p>
        )}
      </div>

      {msg && <p role="status" className={`msg msg-${msg.tipo} -mt-8`}>{msg.texto}</p>}
    </form>
  );
}
