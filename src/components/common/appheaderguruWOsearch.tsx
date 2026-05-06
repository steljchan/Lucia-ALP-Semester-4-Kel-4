import { View, StyleSheet, Image } from 'react-native';
import SearchBar from './searchbar';
import { COLORS } from '@/utils/theme';

export default function AppHeader() {
  return (
    <View style={styles.container}>
      
      {/* TOP ROW */}
      <View style={styles.topRow}>
        
        {/* LOGO */}
        <Image
          source={require('../../../assets/images/lucia.png')}
          style={styles.logo}
        />

      </View>

      {/* SEARCH BAR */}
      <SearchBar />

      {/* ROBOT IMAGE */}
      <Image
        source={require('../../../assets/images/ViboBuku.png')}
        style={styles.robot}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 45,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'center',

    marginBottom: 10,
  },

  logo: {
    width: 145, 
    height: 55,
    resizeMode: 'contain',
  },

  robot: {
    position: 'absolute',
    right: 12,
    bottom: 5,

    width: 45,  
    height: 65,
  },
});