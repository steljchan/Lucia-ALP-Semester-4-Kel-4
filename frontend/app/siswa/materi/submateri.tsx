import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, MARGIN_HORIZONTAL } from '@/utils/theme';

// Data materi (sama seperti sebelumnya)
const materials = [
  {
    id: '1',
    title: 'Belajar Menghitung Satuan',
    description: 'Berat, Jarak dan Waktu',
    pagesDone: 7,
    pagesTotal: 10,
    percent: 70,
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178',
  },
  {
    id: '2',
    title: 'Perbandingan',
    description: 'Lebih besar dan kecil',
    pagesDone: 7,
    pagesTotal: 10,
    percent: 40,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
  },
  {
    id: '3',
    title: 'Penjumlahan',
    description: 'Satuan, Puluhan, Ratusan',
    pagesDone: 10,
    pagesTotal: 10,
    percent: 100,
    image: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7',
  },
  {
    id: '4',
    title: 'Pengurangan',
    description: 'Satuan, Puluhan, Ratusan',
    pagesDone: 3,
    pagesTotal: 10,
    percent: 30,
    image: 'https://images.unsplash.com/photo-1581091870622-1e7e0a1c9f2a',
  },
  {
    id: '5',
    title: 'Perkalian',
    description: '3 x 4 = 12\nSatuan, Puluhan, Ratusan',
    pagesDone: 10,
    pagesTotal: 10,
    percent: 100,
    image: 'https://images.unsplash.com/photo-1596495578289-4a4c5a5c2d0b',
  },
];

export default function SubMateri() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
     
       <LinearGradient colors={['#FFFFFF', '#ADDFFD']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.header}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color={COLORS.textMain}/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Materi Pembelajaran</Text>
                <View style={{ width: 40 }} />
            </View>
        </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.heroSection}>
            <Image source={require('@/assets/images/maskotMTK.png')} style={styles.heroImage}/>
            <Text style={styles.subjectTitle}>Matematika</Text>
        </View>
        
        {materials.map((item) => (
            <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => router.push({pathname: '/siswa/materi/detailMateri'})}>

                <Image source={{ uri: item.image }} style={styles.cardImage} />

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
            </TouchableOpacity>
            ))}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textMain,
    textAlign: 'center',
  },

  scrollContainer: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: SPACING.md,
  },

  heroSection: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  }, 
  
  heroImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  
  subjectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textMain,
    textAlign: 'center',
  },

  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    alignItems: 'center',
  },
  
  cardImage: {
    width: 119,
    height: 87,
    borderRadius: 10,
    marginRight: 12,
  },
  
  cardContent: {
    flex: 1
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: SPACING.xs,
  },

  cardDescription: {
    fontSize: 13,
    color: COLORS.textSub,
    marginBottom: SPACING.sm,
  },

});