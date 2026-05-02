import { View, Text, StyleSheet, Image } from 'react-native';

export default function LastSeenCard({
  title = "Belajar Menghitung Satuan",
  subtitle = "Berat, Jarak dan Waktu",
  image = { uri: 'https://cdn-icons-png.flaticon.com/512/2721/2721297.png' },
}: any) {

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    marginTop: 10,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  image: {
    width: 75,
    height: 75,
    marginRight: 14,
    resizeMode: 'contain',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontWeight: '600',
    fontSize: 15,
    color: '#1A3B5D',
  },

  subtitle: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
  },
});