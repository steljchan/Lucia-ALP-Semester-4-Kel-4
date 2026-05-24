import {db} from "../config/firebase";
import {doc, setDoc} from "firebase/firestore";

export const createUserData = async (user, data) => {
  await setDoc(doc(db, "users", user.uid), {
    name: data.name,
    role: data.role,

    // student only
    nis: data.nis || null,
    class_id: data.class_id || null,
    class_name: data.class_name || null,
    xp: 0,
    heart: 3,
    coin: 0,
  });
};
