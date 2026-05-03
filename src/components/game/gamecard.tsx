import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function GameCard({ title, image, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} />
      </View>

      <Text style={styles.title}>{title}</Text>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 200, // 🔥 lebih panjang ke bawah

    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,

    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  imageWrapper: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    borderRadius: 16,
    padding: 10,
    justifyContent: 'center',
  },

  image: {
    width: '100%',
    height: 110,
    resizeMode: 'contain',
  },

  title: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    color: '#1A3B5D',
  },
});