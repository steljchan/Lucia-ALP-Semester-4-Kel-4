import React from 'react';
import {View, Text, ScrollView, TouchableOpacity,  StyleSheet, StatusBar, Image} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS} from '@/utils/theme';
import DetailHeader from '@/src/components/common/guru/detailHeader';

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
     
      <DetailHeader
        title="Materi Pembelajaran"
        subtitle="Matematika"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroWrapper}>
            <Image
              source={require('@/assets/images/materi/Matematika.png')}
              style={styles.heroImage}
            />
            <Image
              source={require('../../../assets/images/ViboBuku.png')}
              style={styles.robot}
            />
          </View>
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

  scrollContainer: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  heroWrapper: {
    position: 'relative',
    width: 240,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroImage: {
    width: 135,
    height: 135,
    borderRadius: 100,
  },

  robot: {
    position: 'absolute',
    width: 90,
    height: 90,
    resizeMode: 'contain',
    bottom: 0,
    right: 0,
  },

  subjectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textMain,
    textAlign: 'center',
    marginTop: -10,
  },

  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    marginBottom: 12,
    alignItems: 'center',
  },
  
  cardImage: {
    width: 119,
    height: 87,
    borderRadius: BORDER_RADIUS.s,
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