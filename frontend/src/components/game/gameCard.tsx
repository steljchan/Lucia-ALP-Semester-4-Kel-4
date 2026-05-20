import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function GameCard({ title, image, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      
      {/* IMAGE */}
      <Image source={image} style={styles.image} />

      {/* TITLE AREA */}
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

    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',

    marginBottom: 16,

    elevation: 3,
    shadowColor: '#000',
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
    
    justifyContent: 'center', // vertical center
    alignItems: 'center',     // horizontal center

    paddingHorizontal: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A3B5D',
    textAlign: 'center',
  },
});