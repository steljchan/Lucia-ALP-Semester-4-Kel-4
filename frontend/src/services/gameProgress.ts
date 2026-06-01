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

/*
  ========================================
  TYPES
  ========================================
*/

type SaveGameProgressProps = {
  gameId: string;

  levelId: number;

  stars: number;

  xp: number;

  coin: number;
};

type SaveGameProgressResult = {
  earnedXp: number;

  earnedCoin: number;

  addedStars: number;

  firstCompletion: boolean;

  previousStars: number;

  bestStars: number;
};

/*
  ========================================
  SAVE GAME PROGRESS
  ========================================
*/

export const saveGameProgress =
  async ({
    gameId,
    levelId,
    stars,
    xp,
    coin,
  }: SaveGameProgressProps):
  Promise<SaveGameProgressResult> => {

    /*
      ========================================
      AUTH
      ========================================
    */

    const uid =
      auth.currentUser?.uid;

    if (!uid) {

      return {
        earnedXp: 0,
        earnedCoin: 0,
        addedStars: 0,
        firstCompletion: false,
        previousStars: 0,
        bestStars: 0,
      };
    }

    /*
      ========================================
      REFERENCES
      ========================================
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
      ========================================
      GET OLD DATA
      ========================================
    */

    const snap =
      await getDoc(
        gameRef
      );

    const oldData =
      snap.data() || {};

    const levels =
      oldData.levels || {};

    const levelKey =
      `level_${levelId}`;

    const oldLevel =
      levels[levelKey] || {};

    /*
      ========================================
      OLD VALUES
      ========================================
    */

    const oldStars =
      oldLevel.stars || 0;

    const xpClaimed =
      oldLevel.xpClaimed || false;

    /*
      ========================================
      BEST STAR
      ========================================
    */

    const bestStars =
      Math.max(
        oldStars,
        stars
      );

    /*
      ========================================
      ADDED STAR
      ========================================
    */

    const addedStars =
      Math.max(
        bestStars -
          oldStars,
        0
      );

    /*
      ========================================
      FIRST CLEAR
      ========================================
    */

    const firstCompletion =
      !xpClaimed;

    /*
      ========================================
      FINAL REWARD
      ========================================
    */

    const earnedXp =
      firstCompletion
        ? xp
        : 0;

    const earnedCoin =
      firstCompletion
        ? coin
        : 0;

    /*
      ========================================
      UPDATE USER
      ========================================
    */

    const userUpdate: any =
      {};

    /*
      XP
    */

    if (
      earnedXp > 0
    ) {

      userUpdate.xp =
        increment(
          earnedXp
        );
    }

    /*
      COIN
    */

    if (
      earnedCoin > 0
    ) {

      userUpdate.coin =
        increment(
          earnedCoin
        );
    }

    /*
      STAR
    */

    if (
      addedStars > 0
    ) {

      userUpdate.totalStars =
        increment(
          addedStars
        );
    }

    /*
      SAVE USER
    */

    if (
      Object.keys(
        userUpdate
      ).length > 0
    ) {

      await setDoc(
        userRef,
        userUpdate,
        {
          merge: true,
        }
      );
    }

    /*
      ========================================
      SAVE LEVEL
      ========================================
    */

    levels[levelKey] = {

      ...oldLevel,

      stars: bestStars,

      completed: true,

      unlocked: true,

      /*
        xpClaimed hanya
        true setelah
        first clear
      */

      xpClaimed:
        xpClaimed ||
        firstCompletion,
    };

    /*
      ========================================
      UNLOCK NEXT LEVEL
      ========================================
    */

    const nextLevelKey =
      `level_${
        levelId + 1
      }`;

    levels[nextLevelKey] = {

      ...(levels[
        nextLevelKey
      ] || {}),

      unlocked: true,
    };

    /*
      ========================================
      SAVE GAME DATA
      ========================================
    */

    await setDoc(
      gameRef,
      {
        currentLevel:
          Math.max(
            oldData.currentLevel ||
              1,
            levelId + 1
          ),

        levels,
      },
      {
        merge: true,
      }
    );

    /*
      ========================================
      RETURN
      ========================================
    */

    return {

      earnedXp,

      earnedCoin,

      addedStars,

      firstCompletion,

      previousStars:
        oldStars,

      bestStars,
    };
  };