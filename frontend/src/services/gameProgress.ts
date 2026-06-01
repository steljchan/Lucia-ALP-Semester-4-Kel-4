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

    if (!uid) {
      return {
        earnedXp: 0,
        earnedCoin: 0,
      };
    }

    /*
      =========================
      REFERENCES
      =========================
    */

    const userRef = doc(
      db,
      'users',
      uid
    );

    const gameRef = doc(
      db,
      'users',
      uid,
      'games',
      gameId
    );

    /*
      =========================
      GET OLD GAME DATA
      =========================
    */

    const snap =
      await getDoc(gameRef);

    const oldData =
      snap.data() || {};

    const levels =
      oldData.levels || {};

    const levelKey =
      `level_${levelId}`;

    const oldLevel =
      levels[levelKey] || {};

    /*
      =========================
      OLD VALUES
      =========================
    */

    const oldStars =
      oldLevel.stars || 0;

    const xpClaimed =
      oldLevel.xpClaimed || false;

    const oldCompleted =
      oldLevel.completed || false;

    /*
      =========================
      BEST STAR ONLY
      =========================
    */

    const bestStars =
      Math.max(
        oldStars,
        stars
      );

    /*
      =========================
      STAR DIFFERENCE
      =========================
    */

    const addedStars =
      Math.max(
        bestStars - oldStars,
        0
      );

    /*
      =========================
      REWARD RESULT
      =========================
    */

    let earnedXp = 0;
    let earnedCoin = 0;

    /*
      =========================
      ANTI FARMING
      XP & COIN
      ONLY FIRST CLEAR
      =========================
    */

    const firstCompletion =
      !oldCompleted &&
      !xpClaimed;

    if (firstCompletion) {

      earnedXp = xp;
      earnedCoin = coin;

      await setDoc(
        userRef,
        {
          xp: increment(xp),

          coin: increment(coin),

          totalStars:
            increment(
              addedStars
            ),
        },
        { merge: true }
      );
    }

    /*
      =========================
      ONLY UPDATE STARS
      WHEN REPLAY IMPROVES
      =========================
    */

    else if (addedStars > 0) {

      await setDoc(
        userRef,
        {
          totalStars:
            increment(
              addedStars
            ),
        },
        { merge: true }
      );
    }

    /*
      =========================
      SAVE LEVEL PROGRESS
      =========================
    */

    levels[levelKey] = {
      stars: bestStars,

      completed: true,

      unlocked: true,

      xpClaimed: true,
    };

    /*
      =========================
      UNLOCK NEXT LEVEL
      =========================
    */

    const nextLevelKey =
      `level_${levelId + 1}`;

    levels[nextLevelKey] = {
      ...(levels[
        nextLevelKey
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
          Math.max(
            oldData.currentLevel || 1,
            levelId + 1
          ),

        levels,
      },
      { merge: true }
    );

    /*
      =========================
      RETURN REWARD
      =========================
    */

    return {
      earnedXp,
      earnedCoin,
    };
  };