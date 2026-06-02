import {useEffect, useState} from 'react';

import Roadmap from '../roadmap';
import {berapakahAkuLevels} from '../../../../src/data/berapakahaku';
import {loadGameProgress} from '../../../../src/services/loadGameProgress';
import {useUserGameData} from '@/src/hooks/useUserGameData';

export default function BerapakahAku() {
  const { heart, coin } = useUserGameData();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await loadGameProgress('berapakahaku');
        setProgress(data);
      } catch (error) {
        console.log('ERROR LOAD PROGRESS:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const levels = berapakahAkuLevels.map((level) => {
    const levelData = progress?.levels?.[`level_${level.id}`];
    return {
      ...level,
      unlocked: levelData?.unlocked || level.id === 1,
      completed: levelData?.completed || false,
      played: levelData?.completed || false,
      stars: levelData?.stars || 0,
    };
  });

  const currentLevel = levels.findLast((l) => l.unlocked)?.id || 1;
  if (loading) {
    return null;
  }

  return (
    <Roadmap
      title="Berapakah Aku"
      image={require('@/assets/images/games/berapakahAku.png')}
      heart={heart}
      coin={coin}
      levels={levels}
      currentLevel={currentLevel}
      routePrefix="/siswa/game/berapakahaku"
    />
  );
}