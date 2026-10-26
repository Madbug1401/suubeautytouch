// lib/site-images.js — substitui as imagens <img data-categoria="..."> pelas
// imagens ativas geridas no admin. Se falhar, ficam as imagens locais (src no HTML).
import { db, collection, getDocs, query, where } from "../firebase.js";

export async function loadSiteImages() {
  try {
    const q = query(collection(db, "imagens"), where("ativo", "==", true));
    const snapshot = await getDocs(q);
    snapshot.forEach((docSnap) => {
      const { categoria, url } = docSnap.data();
      if (!categoria || !url) return;
      document
        .querySelectorAll(`img[data-categoria="${CSS.escape(categoria)}"]`)
        .forEach((img) => { img.src = url; });
    });
  } catch (err) {
    console.error("Erro ao carregar imagens do site:", err);
  }
}
