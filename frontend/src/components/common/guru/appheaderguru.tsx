import { useState } from 'react';
import { View, StyleSheet, Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AppHeader() {

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
});