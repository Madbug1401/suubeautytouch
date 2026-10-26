// admin/auth.js — autenticação do painel (Firebase Auth).
// Admin = utilizador autenticado com documento em Firestore /admins/{uid}.
import { auth, db, doc, getDoc, onAuthStateChanged, signOut } from "../firebase.js";

export async function isAdmin(user) {
  if (!user) return false;
  try {
    return (await getDoc(doc(db, "admins", user.uid))).exists();
  } catch {
    return false;
  }
}

// Espera pelo estado de login. Resolve com o utilizador admin ou redireciona para o login.
// Enquanto não resolve, o conteúdo da página fica escondido (CSS: body[data-protected]:not(.auth-ok)).
// Lazy (só corre quando chamada) para não afetar a própria página de login.
let pending = null;
export function requireAdmin() {
  pending ??= new Promise((resolve) => {
    const stop = onAuthStateChanged(auth, async (user) => {
      stop();
      if (await isAdmin(user)) {
        document.body.classList.add("auth-ok");
        resolve(user);
      } else {
        if (user) await signOut(auth);
        location.replace("login.html");
      }
    });
  });
  return pending;
}

export async function logout() {
  await signOut(auth);
  location.replace("login.html");
}
