import {useEffect, useState} from 'react';
import {auth, db} from '@/src/config/firebase';
import {doc, getDoc, onSnapshot, updateDoc, Timestamp} from 'firebase/firestore';

const MAX_HEART = 3;
const REGEN_INTERVAL_MINUTES = 30;
const INTERVAL_MS = REGEN_INTERVAL_MINUTES * 60 * 1000;

export const useUserGameData = () => {
  const [heart, setHeart] = useState(MAX_HEART);
  const [coin, setCoin] = useState(0);
  const [nextHeartSeconds, setNextHeartSeconds] = useState(0);

  const refreshHeart = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const data = snap.data();

    let currentHeart = data.heart ?? MAX_HEART;
    let lastHeartRegen = data.lastHeartRegen?.toDate?.() ?? data.createdAt?.toDate?.() ?? new Date();
    const now = new Date();

    if (currentHeart >= MAX_HEART) {
      setHeart(MAX_HEART);
      setNextHeartSeconds(0);
      return;
    }

    const diffMs = now.getTime() - lastHeartRegen.getTime();
    const increments = Math.floor(diffMs / INTERVAL_MS);

    if (increments > 0) {
      currentHeart = Math.min(currentHeart + increments, MAX_HEART);
      lastHeartRegen = new Date(lastHeartRegen.getTime() + increments * INTERVAL_MS);

      await updateDoc(userRef, {
        heart: currentHeart,
        lastHeartRegen: Timestamp.fromDate(lastHeartRegen),
      });
    }

    setHeart(currentHeart);

    if (currentHeart >= MAX_HEART) {
      setNextHeartSeconds(0);
      return;
    }

    const elapsed = now.getTime() - lastHeartRegen.getTime();
    const remaining = INTERVAL_MS - (elapsed % INTERVAL_MS);
    setNextHeartSeconds(Math.floor(remaining / 1000));
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userRef = doc(db, 'users', uid);
    refreshHeart();

    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        const data = snap.data();
        setHeart(data?.heart ?? MAX_HEART);
        setCoin(data?.coin ?? 0);
      },
      (error) => {
        console.log('USER GAME DATA ERROR:', error);
      }
    );

    const regenInterval = setInterval(async () => {
      await refreshHeart();
    }, 1000);

    const countdownInterval = setInterval(async () => {
      setNextHeartSeconds((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
      await refreshHeart();
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(regenInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const minutes = Math.floor(nextHeartSeconds / 60);
  const seconds = nextHeartSeconds % 60;
  const formattedTimer = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return {
    heart,
    coin,
    nextHeartSeconds,
    formattedTimer,
  };
};