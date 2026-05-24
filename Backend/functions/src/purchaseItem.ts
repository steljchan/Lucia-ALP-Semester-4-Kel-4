import {
  onCall,
  HttpsError,
} from "firebase-functions/v2/https";

import * as admin from "firebase-admin";

const db = admin.firestore();

export const purchaseItem = onCall(
  {
    region: "us-central1",
  },

  async (request) => {

    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User belum login"
      );
    }

    const uid = request.auth.uid;

    const {
      itemId,
      paymentMethod,
    } = request.data;

    if (!itemId) {
      throw new HttpsError(
        "invalid-argument",
        "Item ID wajib"
      );
    }

    try {

      const itemRef = db
        .collection("shop")
        .doc(itemId);

      const userRef = db
        .collection("users")
        .doc(uid);

      const orderId =
        `ORD-${Date.now()}`;

      let subtotal = 0;
      let tax = 0;
      let total = 0;

      await db.runTransaction(
        async (transaction) => {

          const itemSnap =
            await transaction.get(itemRef);

          if (!itemSnap.exists) {
            throw new HttpsError(
              "not-found",
              "Item tidak ditemukan"
            );
          }

          const item = itemSnap.data();

          if (!item?.active) {
            throw new HttpsError(
              "failed-precondition",
              "Item tidak aktif"
            );
          }

          const userSnap =
            await transaction.get(userRef);

          if (!userSnap.exists) {
            throw new HttpsError(
              "not-found",
              "User tidak ditemukan"
            );
          }

          if (item.limited) {

            const limitedRef = db
              .collection("limitedPurchases")
              .doc(`${uid}_${itemId}`);

            const limitedSnap =
              await transaction.get(limitedRef);

            if (limitedSnap.exists) {
              throw new HttpsError(
                "already-exists",
                "Paket sudah dibeli"
              );
            }

            transaction.set(limitedRef, {
              uid,
              itemId,
              createdAt:
                admin.firestore.FieldValue.serverTimestamp(),
            });
          }

          subtotal = item.price || 0;

          tax = subtotal * 0.1;

          total = subtotal + tax;

          transaction.update(userRef, {

            coin:
              admin.firestore.FieldValue.increment(
                item.coin || 0
              ),

            heart:
              admin.firestore.FieldValue.increment(
                item.heart || 0
              ),
          });

          const trxRef = db
            .collection("transactions")
            .doc();

          transaction.set(trxRef, {

            orderId,

            uid,

            itemId,

            itemName:
              item.name,

            coin:
              item.coin || 0,

            heart:
              item.heart || 0,

            subtotal,

            tax,

            total,

            paymentMethod:
              paymentMethod || "Unknown",

            status: "paid",

            granted: true,

            createdAt:
              admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      );

      return {
        success: true,
        orderId,
        subtotal,
        tax,
        total,
      };

    } catch (error: any) {

      console.log(error);

      throw new HttpsError(
        "internal",
        error.message
      );
    }
  }
);