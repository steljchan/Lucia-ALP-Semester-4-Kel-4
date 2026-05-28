import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDZTLeHhEnoJmx40LTzgaMeQtR0wbiYGQA",
  authDomain: "lucia-4b190.firebaseapp.com",
  projectId: "lucia-4b190",
  storageBucket: "lucia-4b190.appspot.com",
  messagingSenderId: "172224433843",
  appId: "1:172224433843:web:90d6b38565e4cfd3766ac6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

export const functions = getFunctions(app, "us-central1");

export default app;