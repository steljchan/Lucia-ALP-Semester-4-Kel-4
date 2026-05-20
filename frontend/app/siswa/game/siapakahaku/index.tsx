import {
  useEffect,
  useState,
} from 'react';

import Roadmap from '../roadmap';

import {
  siapakahAkuLevels,
} from '../../../../src/data/siapakahaku';

import {
  loadGameProgress,
} from '../../../../src/services/loadGameProgress';

export default function SiapakahAku() {

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
              'siapakahaku'
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
    LEVEL WITH FIREBASE DATA
    =========================
  */

  const levels =
    siapakahAkuLevels.map(
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
      title="Siapakah Aku"

      levels={levels}

      currentLevel={
        currentLevel
      }

      routePrefix="/siswa/game/siapakahaku"
    />
  );
}