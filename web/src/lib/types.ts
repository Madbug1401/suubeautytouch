import type { Timestamp } from "firebase/firestore";
import type { CategoriaId, Estado } from "./config";

export type Agendamento = {
  id: string;
  nome: string;
  telefone: string;
  servico: string;
  cilios?: string | null;
  data: string; // AAAA-MM-DD
  hora: string; // HH:MM
  observacoes?: string;
  status: Estado;
  createdAt?: Timestamp | null;
};

export type ImagemSite = {
  id: string;
  categoria: CategoriaId;
  url: string;
  storagePath?: string;
  ativo: boolean;
};

export type PortfolioItem = {
  id: string;
  album: CategoriaId;
  tipo: "imagem" | "video";
  url: string;
  storagePath?: string;
  ativo: boolean;
  createdAt?: Timestamp | Date | null;
};

export function toMillis(v: unknown): number {
  if (!v) return 0;
  if (typeof (v as Timestamp).toMillis === "function") return (v as Timestamp).toMillis();
  return new Date(v as string).getTime() || 0;
}
