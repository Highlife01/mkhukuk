import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQaTmDBeyKO4DhRS-JZG4cOvd6eO-YnmQ",
  authDomain: "ajansonline.firebaseapp.com",
  projectId: "ajansonline",
  storageBucket: "ajansonline.firebasestorage.app",
  messagingSenderId: "830656152273",
  appId: "1:830656152273:web:1ab81912c1655c6622fbf0",
  measurementId: "G-V297C335WH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
