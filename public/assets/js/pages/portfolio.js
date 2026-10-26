// pages/portfolio.js — galerias por álbum + modal de visualização.
import { db, collection, query, where, getDocs } from "../firebase.js";

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

function openModal(src, isVideo) {
  modalContent.innerHTML = "";
  const el = document.createElement(isVideo ? "video" : "img");
  el.src = src;
  el.className = "modal-media";
  if (isVideo) Object.assign(el, { controls: true, autoplay: true, loop: true, muted: true });
  else el.alt = "Visualização ampliada";
  modalContent.appendChild(el);
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
  modalContent.innerHTML = "";
}

modal.querySelector(".close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

function toMillis(v) {
  if (!v) return 0;
  if (typeof v.toMillis === "function") return v.toMillis();
  return new Date(v).getTime() || 0;
}

async function loadAlbum(gallery) {
  const album = gallery.dataset.album;
  gallery.innerHTML = "<p class='loading'>A carregar...</p>";

  try {
    // Filtro só por álbum (não exige índice composto); "ativo" e ordem tratados no cliente.
    const snapshot = await getDocs(query(collection(db, "portfolio"), where("album", "==", album)));
    const items = snapshot.docs
      .map((d) => d.data())
      .filter((d) => d.ativo !== false && d.url)
      .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

    gallery.innerHTML = "";
    if (!items.length) {
      gallery.innerHTML = "<p class='empty'>Ainda não há conteúdos neste álbum.</p>";
      return;
    }

    for (const item of items) {
      const isVideo = item.tipo === "video";
      const el = document.createElement(isVideo ? "video" : "img");
      el.src = item.url;
      if (isVideo) Object.assign(el, { muted: true, loop: true, playsInline: true, preload: "metadata" });
      else { el.alt = `${album} - Su Beauty Touch`; el.loading = "lazy"; }
      el.addEventListener("click", () => openModal(item.url, isVideo));
      gallery.appendChild(el);
    }
  } catch (err) {
    console.error(`Erro ao carregar álbum ${album}:`, err);
    gallery.innerHTML = "<p class='error'>Erro ao carregar conteúdos. Tente novamente mais tarde.</p>";
  }
}

document.querySelectorAll(".gallery[data-album]").forEach(loadAlbum);
