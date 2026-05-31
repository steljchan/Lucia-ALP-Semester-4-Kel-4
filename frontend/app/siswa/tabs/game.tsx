import { View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import GameCard from '../../../src/components/game/gameCard';
// import SearchBar from '../../../src/components/common/searchbar';

import { COLORS, containerHeader, TEXT, subtitle, PROFILE, BTN, scrollContent} from '@/utils/theme';
import AppHeaderWOsearch from '../../../src/components/common/appheader';
import AppHeader from '../../../src/components/common/appheader';


export default function GameMenu() {
  const router = useRouter();

  const games = [
    {
      title: 'Siapakah Aku?',
      image: require('../../../assets/images/games/siapakahAku.png'),
      route: '/siswa/game/siapakahaku',
    },

    {
      title: 'Berapakah Aku?',
      image: require('../../../assets/images/games/berapakahAku.png'),
      route: '/siswa/game/berapakahaku',
    },
    {
      title: 'Bahasa Isyarat',
      image: require('../../../assets/images/games/bahasaIsyarat.png'),
      route: '/siswa/game/bahasaisyarat',
    },
    {
      title: 'Berapakah Jumlah Kami?',
      image: require('../../../assets/images/games/berapakahJumlahKami.png'),
      route: '/siswa/game/berapakahJumlahKami',
    },
    {
      title: 'Mencocokkan Kata',
      image: require('../../../assets/images/games/mencocokkanKata.png'),
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
        <AppHeader/>
        <FlatList
          data={games}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={[scrollContent, styles.list]} 
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          
         
          // ListHeaderComponent={
          //   <>
          //     <AppHeader/>
          //     <View style={{ marginBottom: 10 }}>
          //        <SearchBar/>
          //     </View>
          //   </>
          // }

          renderItem={({ item }) => (
            <GameCard
              title={item.title}
              image={item.image}
              onPress={() => item.route && router.push(item.route)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}



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
    paddingTop: 20,
  },

  row: {
    justifyContent: 'space-between',
  },
});
