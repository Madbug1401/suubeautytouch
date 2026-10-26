// admin/portfolio.js — galeria (imagens e vídeos) por álbum.
import {
  db, storage, collection, doc, query, orderBy, getDocs, addDoc, deleteDoc,
  ref, uploadBytes, getDownloadURL, deleteObject,
} from "../firebase.js";
import { CATEGORIAS, nomeCategoria } from "../config.js";
import { esc, setMsg, fillSelect } from "../lib/dom.js";
import { requireAdmin } from "./auth.js";

const form = document.getElementById("upload-portfolio-form");
const selectAlbum = document.getElementById("album-portfolio");
const selectTipo = document.getElementById("tipo-media");
const inputFile = document.getElementById("media-portfolio");
const lista = document.getElementById("portfolio-list");
const mensagem = document.getElementById("portfolio-mensagem");

fillSelect(selectAlbum, CATEGORIAS, { placeholder: "Selecione" });

// Deteta automaticamente o tipo quando se escolhe o ficheiro.
inputFile.addEventListener("change", () => {
  const f = inputFile.files[0];
  if (f) selectTipo.value = f.type.startsWith("video/") ? "video" : "imagem";
});

async function load() {
  lista.innerHTML = '<p class="loading">A carregar portfólio...</p>';
  try {
    const snapshot = await getDocs(query(collection(db, "portfolio"), orderBy("createdAt", "desc")));
    lista.innerHTML = "";
    if (snapshot.empty) {
      lista.innerHTML = '<p class="empty">Nenhum item no portfólio ainda.</p>';
      return;
    }
    snapshot.forEach((d) => lista.appendChild(card(d.id, d.data())));
  } catch (err) {
    console.error("Erro ao carregar portfólio:", err);
    lista.innerHTML = '<p class="error">Erro ao carregar portfólio.</p>';
  }
}

function card(id, data) {
  const el = document.createElement("div");
  el.className = "card";
  const preview = data.tipo === "video"
    ? `<video src="${esc(data.url)}" controls muted loop class="card-thumb"></video>`
    : `<img src="${esc(data.url)}" alt="${esc(nomeCategoria(data.album))}" class="card-thumb">`;
  el.innerHTML = `
    ${preview}
    <div class="card-content">
      <h3>${esc(nomeCategoria(data.album))} (${esc(data.tipo)})</h3>
      <button class="btn excluir" type="button">Excluir</button>
    </div>`;

  el.querySelector(".excluir").addEventListener("click", async () => {
    if (!confirm("Tem certeza que deseja excluir este item do portfólio?")) return;
    try {
      if (data.storagePath) await deleteObject(ref(storage, data.storagePath));
      await deleteDoc(doc(db, "portfolio", id));
      setMsg(mensagem, "Item excluído com sucesso!", "success");
      load();
    } catch (err) {
      console.error(err);
      setMsg(mensagem, "Erro ao excluir item.", "error");
    }
  });
  return el;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const album = selectAlbum.value;
  const tipo = selectTipo.value;
  const file = inputFile.files[0];
  if (!album || !tipo || !file) {
    setMsg(mensagem, "Preencha todos os campos.", "error");
    return;
  }

  setMsg(mensagem, tipo === "video" ? "A enviar vídeo..." : "A enviar imagem...", "loading");
  try {
    const ext = file.name.split(".").pop().toLowerCase();
    const storagePath = `portfolio/${album}/${Date.now()}.${ext}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file, { contentType: file.type });
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "portfolio"), {
      album, tipo, url, storagePath, ativo: true, createdAt: new Date(),
    });

    setMsg(mensagem, `${tipo === "video" ? "Vídeo" : "Imagem"} adicionado com sucesso!`, "success");
    form.reset();
    load();
  } catch (err) {
    console.error("Erro ao adicionar ao portfólio:", err);
    setMsg(mensagem, `Erro ao enviar: ${err.message}`, "error");
  }
});

requireAdmin().then(load);
