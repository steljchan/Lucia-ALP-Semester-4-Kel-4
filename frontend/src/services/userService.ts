import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/src/config/firebase";
import { User } from "@/src/types/user";
import { refreshHeart } from "./heartRegen";

export const getCurrentUserData = async (): Promise<User> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User belum login");
  }

  // 🔄 Regenerasi heart sebelum mengambil data
  await refreshHeart();

  const userRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("Data user tidak ditemukan");
  }

  return userSnap.data() as User;
};