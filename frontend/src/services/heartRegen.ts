import {doc, getDoc, updateDoc, Timestamp} from 'firebase/firestore';
import {auth, db} from '@/src/config/firebase';

const REGEN_INTERVAL_MINUTES = 30;
const MAX_HEART = 3;
const INTERVAL_MS = REGEN_INTERVAL_MINUTES * 60 * 1000;

export const refreshHeart = async (): Promise<number> => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('User not logged in');
  }
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    throw new Error('User not found');
  }

  const data = snap.data();

  let heart = data.heart ?? MAX_HEART;
  let lastHeartRegen = data.lastHeartRegen?.toDate?.() ?? new Date();

  const now = new Date();

  if (heart >= MAX_HEART) {
    await updateDoc(userRef, {
      lastHeartRegen: Timestamp.fromDate(now),
    });
    return heart;
  }

  const diffMs = now.getTime() - lastHeartRegen.getTime();
  const regenerated = Math.floor(diffMs / INTERVAL_MS);

  if (regenerated <= 0) {
    return heart;
  }

  heart = Math.min(heart + regenerated, MAX_HEART);

  const updatedLastRegen = new Date(
    lastHeartRegen.getTime() + regenerated * INTERVAL_MS
  );

  await updateDoc(userRef, {
    heart,
    lastHeartRegen: Timestamp.fromDate(updatedLastRegen),
  });

  return heart;
};

export const decrementHeart = async (): Promise<number> => {
  const currentHeart = await refreshHeart();

  if (currentHeart <= 0) {
    throw new Error('Heart habis!');
  }

  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error('User not logged in');
  }

  const userRef = doc(db, 'users', uid);
  const newHeart = currentHeart - 1;

  const updateData: any = {
    heart: newHeart,
  };

  if (currentHeart === MAX_HEART) {
    updateData.lastHeartRegen = Timestamp.fromDate(new Date());
  }

  await updateDoc(userRef, updateData);

  return newHeart;
};

export const getNextHeartSeconds = async (): Promise<number> => {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    return 0;
  }

  const currentHeart = await refreshHeart();

  if (currentHeart >= MAX_HEART) {
    return 0;
  }

  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    return 0;
  }

  const data = snap.data();
  const lastHeartRegen = data.lastHeartRegen?.toDate?.();

  if (!lastHeartRegen) {
    return 0;
  }

  const now = new Date();
  const elapsed = now.getTime() - lastHeartRegen.getTime();
  const remaining = INTERVAL_MS - (elapsed % INTERVAL_MS);

  return Math.floor(remaining / 1000);
};