import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {COLORS} from '@/utils/theme';

export default function GameCard({ title, image, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.image} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 230, 

    backgroundColor: COLORS.white,
    borderRadius: 22,
    overflow: 'hidden',

    marginBottom: 16,

    elevation: 3,
    shadowColor: COLORS.black,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  image: {
    width: '100%',
    height: 190, 
    resizeMode: 'cover',
  },

  titleContainer: {
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center',   
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMain,
    textAlign: 'center',
  },
});