// admin/imagens.js — imagens das categorias de serviço (uma imagem por categoria).
import {
  db, storage, collection, doc, getDocs, setDoc, updateDoc, deleteDoc,
  ref, uploadBytes, getDownloadURL, deleteObject,
} from "../firebase.js";
import { CATEGORIAS, nomeCategoria } from "../config.js";
import { esc, setMsg, fillSelect } from "../lib/dom.js";
import { requireAdmin } from "./auth.js";

const form = document.getElementById("upload-imagem-form");
const selectCategoria = document.getElementById("categoria-imagem");
const inputFile = document.getElementById("imagem-site");
const lista = document.getElementById("imagens-list");
const mensagem = document.getElementById("imagens-mensagem");

fillSelect(selectCategoria, CATEGORIAS, { placeholder: "Selecione" });

async function load() {
  lista.innerHTML = '<p class="loading">A carregar imagens...</p>';
  try {
    const snapshot = await getDocs(collection(db, "imagens"));
    lista.innerHTML = "";
    const docs = snapshot.docs.filter((d) => d.data().url);
    if (!docs.length) {
      lista.innerHTML = '<p class="empty">Nenhuma imagem cadastrada ainda.</p>';
      return;
    }
    docs.forEach((d) => lista.appendChild(card(d.id, d.data())));
  } catch (err) {
    console.error("Erro ao carregar imagens do site:", err);
    lista.innerHTML = '<p class="error">Erro ao carregar imagens.</p>';
  }
}

function card(id, data) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <img src="${esc(data.url)}" alt="${esc(nomeCategoria(data.categoria))}" class="card-thumb">
    <div class="card-content">
      <h3>${esc(nomeCategoria(data.categoria))}</h3>
      <p>Status: ${data.ativo ? "Ativa" : "Inativa"}</p>
      <button class="btn toggle" type="button">${data.ativo ? "Desativar" : "Ativar"}</button>
      <button class="btn excluir" type="button">Excluir</button>
    </div>`;

  el.querySelector(".toggle").addEventListener("click", async () => {
    try {
      await updateDoc(doc(db, "imagens", id), { ativo: !data.ativo });
      load();
    } catch (err) {
      console.error(err);
      setMsg(mensagem, "Erro ao atualizar status.", "error");
    }
  });

  el.querySelector(".excluir").addEventListener("click", async () => {
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;
    try {
      if (data.storagePath) await deleteObject(ref(storage, data.storagePath));
      await deleteDoc(doc(db, "imagens", id));
      setMsg(mensagem, "Imagem excluída com sucesso!", "success");
      load();
    } catch (err) {
      console.error(err);
      setMsg(mensagem, "Erro ao excluir imagem.", "error");
    }
  });
  return el;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const categoria = selectCategoria.value;
  const file = inputFile.files[0];
  if (!categoria || !file) {
    setMsg(mensagem, "Selecione categoria e imagem.", "error");
    return;
  }

  setMsg(mensagem, "A enviar imagem...", "loading");
  try {
    const ext = file.name.split(".").pop().toLowerCase();
    const storagePath = `imagens/${categoria}.${ext}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file, { contentType: file.type });
    const url = await getDownloadURL(storageRef);

    await setDoc(doc(db, "imagens", categoria), {
      categoria, url, storagePath, ativo: true, updatedAt: new Date(),
    }, { merge: true });

    setMsg(mensagem, "Imagem atualizada com sucesso!", "success");
    form.reset();
    load();
  } catch (err) {
    console.error("Erro no upload de imagem do site:", err);
    setMsg(mensagem, `Erro ao enviar imagem: ${err.message}`, "error");
  }
});

requireAdmin().then(load);
