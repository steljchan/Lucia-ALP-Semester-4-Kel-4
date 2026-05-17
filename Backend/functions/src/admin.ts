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
      hearts: 3,
      profilePicture: "https://via.placeholder.com/150",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {success: true, uid: userRecord.uid};
  } catch (error: any) {
    throw new HttpsError("internal", error.message);
  }
});
