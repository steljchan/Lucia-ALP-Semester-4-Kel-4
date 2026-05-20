import {
  doc,
  getDoc,
} from 'firebase/firestore';

import {
  auth,
  db,
} from '../config/firebase';

export const loadGameProgress =
  async (gameId: string) => {

    const uid =
      auth.currentUser?.uid;

    if (!uid) return null;

    const gameRef = doc(
      db,
      'users',
      uid,
      'games',
      gameId
    );

    const snap =
      await getDoc(gameRef);

    if (!snap.exists()) {

      return {
        currentLevel: 1,

        levels: {
          level_1: {
            unlocked: true,
            completed: false,
            stars: 0,
          },
        },
      };
    }

    return snap.data();
  };