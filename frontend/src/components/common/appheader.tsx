import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '@/src/components/common/searchbar';
import { COLORS } from '@/utils/theme';
import { useRouter } from 'expo-router';

type Props = {
  search: string;
  setSearch: (text: string) => void;
};

export default function AppHeader({ search, setSearch }: Props) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FFFFFF', '#C4E8FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <Image
          source={require('@/assets/images/lucia.png')}
          style={styles.logo}
        />

        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => router.push('/siswa/toko')}
        >
          <Ionicons
            name="storefront-outline"
            size={20}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Cari"
      />

      <Image
        source={require('../../../assets/images/ViboBuku.png')}
        style={styles.robot}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 45,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  logo: {
    width: 145, 
    height: 55,
    resizeMode: 'contain',
    marginTop: 2,
  },

  robot: {
    position: 'absolute',
    right: 12,
    bottom: 5, 
    width: 45,  
    height: 65,
  },

  shopBtn: {
    backgroundColor: COLORS.secondary,
    width: 44,
    height: 44,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});