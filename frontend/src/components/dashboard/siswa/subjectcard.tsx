import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function SubjectCard({ title, image, onPress }: any) {
  return (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image source={image} style={styles.image} />

      <Text numberOfLines={2} style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 4, // android shadow
    shadowColor: '#000', // ios shadow
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: '100%',
    height: 95,
    resizeMode: 'contain',
    borderRadius:8,
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
    fontSize: 14,
  },
});