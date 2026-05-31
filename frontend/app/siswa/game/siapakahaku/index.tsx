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

import {
  useUserGameData,
} from '@/src/hooks/useUserGameData';

export default function SiapakahAku() {

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
              'siapakahaku'
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
      title="Siapakah Aku"

      image={require(
        '@/assets/images/games/siapakahAku.png'
      )}

      heart={heart}

      coin={coin}

      levels={levels}

      currentLevel={
        currentLevel
      }

      routePrefix="/siswa/game/siapakahaku"
    />
  );
}