// firebase/client.ts — inicialização única do Firebase (funciona no browser e no servidor).
// A config é pública por natureza; a segurança está em firestore.rules e storage.rules.
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1IA85I5GNcsIu9Jn6LkFmbuvtkof404s",
  authDomain: "su-beauty-touch.firebaseapp.com",
  projectId: "su-beauty-touch",
  storageBucket: "su-beauty-touch.firebasestorage.app",
  messagingSenderId: "526466825470",
  appId: "1:526466825470:web:90a8d04c87640c76a579af",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

/** Auth só existe no browser. */
export const getClientAuth = () => getAuth(app);
