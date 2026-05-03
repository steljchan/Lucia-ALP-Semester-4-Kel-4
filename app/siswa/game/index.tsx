import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import GameCard from '../../../src/components/game/gamecard';
import SearchBar from '../../../src/components/common/searchbar';
import { Ionicons } from '@expo/vector-icons';

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
      route: '/siswa/game/siapakah-aku',
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
    <View style={styles.container}>

      <View style={styles.topRow}>
        <Image
          source={require('../../../assets/images/lucia.png')}
          style={styles.logo}
        />

        <TouchableOpacity style={styles.shopBtn}>
          <Ionicons name="storefront-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 🔍 SEARCH */}
      <SearchBar />

      {/* 🎮 GRID */}
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF6FF',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingTop: 10,
    paddingBottom: 120,
  },

  row: {
    justifyContent: 'space-between',
  },
});