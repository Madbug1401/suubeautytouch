"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import { CATEGORIAS, nomeCategoria, type CategoriaId } from "@/lib/config";
import { fileExt } from "@/lib/admin";
import type { PortfolioItem } from "@/lib/types";
import { Message, type Msg } from "@/components/ui/Message";

type Tipo = PortfolioItem["tipo"];

export function PortfolioManager() {
  const [lista, setLista] = useState<PortfolioItem[] | null>(null);
  const [album, setAlbum] = useState<CategoriaId | "">("");
  const [tipo, setTipo] = useState<Tipo | "">("");
  const [aEnviar, setAEnviar] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const snap = await getDocs(query(collection(db, "portfolio"), orderBy("createdAt", "desc")));
      setLista(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PortfolioItem));
    } catch (err) {
      console.error(err);
      setLista([]);
      setMsg({ tipo: "error", texto: "Erro ao carregar portfólio." });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!album || !tipo || !file) return setMsg({ tipo: "error", texto: "Preencha todos os campos." });

    setAEnviar(true);
    setMsg({ tipo: "info", texto: tipo === "video" ? "A enviar vídeo..." : "A enviar imagem..." });
    try {
      const storagePath = `portfolio/${album}/${Date.now()}.${fileExt(file)}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "portfolio"), { album, tipo, url, storagePath, ativo: true, createdAt: new Date() });
      setMsg({ tipo: "success", texto: `${tipo === "video" ? "Vídeo" : "Imagem"} adicionado! Aparece no site em até 1 minuto.` });
      setAlbum(""); setTipo("");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "error", texto: `Erro ao enviar: ${(err as Error).message}` });
    } finally {
      setAEnviar(false);
    }
  }

  async function excluir(item: PortfolioItem) {
    if (!confirm("Tem certeza que deseja excluir este item do portfólio?")) return;
    try {
      if (item.storagePath) await deleteObject(ref(storage, item.storagePath));
      await deleteDoc(doc(db, "portfolio", item.id));
      setMsg({ tipo: "success", texto: "Item excluído com sucesso!" });
      load();
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "error", texto: "Erro ao excluir item." });
    }
  }

  return (
    <section>
      <h1>Portfólio (Galeria)</h1>

      <form onSubmit={enviar} className="mb-6 grid items-end gap-6 md:grid-cols-4">
        <div>
          <label htmlFor="album" className="label">Álbum</label>
          <select id="album" className="field" required value={album} onChange={(e) => setAlbum(e.target.value as CategoriaId)}>
            <option value="">Selecione</option>
            {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tipo" className="label">Tipo</label>
          <select id="tipo" className="field" required value={tipo} onChange={(e) => setTipo(e.target.value as Tipo)}>
            <option value="">Selecione</option>
            <option value="imagem">Imagem</option>
            <option value="video">Vídeo</option>
          </select>
        </div>
        <div>
          <label htmlFor="ficheiro" className="label">Ficheiro</label>
          <input
            id="ficheiro" ref={fileRef} type="file" accept="image/*,video/*" required className="field"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setTipo(f.type.startsWith("video/") ? "video" : "imagem");
            }}
          />
        </div>
        <button type="submit" className="btn btn-success" disabled={aEnviar}>{aEnviar ? "A enviar..." : "Enviar"}</button>
      </form>

      <Message msg={msg} />

      {lista === null ? (
        <p className="text-center text-muted">A carregar portfólio...</p>
      ) : !lista.length ? (
        <p className="text-center text-muted">Nenhum item no portfólio ainda.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lista.map((item) => (
            <div key={item.id} className="card">
              {item.tipo === "video" ? (
                <video src={item.url} controls muted loop className="h-48 w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={nomeCategoria(item.album)} className="h-48 w-full object-cover" />
              )}
              <div className="p-4 text-center">
                <h3 className="mb-3 text-lg text-pink-main">{nomeCategoria(item.album)} ({item.tipo})</h3>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => excluir(item)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
