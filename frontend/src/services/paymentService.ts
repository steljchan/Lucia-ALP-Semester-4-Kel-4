import {
  httpsCallable
} from "firebase/functions";

import app, {
  // functions,
  auth
} from "@/src/config/firebase";

import { getFunctions } from "firebase/functions";
// Pastikan regionnya SAMA dengan yang di backend (us-central1)
export const functions = getFunctions(app, "us-central1");

export const purchaseItem = async (itemId: string, paymentMethod: string) => {
  const user = auth.currentUser;
  
  // LOG BARU: Kita cek di sini
  console.log("DEBUG: Current User UID:", user?.uid);
  console.log("DEBUG: Functions Region:", functions.region);

  if (!user) {
    throw new Error("User belum login di Firebase!");
  }

  try {
    const callable = httpsCallable(functions, "purchaseItem");
    const result = await callable({ itemId, paymentMethod });
    return result.data;
  } catch (error: any) {
    // Lihat detail error secara utuh
    console.log("FULL ERROR DETAILS:", JSON.stringify(error, null, 2));
    throw error;
  }
};