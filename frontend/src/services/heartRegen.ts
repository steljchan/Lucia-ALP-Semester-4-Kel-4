import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/src/config/firebase';

const REGEN_INTERVAL_MINUTES = 30; // 30 menit
const MAX_HEART = 3;

/**
 * Hitung dan update heart berdasarkan lastHeartRegen
 * @returns heart terbaru
 */
export const refreshHeart = async (): Promise<number> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');

  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) throw new Error('User data not found');

  const data = snap.data();
  let currentHeart = data.heart ?? 0;
  let lastRegen = data.lastHeartRegen?.toDate?.();

  // Jika lastHeartRegen belum ada (user lama), gunakan createdAt atau set ke now
  if (!lastRegen) {
    const createdAt = data.createdAt?.toDate?.();
    if (createdAt) {
      lastRegen = createdAt;
      // Simpan lastHeartRegen untuk pertama kali
      await updateDoc(userRef, { lastHeartRegen: lastRegen });
    } else {
      // Jika tidak ada createdAt (sangat unlikely), set ke now dan jangan tambah heart
      await updateDoc(userRef, { lastHeartRegen: new Date() });
      return currentHeart;
    }
  }

  const now = new Date();
  const diffMinutes = (now.getTime() - lastRegen.getTime()) / (1000 * 60);
  const increments = Math.floor(diffMinutes / REGEN_INTERVAL_MINUTES);

  if (increments > 0 && currentHeart < MAX_HEART) {
    let newHeart = Math.min(currentHeart + increments, MAX_HEART);
    const newLastRegen = new Date(lastRegen.getTime() + increments * REGEN_INTERVAL_MINUTES * 60000);
    
    await updateDoc(userRef, {
      heart: newHeart,
      lastHeartRegen: newLastRegen,
    });
    return newHeart;
  }
  
  return currentHeart;
};

/**
 * Kurangi heart (panggil saat jawab salah)
 * Sebelum mengurangi, refresh dulu biar regenerasi terhitung
 */
export const decrementHeart = async (): Promise<number> => {
  // Refresh dulu biar kalau ada regenerasi terhitung
  await refreshHeart();
  
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  const currentHeart = snap.data()?.heart ?? 0;
  
  if (currentHeart <= 0) throw new Error('Heart habis!');
  
  const newHeart = currentHeart - 1;
  await updateDoc(userRef, { heart: newHeart });
  return newHeart;
};

/**
 * Ambil sisa waktu (dalam detik) hingga heart berikutnya bertambah
 * (untuk tampilan countdown)
 */
export const getNextHeartSeconds = async (): Promise<number> => {
  const uid = auth.currentUser?.uid;
  if (!uid) return 0;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return 0;
  const data = snap.data();
  let lastRegen = data.lastHeartRegen?.toDate?.();
  if (!lastRegen) {
    // Jika belum ada, gunakan createdAt atau return 0
    lastRegen = data.createdAt?.toDate?.();
    if (!lastRegen) return 0;
  }
  const now = new Date();
  const diff = now.getTime() - lastRegen.getTime();
  const intervalMs = REGEN_INTERVAL_MINUTES * 60000;
  const remaining = intervalMs - (diff % intervalMs);
  // Jika remaining mendekati intervalMs (karena diff negatif?), handle edge case
  if (remaining >= intervalMs) return 0;
  return Math.floor(remaining / 1000);
};