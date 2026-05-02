import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import SearchBar from './searchbar';
import { Ionicons } from '@expo/vector-icons';

export default function AppHeader() {
  return (
    <View style={styles.container}>
      
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/lucia.png')} 
            style={styles.logo}
          />
          <Text style={styles.title}>Lucia</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="storefront-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <SearchBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#BFD7EA',
    padding: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 8,
    resizeMode: 'contain', 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});