import {
  httpsCallable
} from "firebase/functions";

import {
  functions,
  auth
} from "@/src/config/firebase";

export const purchaseItem = async (itemId: string, paymentMethod: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User belum login. Silakan login kembali.");
  }

  // Refresh token dan cek validitas
  await user.getIdToken(true);
  const token = await user.getIdToken();
  console.log("Token valid, panjang:", token.length); // Hanya untuk debugging

  try {
    const callable = httpsCallable(functions, "purchaseItem");
    const result = await callable({ itemId, paymentMethod });
    return result.data;
  } catch (error: any) {
    console.log("PURCHASE ERROR DETAIL:", error.code, error.message);
    throw new Error(error.message || "Pembelian gagal");
  }
};