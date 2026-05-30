import { initializeApp, getApps, getApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  apiKey: "AIzaSyDZTLeHhEnoJmx40LTzgaMeQtR0wbiYGQA",
  authDomain: "lucia-4b190.firebaseapp.com",
  projectId: "lucia-4b190",
  storageBucket: "lucia-4b190.firebasestorage.app", 
  messagingSenderId: "172224433843",
  appId: "1:172224433843:web:90d6b38565e4cfd3766ac6",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let firebaseAuth;
try {
  firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
 
  const { getAuth } = require("firebase/auth");
  firebaseAuth = getAuth(app);
}

export const auth = firebaseAuth;
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-central1");

export default app;