import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//Adicione as configurações do firestore aqui :)
const firebaseConfig = {
  apiKey: "AIzaSyCxBT9s6aTY86nQW_Xuz4ubRZdKfMDh49Y",
  authDomain: "next-level-d6f1f.firebaseapp.com",
  projectId: "next-level-d6f1f",
  storageBucket: "next-level-d6f1f.firebasestorage.app",
  messagingSenderId: "953763122159",
  appId: "1:953763122159:web:97bcb1ed1e3d2267ca441a",
  measurementId: "G-LXKDYF64ZB"
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const db = getFirestore(app);
