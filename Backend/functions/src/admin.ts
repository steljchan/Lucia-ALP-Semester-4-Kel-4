import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

export const adminCreateUser = onCall(async (request) => {
  const {name, email, password, role, nis, kelas, tingkat} = request.data;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role,
      NIS: nis || "-",
      kelas: kelas || "-",
      tinkat: tingkat || "-",
      xp: 0,
      coin: 0,
      lastHeartRegen: admin.firestore.FieldValue.serverTimestamp(),
      heart: 3,
      purchasedLimitedBundle: false,
      profilePicture: "https://firebasestorage.googleapis.com/v0/b/lucia-4b190.firebasestorage.app/o/profilePictures%2Fpfp%20icon.jpeg?alt=media&token=9b9255dc-d61e-4b5b-b5cf-43ae9b786fa4",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {success: true, uid: userRecord.uid};
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});
