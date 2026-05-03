import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function GameCard({ title, image, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#1A3B5D',
  },
});