import {
  useEffect,
  useState,
} from 'react';

import {
  auth,
  db,
} from '@/src/config/firebase';

import {
  doc,
  onSnapshot,
} from 'firebase/firestore';

export const useUserGameData =
  () => {

    const [heart, setHeart] =
      useState(3);

    const [coin, setCoin] =
      useState(0);

    useEffect(() => {

      const uid =
        auth.currentUser?.uid;

      if (!uid) return;

      const userRef = doc(
        db,
        'users',
        uid
      );

      const unsubscribe =
        onSnapshot(
          userRef,
          (snap) => {

            const data =
              snap.data();

            /*
              =========================
              HEART
              =========================

              pakai ?? supaya
              kalau value 0
              tetap terbaca 0
            */

            setHeart(
              data?.heart ?? 3
            );

            /*
              =========================
              COIN
              =========================
            */

            setCoin(
              data?.coin ?? 0
            );
          },

          (error) => {

            console.log(
              'USER GAME DATA ERROR:',
              error
            );
          }
        );

      return () => {

        unsubscribe();

      };

    }, []);

    return {
      heart,
      coin,
    };
  };