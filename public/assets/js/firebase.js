// firebase.js — único ponto de entrada do SDK Firebase.
// Para atualizar a versão do SDK, muda só as URLs abaixo (todas iguais).

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// A config do Firebase é pública por natureza; a segurança está nas Security Rules
// (firestore.rules e storage.rules na raiz do projeto).
const firebaseConfig = {
  apiKey: "AIzaSyA1IA85I5GNcsIu9Jn6LkFmbuvtkof404s",
  authDomain: "su-beauty-touch.firebaseapp.com",
  projectId: "su-beauty-touch",
  storageBucket: "su-beauty-touch.firebasestorage.app",
  messagingSenderId: "526466825470",
  appId: "1:526466825470:web:90a8d04c87640c76a579af",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export {
  collection, doc, query, where, orderBy,
  getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc,
  writeBatch, serverTimestamp, Timestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export {
  ref, uploadBytes, getDownloadURL, deleteObject,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

export {
  onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
