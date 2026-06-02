import {doc, getDoc} from 'firebase/firestore';
import {auth, db} from '../config/firebase';

export const loadGameProgress = async (gameId: string) => {
  const uid = auth.currentUser?.uid;

  if (!uid) return null;

  const gameRef = doc(db, 'users', uid, 'games', gameId);
  const snap = await getDoc(gameRef);

  const defaultData = {
    currentLevel: 1,
    levels: {
      level_1: {
        unlocked: true,
        completed: false,
        stars: 0,
        xpClaimed: false,
      },
    },
  };

  if (!snap.exists()) {
    return defaultData;
  }

  const data = snap.data();

  return {
    currentLevel: data.currentLevel || 1,
    levels: {
      ...defaultData.levels,
      ...(data.levels || {}),
    },
  };
};