import {
  useEffect,
  useState,
} from 'react';

import Roadmap from '../roadmap';

import {
  bahasaIsyaratLevels,
} from '../../../../src/data/bahasaisyarat';

import {
  loadGameProgress,
} from '../../../../src/services/loadGameProgress';

import {
  useUserGameData,
} from '@/src/hooks/useUserGameData';

export default function BahasaIsyarat() {

  /*
    =========================
    USER GAME DATA
    =========================
  */

  const {
    heart,
    coin,
  } = useUserGameData();

  /*
    =========================
    FIREBASE PROGRESS
    =========================
  */

  const [progress, setProgress] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  /*
    =========================
    LOAD FIREBASE
    =========================
  */

  useEffect(() => {

    const fetchProgress =
      async () => {

        try {

          const data =
            await loadGameProgress(
              'bahasaisyarat'
            );

          setProgress(data);

        } catch (error) {

          console.log(
            'ERROR LOAD PROGRESS:',
            error
          );

        } finally {

          setLoading(false);

        }
      };

    fetchProgress();

  }, []);

  /*
    =========================
    LEVEL WITH PROGRESS
    =========================
  */

  const levels =
    bahasaIsyaratLevels.map(
      (level) => {

        const levelData =
          progress?.levels?.[
            `level_${level.id}`
          ];

        return {

          ...level,

          unlocked:
            levelData?.unlocked ||
            level.id === 1,

          completed:
            levelData?.completed ||
            false,

          played:
            levelData?.completed ||
            false,

          stars:
            levelData?.stars || 0,
        };
      }
    );

  /*
    =========================
    CURRENT LEVEL
    =========================
  */

  const currentLevel =
    levels.findLast(
      (l) => l.unlocked
    )?.id || 1;

  /*
    =========================
    LOADING
    =========================
  */

  if (loading) {
    return null;
  }

  return (
    <Roadmap
      title="Bahasa Isyarat"

      image={require(
        '@/assets/images/games/bahasaIsyarat.png'
      )}

      heart={heart}

      coin={coin}

      levels={levels}

      currentLevel={
        currentLevel
      }

      routePrefix="/siswa/game/bahasaisyarat"
    />
  );
}