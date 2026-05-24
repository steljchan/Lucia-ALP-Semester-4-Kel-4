import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { db, auth } from '@/src/config/firebase';

/**
 * Kurangi heart user sebanyak 1 (untuk jawaban salah)
 * @returns sisa heart setelah dikurangi
 */
export const decrementHeart = async (): Promise<number> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');

  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  const currentHeart = userSnap.data()?.heart ?? 0;

  if (currentHeart <= 0) {
    throw new Error('Heart habis!');
  }

  await updateDoc(userRef, {
    heart: increment(-1),
  });

  return currentHeart - 1;
};

/**
 * Ambil data heart dan coin user saat ini
 */
export const getUserHeartAndCoin = async (): Promise<{ heart: number; coin: number }> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');

  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  const data = userSnap.data();
  return {
    heart: data?.heart ?? 0,
    coin: data?.coin ?? 0,
  };
};