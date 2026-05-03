import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function GameCard({ title, image, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      
      {/* 🔥 IMAGE LANGSUNG TANPA WRAPPER */}
      <Image source={image} style={styles.image} />

      <Text style={styles.title}>{title}</Text>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',

    // 🔥 PROPORSI Figma (portrait)
    height: 240,

    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden', // 🔥 penting biar gambar ikut radius

    marginBottom: 16,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  image: {
    width: '100%',
    height: 170, 
    resizeMode: 'cover',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',

    fontSize: 14,
    fontWeight: '600',

    color: '#1A3B5D',
  },
});