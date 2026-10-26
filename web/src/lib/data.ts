// data.ts — leituras públicas feitas no servidor (Server Components).
// Se o Firestore não responder (ex.: durante o build), devolve listas vazias e o site usa as imagens locais.
import "server-only";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase/client";
import { IMAGEM_PADRAO, type CategoriaId } from "./config";
import { toMillis, type PortfolioItem } from "./types";

export async function getImagensSite(): Promise<Record<CategoriaId, string>> {
  const out = { ...IMAGEM_PADRAO };
  try {
    const snap = await getDocs(query(collection(db, "imagens"), where("ativo", "==", true)));
    snap.forEach((d) => {
      const { categoria, url } = d.data() as { categoria: CategoriaId; url?: string };
      if (categoria in out && url) out[categoria] = url;
    });
  } catch (err) {
    console.error("getImagensSite:", err);
  }
  return out;
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  try {
    const snap = await getDocs(collection(db, "portfolio"));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as PortfolioItem)
      .filter((i) => i.ativo !== false && i.url)
      .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
      .map(({ createdAt, ...rest }) => ({ ...rest, createdAt: null })); // serializável para Client Components
  } catch (err) {
    console.error("getPortfolio:", err);
    return [];
  }
}
