import { onCall } from "firebase-functions/v2/https";

export const hello = onCall(() => {
  return { message: "Backend jalan 🚀" };
});