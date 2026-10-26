// admin/login.js — login com email e palavra-passe (Firebase Auth).
import { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "../firebase.js";
import { isAdmin } from "./auth.js";
import { setMsg } from "../lib/dom.js";

const form = document.getElementById("admin-login-form");
const email = document.getElementById("admin-email");
const password = document.getElementById("admin-password");
const msg = document.getElementById("msg");
const btn = form.querySelector('button[type="submit"]');

// Já autenticada como admin → entra direto.
const stop = onAuthStateChanged(auth, async (user) => {
  stop();
  if (await isAdmin(user)) location.replace("index.html");
});

const ERROS = {
  "auth/invalid-credential": "Email ou palavra-passe incorretos.",
  "auth/invalid-email": "Email inválido.",
  "auth/too-many-requests": "Demasiadas tentativas. Tente novamente mais tarde.",
  "auth/network-request-failed": "Sem ligação à internet.",
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  btn.disabled = true;
  setMsg(msg, "A entrar...", "loading");
  try {
    const { user } = await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
    if (!(await isAdmin(user))) {
      await signOut(auth);
      setMsg(msg, "Esta conta não tem acesso ao painel.", "error");
      return;
    }
    location.replace("index.html");
  } catch (err) {
    console.error(err);
    setMsg(msg, ERROS[err.code] || "Não foi possível entrar.", "error");
  } finally {
    btn.disabled = false;
  }
});

document.getElementById("forgot-password").addEventListener("click", async () => {
  if (!email.value.trim()) {
    setMsg(msg, "Escreva o seu email e clique de novo em «Esqueci a palavra-passe».", "error");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email.value.trim());
  } catch (err) {
    console.error(err);
  }
  // Mensagem neutra (não revela se o email existe).
  setMsg(msg, "Se o email estiver registado, receberá um link para definir nova palavra-passe.", "success");
});
