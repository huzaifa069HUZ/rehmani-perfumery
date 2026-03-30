import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbU2Y2ZqcgC-LVhmfDUW8X-7DnYOVRJg8",
  authDomain: "rahmani-perfumery.firebaseapp.com",
  projectId: "rahmani-perfumery",
  storageBucket: "rahmani-perfumery.firebasestorage.app",
  messagingSenderId: "483215314455",
  appId: "1:483215314455:web:3ca320c063f5abbec75652",
  measurementId: "G-9JEBNP83ER"
};

// Initialize Firebase (safeguard for Next.js hot reloading)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
