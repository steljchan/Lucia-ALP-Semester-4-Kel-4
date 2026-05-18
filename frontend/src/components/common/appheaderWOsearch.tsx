import { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '@/src/components/common/searchbar';
import { COLORS } from '@/utils/theme';
import { useRouter } from 'expo-router';

export default function AppHeader() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <LinearGradient
      colors={['#FFFFFF', '#C4E8FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1.5 }}
      style={styles.container}
    >
      
      <View style={styles.topRow}>
        <Image
          source={require('@/assets/images/lucia.png')}
          style={styles.logo}
        />
        
        <TouchableOpacity 
        style={styles.shopBtn}
        onPress={() => router.push('/siswa/toko')}>
          <Ionicons name="storefront-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 50,
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

  shopBtn: {
    backgroundColor: COLORS.secondary,
    width: 44,
    height: 44,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});