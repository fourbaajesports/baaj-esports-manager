import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzwpvOt-47jQCLp0Aqs659IgL1TiJN7ug",
  authDomain: "baaj-esports-manager.firebaseapp.com",
  projectId: "baaj-esports-manager",
  storageBucket: "baaj-esports-manager.firebasestorage.app",
  messagingSenderId: "251034094182",
  appId: "1:251034094182:web:64d814128c02a6d5dfbba7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;