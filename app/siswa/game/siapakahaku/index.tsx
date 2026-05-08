import Roadmap from '../roadmap';
import { siapakahAkuLevels } from '../../../../src/data/siapakahaku';

export default function SiapakahAku() {
  const currentLevel =
    siapakahAkuLevels.findLast(l => l.unlocked)?.id || 1;

  return (
    <Roadmap
      title="Siapakah Aku"
      levels={siapakahAkuLevels}
      currentLevel={currentLevel}
      routePrefix="/siswa/game/siapakahaku"
    />
  );
}