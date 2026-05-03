import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import LevelNode from '../../../../src/components/game/levelnode';

export default function Roadmap() {
  const router = useRouter();

  const levels = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    unlocked: i < 3,
  }));

  return (
    <FlatList
      data={levels}
      contentContainerStyle={{ alignItems: 'center', padding: 20 }}
      renderItem={({ item }) => (
        <LevelNode
          level={item.id}
          unlocked={item.unlocked}
          onPress={() =>
            router.push(`/siswa/game/siapakah-aku/level/${item.id}`)
          }
        />
      )}
    />
  );
}