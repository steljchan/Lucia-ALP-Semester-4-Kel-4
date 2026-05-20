import {
  doc,
  getDoc,
  setDoc,
  increment,
} from 'firebase/firestore';

import {
  auth,
  db,
} from '../config/firebase';

type SaveGameProgressProps = {
  gameId: string;

  levelId: number;

  stars: number;

  xp: number;

  coin: number;
};

export const saveGameProgress =
  async ({
    gameId,
    levelId,
    stars,
    xp,
    coin,
  }: SaveGameProgressProps) => {

    const uid =
      auth.currentUser?.uid;

    if (!uid) return;

    /*
      =========================
      USER ROOT
      =========================
    */

    const userRef =
      doc(
        db,
        'users',
        uid
      );

    /*
      =========================
      GAME DOC
      =========================
    */

    const gameRef =
      doc(
        db,
        'users',
        uid,
        'games',
        gameId
      );

    /*
      =========================
      UPDATE USER GLOBAL DATA
      =========================
    */

    await setDoc(
      userRef,
      {
        xp: increment(xp),

        coin: increment(coin),

        totalStars:
          increment(stars),
      },
      { merge: true }
    );

    /*
      =========================
      GET OLD GAME DATA
      =========================
    */

    const snap =
      await getDoc(gameRef);

    const oldData =
      snap.data();

    const levels =
      oldData?.levels || {};

    /*
      =========================
      SAVE CURRENT LEVEL
      =========================
    */

    levels[`level_${levelId}`] = {
      stars,
      completed: true,
      unlocked: true,
    };

    /*
      =========================
      UNLOCK NEXT LEVEL
      =========================
    */

    levels[
      `level_${levelId + 1}`
    ] = {
      ...(levels[
        `level_${levelId + 1}`
      ] || {}),

      unlocked: true,
    };

    /*
      =========================
      SAVE GAME DATA
      =========================
    */

    await setDoc(
      gameRef,
      {
        currentLevel:
          levelId + 1,

        levels,
      },
      { merge: true }
    );
  };