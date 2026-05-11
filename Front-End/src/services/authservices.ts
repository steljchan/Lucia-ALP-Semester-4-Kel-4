// Front-End/src/services/authservice.ts
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const login = (email: any, password: any) => {
  return signInWithEmailAndPassword(auth, email, password);
};