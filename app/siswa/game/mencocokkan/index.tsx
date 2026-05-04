import Roadmap from '../roadmap';
import { mencocokkanLevels } from '../../../../src/data/mencocokkan';

export default function Mencocokkan() {
  const currentLevel =
    mencocokkanLevels.findLast(l => l.unlocked)?.id || 1;

  return (
    <Roadmap
      title="Mencocokkan Kata"
      levels={mencocokkanLevels} // tetap aman karena ada unlocked
      currentLevel={currentLevel}
      routePrefix="/siswa/game/mencocokkan"
    />
  );
}