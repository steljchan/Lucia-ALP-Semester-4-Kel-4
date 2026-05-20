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

export default function BahasaIsyarat() {

  /*
    =========================
    FIREBASE PROGRESS
    =========================
  */

  const [progress, setProgress] =
    useState<any>(null);

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
        }
      };

    fetchProgress();

  }, []);

  /*
    =========================
    LEVEL WITH UNLOCK
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

  return (
    <Roadmap
      title="Bahasa Isyarat"

      levels={levels}

      currentLevel={
        currentLevel
      }

      routePrefix="/siswa/game/bahasaisyarat"
    />
  );
}