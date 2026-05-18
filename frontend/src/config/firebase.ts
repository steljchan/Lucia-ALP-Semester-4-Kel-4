import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);