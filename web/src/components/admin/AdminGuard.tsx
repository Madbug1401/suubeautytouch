"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { isAdmin } from "@/lib/admin";

/** Só mostra o conteúdo a admins autenticados; caso contrário redireciona para o login. */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const auth = getClientAuth();
    return onAuthStateChanged(auth, async (user) => {
      if (await isAdmin(user)) {
        setOk(true);
      } else {
        setOk(false);
        if (user) await signOut(auth);
        router.replace("/admin/login");
      }
    });
  }, [router]);

  if (!ok) return <p className="p-10 text-center text-muted">A verificar acesso...</p>;
  return <>{children}</>;
}
