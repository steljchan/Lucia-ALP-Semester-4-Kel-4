import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../searchbar';
import { COLORS } from '@/utils/theme';
import { useRouter } from 'expo-router';

export default function AppHeader() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#EBF7FF', '#C9EAFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* TOP ROW */}
      <View style={styles.topRow}>
        
        {/* LOGO */}
        <Image
          source={require('@/assets/images/lucia.png')}
          style={styles.logo}
        />

      </View>

      {/* SEARCH BAR */}
      <SearchBar />

          </LinearGradient>
        );
      }

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 45, // biar gradient keliatan

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
});