import { View, Text, StyleSheet } from 'react-native';
import {COLORS} from '@/utils/theme';

export default function GamePage() {
  return (
    <View style={styles.container}>
       {/* isi kode dsini */}
      <Text style={styles.text}>INI HALAMAN LEADERBOARD</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary, // wrna birunya lucia
  },
});