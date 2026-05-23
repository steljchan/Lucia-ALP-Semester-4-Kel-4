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
      heart: 3,
      purchasedLimitedBundle: false,
      profilePicture: "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {success: true, uid: userRecord.uid};
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});
