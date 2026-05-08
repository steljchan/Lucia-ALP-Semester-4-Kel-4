import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/theme';
import { useRouter } from 'expo-router';

export default function AppHeaderWOsearch() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <Image
        source={require('../../../assets/images/lucia.png')}
        style={styles.logo}
      />

      {/* SHOP BUTTON */}
      <TouchableOpacity 
        style={styles.shopBtn}
        onPress={() => router.push('/siswa/toko')}
      >
        <Ionicons name="storefront-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40, 
    paddingBottom: 10,
    backgroundColor: 'transparent', 
  },

  logo: {
    width: 145, 
    height: 55,
    resizeMode: 'contain',
    marginTop: 2,
  },

  shopBtn: {
    backgroundColor: COLORS.secondary,
    width: 44,
    height: 44,
    borderRadius: 22, // Full bulat
    justifyContent: 'center',
    alignItems: 'center',
  },
});