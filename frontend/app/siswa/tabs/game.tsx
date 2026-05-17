import { View, FlatList} from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import GameCard from '../../../src/components/game/gameCard';
import { COLORS, containerHeader, scrollContent} from '@/utils/theme';
import AppHeader from '../../../src/components/common/appheader';

export default function GameMenu() {
  const router = useRouter();

  const games = [
    {
      title: 'Mencocokkan Kata',
      image: require('../../../assets/images/mencocokkanKata.png'),
      route: '/siswa/game/mencocokkan',
    },
    {
      title: 'Siapakah Aku?',
      image: require('../../../assets/images/siapakahAku.png'),
      route: '/siswa/game/siapakahaku',
    },

    {
      title: 'Angka Berapakah Aku?',
      image: { uri: 'https://cdn-icons-png.flaticon.com/512/4341/4341139.png' },
      route: '',
    },
    {
      title: 'Bahasa Isyarat',
      image: { uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png' },
      route: '',
    },
    {
      title: 'Puzzle Kata',
      image: { uri: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png' },
      route: '',
    },
    {
      title: 'Tebak Gambar',
      image: { uri: 'https://cdn-icons-png.flaticon.com/512/1040/1040230.png' },
      route: '',
    },
  ];

  return (
    <View style={styles.safeArea}>
      <View style={[containerHeader, { justifyContent: 'flex-start', alignItems: 'stretch' }]}>
        <AppHeader/>
        <FlatList
          data={games}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={[scrollContent, styles.list]} 
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}

          renderItem={({ item }) => (
            <GameCard
              title={item.title}
              image={item.image}
              onPress={() => item.route && router.push(item.route)}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  list: {
    paddingTop: 20,
  },

  row: {
    justifyContent: 'space-between',
  },
});
