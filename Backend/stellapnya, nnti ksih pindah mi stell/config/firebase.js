import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZTLeHhEnoJmx40LTzgaMeQtR0wbiYGQA",
  authDomain: "lucia-4b190.firebaseapp.com",
  projectId: "lucia-4b190",
  storageBucket: "lucia-4b190.firebasestorage.app",
  messagingSenderId: "172224433843",
  appId: "1:172224433843:web:90d6b38565e4cfd3766ac6",
  measurementId: "G-WRPVST3DSR"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);