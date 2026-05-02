import { View, Text, StyleSheet, Image } from 'react-native';

export default function LastSeenCard({
  title = "Belajar Menghitung Satuan",
  subtitle = "Berat, Jarak dan Waktu",
  progress = 0.7,
  image = { uri: 'https://cdn-icons-png.flaticon.com/512/2721/2721297.png' },
}: any) {

  const percent = Math.round(progress * 100);

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${percent}%` }]} />
        </View>

        <Text style={styles.percent}>{percent}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 12,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginTop: 6,
  },
  progress: {
    height: '100%',
    backgroundColor: '#4DA6FF',
    borderRadius: 10,
  },
  percent: {
    fontSize: 12,
    marginTop: 4,
    color: '#555',
  },
});