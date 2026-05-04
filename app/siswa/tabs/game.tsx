import { View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import GameCard from '../../../src/components/game/gameCard';
import SearchBar from '../../../src/components/common/searchbar';

import { COLORS, containerHeader, TEXT, subtitle, PROFILE, BTN, scrollContent} from '@/utils/theme';
import AppHeaderWOsearch from '../../../src/components/common/appheaderWOsearch';


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

    // dummy games
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
    <SafeAreaView style={styles.safeArea}>
      <View style={[containerHeader, { justifyContent: 'flex-start', alignItems: 'stretch' }]}>

        <AppHeaderWOsearch />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={scrollContent}>
          <SearchBar/>
          {/* 🎮 GAME GRID */}
          <FlatList
            data={games}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.list}
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EAF6FF',
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  logo: {
    width: 120,
    height: 45,
    resizeMode: 'contain',
  },

  shopBtn: {
    backgroundColor: '#5CBEFA',
    width: 42,
    height: 42,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  list: {
    paddingTop: 12,
  },

  row: {
    justifyContent: 'space-between',
  },
});