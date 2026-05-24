import {collection, getDocs, doc, getDoc} from "firebase/firestore";
import {db} from "@/src/config/firebase";
import {ShopItem} from "@/src/types/shop";

export const getShopItems =
async (): Promise<ShopItem[]> => {

  const snapshot =
    await getDocs(
      collection(
        db,
        "shop"
      )
    );

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<ShopItem, 'id'>;
    return {
      id: doc.id,
      ...data,
    };
  });
};

export const checkLimitedPurchase =
async (
  uid: string,
  itemId: string
) => {

  const ref = doc(
    db,
    "limitedPurchases",
    `${uid}_${itemId}`
  );

  const snap =
    await getDoc(ref);

  return snap.exists();
};