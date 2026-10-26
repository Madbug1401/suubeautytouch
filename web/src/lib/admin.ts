// admin.ts — utilitários do painel (só browser).
import { doc, getDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase/client";

/** Admin = utilizador autenticado com documento em Firestore /admins/{uid}. */
export async function isAdmin(user: User | null) {
  if (!user) return false;
  try {
    return (await getDoc(doc(db, "admins", user.uid))).exists();
  } catch {
    return false;
  }
}

export function fileExt(file: File) {
  return (file.name.split(".").pop() || "bin").toLowerCase();
}
