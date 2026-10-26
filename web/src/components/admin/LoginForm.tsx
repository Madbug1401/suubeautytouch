"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { isAdmin } from "@/lib/admin";
import { Message, type Msg } from "@/components/ui/Message";

const ERROS: Record<string, string> = {
  "auth/invalid-credential": "Email ou palavra-passe incorretos.",
  "auth/invalid-email": "Email inválido.",
  "auth/too-many-requests": "Demasiadas tentativas. Tente novamente mais tarde.",
  "auth/network-request-failed": "Sem ligação à internet.",
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  // Já autenticada como admin → entra direto.
  useEffect(() => {
    return onAuthStateChanged(getClientAuth(), async (user) => {
      if (await isAdmin(user)) router.replace("/admin");
    });
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg({ tipo: "info", texto: "A entrar..." });
    const auth = getClientAuth();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!(await isAdmin(user))) {
        await signOut(auth);
        setMsg({ tipo: "error", texto: "Esta conta não tem acesso ao painel." });
      }
      // se for admin, o onAuthStateChanged acima redireciona
    } catch (err) {
      console.error(err);
      const code = err instanceof FirebaseError ? err.code : "";
      setMsg({ tipo: "error", texto: ERROS[code] ?? "Não foi possível entrar." });
    } finally {
      setLoading(false);
    }
  }

  async function forgot() {
    if (!email.trim()) {
      setMsg({ tipo: "error", texto: "Escreva o seu email e clique de novo em «Esqueci a palavra-passe»." });
      return;
    }
    try {
      await sendPasswordResetEmail(getClientAuth(), email.trim());
    } catch (err) {
      console.error(err);
    }
    // Mensagem neutra (não revela se o email existe).
    setMsg({ tipo: "success", texto: "Se o email estiver registado, receberá um link para definir nova palavra-passe." });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 text-left">
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" type="email" className="field" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password" className="label">Palavra-passe</label>
        <input id="password" type="password" className="field" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="btn" disabled={loading}>Entrar</button>
      <button type="button" onClick={forgot} className="justify-self-center text-sm text-muted underline">
        Esqueci a palavra-passe
      </button>
      <Message msg={msg} />
    </form>
  );
}
