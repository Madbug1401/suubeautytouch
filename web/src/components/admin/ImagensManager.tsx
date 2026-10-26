"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import { CATEGORIAS, nomeCategoria, type CategoriaId } from "@/lib/config";
import { fileExt } from "@/lib/admin";
import type { ImagemSite } from "@/lib/types";
import { Message, type Msg } from "@/components/ui/Message";

/** Uma imagem por categoria de serviço (usada na home e na página de serviços). */
export function ImagensManager() {
  const [lista, setLista] = useState<ImagemSite[] | null>(null);
  const [categoria, setCategoria] = useState<CategoriaId | "">("");
  const [aEnviar, setAEnviar] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, "imagens"));
      setLista(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ImagemSite).filter((i) => i.url));
    } catch (err) {
      console.error(err);
      setLista([]);
      setMsg({ tipo: "error", texto: "Erro ao carregar imagens." });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!categoria || !file) return setMsg({ tipo: "error", texto: "Selecione categoria e imagem." });

    setAEnviar(true);
    setMsg({ tipo: "info", texto: "A enviar imagem..." });
    try {
      const storagePath = `imagens/${categoria}.${fileExt(file)}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const url = await getDownloadURL(storageRef);
      await setDoc(doc(db, "imagens", categoria), { categoria, url, storagePath, ativo: true, updatedAt: new Date() }, { merge: true });
      setMsg({ tipo: "success", texto: "Imagem atualizada! Aparece no site em até 1 minuto." });
      setCategoria("");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "error", texto: `Erro ao enviar imagem: ${(err as Error).message}` });
    } finally {
      setAEnviar(false);
    }
  }

  async function alternar(img: ImagemSite) {
    try {
      await updateDoc(doc(db, "imagens", img.id), { ativo: !img.ativo });
      load();
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "error", texto: "Erro ao atualizar status." });
    }
  }

  async function excluir(img: ImagemSite) {
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;
    try {
      if (img.storagePath) await deleteObject(ref(storage, img.storagePath));
      await deleteDoc(doc(db, "imagens", img.id));
      setMsg({ tipo: "success", texto: "Imagem excluída com sucesso!" });
      load();
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "error", texto: "Erro ao excluir imagem." });
    }
  }

  return (
    <section>
      <h1>Imagens do Site</h1>

      <form onSubmit={enviar} className="mb-6 grid items-end gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="categoria" className="label">Categoria</label>
          <select id="categoria" className="field" required value={categoria} onChange={(e) => setCategoria(e.target.value as CategoriaId)}>
            <option value="">Selecione</option>
            {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="imagem" className="label">Imagem</label>
          <input id="imagem" ref={fileRef} type="file" accept="image/*" required className="field" />
        </div>
        <button type="submit" className="btn btn-success" disabled={aEnviar}>{aEnviar ? "A enviar..." : "Enviar Imagem"}</button>
      </form>

      <Message msg={msg} />

      {lista === null ? (
        <p className="text-center text-muted">A carregar imagens...</p>
      ) : !lista.length ? (
        <p className="text-center text-muted">Nenhuma imagem cadastrada ainda.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lista.map((img) => (
            <div key={img.id} className="card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={nomeCategoria(img.categoria)} className="h-48 w-full object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-lg text-pink-main">{nomeCategoria(img.categoria)}</h3>
                <p className="mb-3 text-sm text-muted">Status: {img.ativo ? "Ativa" : "Inativa"}</p>
                <div className="flex justify-center gap-2">
                  <button type="button" className="btn btn-sm" onClick={() => alternar(img)}>{img.ativo ? "Desativar" : "Ativar"}</button>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => excluir(img)}>Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
