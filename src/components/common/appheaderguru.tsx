import { View, StyleSheet, Image } from 'react-native';

export default function AppHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image source={require('../../../assets/images/lucia.png')} style={styles.logo}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBF7FF',
    paddingHorizontal: 16,
    paddingTop: 40,
    
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'center',
  },

  logo: {
    width: 145, 
    height: 55,
    resizeMode: 'contain',
  },
});