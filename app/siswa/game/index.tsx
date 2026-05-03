import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import GameCard from '../../../src/components/game/gamecard';

export default function GameMenu() {
  const router = useRouter();

  const games = [
    {
      title: 'Mencocokkan Kata',
      image: require('../../../assets/images/ViboBuku.png'),
      route: '/siswa/game/mencocokkan',
    },
    {
      title: 'Siapakah Aku?',
      image: require('../../../assets/images/ViboBuku.png'),
      route: '/siswa/game/siapakah-aku',
    },
  ];

  return (
    <FlatList
      data={games}
      numColumns={2}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <GameCard {...item} onPress={() => router.push(item.route)} />
      )}
    />
  );
}