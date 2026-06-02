import {httpsCallable} from "firebase/functions";
import app, {auth} from "@/src/config/firebase";
import {getFunctions} from "firebase/functions";

export const functions = getFunctions(app, "us-central1");
export const purchaseItem = async (itemId: string, paymentMethod: string) => {
  const user = auth.currentUser;

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

    console.log("FULL ERROR DETAILS:", JSON.stringify(error, null, 2));
    throw error;
  }
};