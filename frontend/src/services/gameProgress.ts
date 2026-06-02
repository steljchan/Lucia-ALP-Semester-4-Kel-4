import {doc, getDoc, setDoc, increment} from 'firebase/firestore';
import {auth, db} from '../config/firebase';

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

export const saveGameProgress = async ({
  gameId,
  levelId,
  stars,
  xp,
  coin,
}: SaveGameProgressProps): Promise<SaveGameProgressResult> => {
  const uid = auth.currentUser?.uid;

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

  const userRef = doc(db, 'users', uid);
  const gameRef = doc(db, 'users', uid, 'games', gameId);

  const snap = await getDoc(gameRef);
  const oldData = snap.data() || {};
  const levels = oldData.levels || {};
  const levelKey = `level_${levelId}`;
  const oldLevel = levels[levelKey] || {};

  const oldStars = oldLevel.stars || 0;
  const xpClaimed = oldLevel.xpClaimed || false;
  const bestStars = Math.max(oldStars, stars);
  const addedStars = Math.max(bestStars - oldStars, 0);
  const firstCompletion = !xpClaimed;
  const earnedXp = firstCompletion ? xp : 0;
  const earnedCoin = firstCompletion ? coin : 0;
  const userUpdate: any = {};

  if (earnedXp > 0) {
    userUpdate.xp = increment(earnedXp);
  }

  if (earnedCoin > 0) {
    userUpdate.coin = increment(earnedCoin);
  }

  if (addedStars > 0) {
    userUpdate.totalStars = increment(addedStars);
  }

  if (Object.keys(userUpdate).length > 0) {
    await setDoc(userRef, userUpdate, { merge: true });
  }

  levels[levelKey] = {
    ...oldLevel,
    stars: bestStars,
    completed: true,
    unlocked: true,
    xpClaimed: xpClaimed || firstCompletion,
  };

  const nextLevelKey = `level_${levelId + 1}`;
  levels[nextLevelKey] = {
    ...(levels[nextLevelKey] || {}),
    unlocked: true,
  };

  await setDoc(
    gameRef,
    {
      currentLevel: Math.max(oldData.currentLevel || 1, levelId + 1),
      levels,
    },
    { merge: true }
  );

  return {
    earnedXp,
    earnedCoin,
    addedStars,
    firstCompletion,
    previousStars: oldStars,
    bestStars,
  };
};