import Roadmap from '../roadmap';
import { mencocokkanLevels } from '../../../../src/data/mencocokkan';

export default function Mencocokkan() {
  const currentLevel =
    mencocokkanLevels.findLast(l => l.unlocked)?.id || 1;

  return (
    <Roadmap
      title="Mencocokkan Kata"
      levels={mencocokkanLevels} 
      currentLevel={currentLevel}
      routePrefix="/siswa/game/mencocokkan"
    />
  );
}