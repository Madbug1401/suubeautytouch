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
        if (!livres.length) setMsg({ tipo: "info", texto: "Sem horários disponíveis neste dia." });
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

      setMsg({ tipo: "success", texto: "Agendamento registado! Aguarde contacto 💖" });
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

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-xl gap-4">
      <div>
        <label htmlFor="nome" className="label">Nome completo</label>
        <input id="nome" className="field" autoComplete="name" minLength={2} maxLength={100} required value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>
      <div>
        <label htmlFor="whatsapp" className="label">WhatsApp</label>
        <input id="whatsapp" type="tel" className="field" autoComplete="tel" minLength={7} maxLength={25} required value={telefone} onChange={(e) => setTelefone(e.target.value)} />
      </div>
      <div>
        <label htmlFor="servico" className="label">Serviço</label>
        <select id="servico" className="field" required value={servico} onChange={(e) => setServico(e.target.value)}>
          <option value="">Escolha o serviço</option>
          {SERVICOS.map((s) => (
            <option key={s.id} value={s.nome}>{s.nome} - {formatPreco(s.preco)} ({s.duracao} min)</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="cilios" className="label">Cílios (opcional)</label>
        <select id="cilios" className="field" value={cilios} onChange={(e) => setCilios(e.target.value)}>
          <option value="">Sem cílios extra</option>
          {CILIOS.map((c) => (
            <option key={c.id} value={c.nome}>{c.nome} - {formatPreco(c.preco)}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="data" className="label">Data</label>
          <input id="data" type="date" className="field" min={hoje} required value={data} onChange={(e) => { setMsg(null); setData(e.target.value); }} />
        </div>
        <div>
          <label htmlFor="hora" className="label">Hora</label>
          <select id="hora" className="field" required value={hora} onChange={(e) => setHora(e.target.value)} disabled={!data || !servico || aCarregarHoras}>
            <option value="">{aCarregarHoras ? "A carregar..." : !data || !servico ? "Escolha serviço e data" : "Hora disponível"}</option>
            {horas.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="observacoes" className="label">Observações</label>
        <textarea id="observacoes" className="field min-h-24" maxLength={500} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
      </div>

      <div className="rounded-xl border border-pink-main bg-surface p-4 text-sm">
        <p>
          <strong>Aviso:</strong> Para confirmar a sua presença, é necessário efetuar o pagamento de uma taxa de marcação
          no valor de <strong>{formatPreco(TAXA_MARCACAO)}</strong>. Este valor será reembolsado em caso de cancelamento
          com <strong>48 horas</strong> de antecedência.
        </p>
        <ul className="mt-2 list-inside list-disc">
          <li>Apenas 1 acompanhante mulher</li>
          <li>Pagamento em estúdio após a maquiagem</li>
          <li>Taxa de atraso: 500$ após 15 minutos</li>
        </ul>
        <label className="mt-3 flex items-start gap-2 font-medium">
          <input type="checkbox" required checked={aceito} onChange={(e) => setAceito(e.target.checked)} className="mt-1 accent-pink-deep" />
          Li e aceito as condições, incluindo a taxa de marcação de {formatPreco(TAXA_MARCACAO)}.
        </label>
      </div>

      <button type="submit" className="btn justify-self-center" disabled={aEnviar}>
        {aEnviar ? "A enviar..." : "Confirmar Agendamento"}
      </button>

      {msg && <p role="status" className={`msg msg-${msg.tipo}`}>{msg.texto}</p>}
    </form>
  );
}
