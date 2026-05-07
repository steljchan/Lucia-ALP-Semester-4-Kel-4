import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, title, containerHeader, scrollContent, moreSubtitle, subtitle } from '@/utils/theme';
import AppHeader from '../../../src/components/common/guru/appheaderGradient';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../src/components/common/card'; 
import CategoryFilter from '../../../src/components/dashboard/guru/categoryFilter';

const TEMPLATES = [
  { id: '1', title: 'Template Matematika', image: require('@/assets/images/avatar1.jpeg'), category: 'Matematika' },
  { id: '2', title: 'Template Makhluk Hidup', image: require('@/assets/images/avatar2.jpeg'), category: 'IPA' },
  { id: '3', title: 'Template Indonesia', image: require('@/assets/images/avatar4.jpeg'), category: 'Bahasa Indonesia' },
  { id: '4', title: 'Template Tumbuhan', image: require('@/assets/images/avatar5.jpeg'), category: 'IPA' },
  { id: '5', title: 'Template Alphabet', image: require('@/assets/images/avatar7.jpeg'), category: 'Bahasa Inggris' },
  { id: '6', title: 'Template Sosial', image: require('@/assets/images/avatar2.jpeg'), category: 'IPS' },
];

const CATEGORIES = ['Semua', 'Matematika', 'Bahasa Inggris', 'Bahasa Indonesia', 'IPA', 'IPS'];

export default function DashboardGuru() {
  const [isGridView, setIsGridView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredTemplates = selectedCategory === 'Semua' 
    ? TEMPLATES 
    : TEMPLATES.filter(item => item.category === selectedCategory);

  return (
    <View style={[containerHeader, { flex: 1 }]}>
      <AppHeader/>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={scrollContent}
      >
        <Text style={[title, { fontSize: 22, marginTop: 20 }]}>Jelajahi Template Materi</Text>

        <CategoryFilter 
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={(cat) => setSelectedCategory(cat)}
        />

        <View style={styles.sectionHeader}>
          <Text style={{ color: COLORS.gray, fontSize: 14 }}>
            Menampilkan {filteredTemplates.length} template
          </Text>
          <TouchableOpacity onPress={() => setIsGridView(!isGridView)}>
            <Ionicons name={isGridView ? "list-outline" : "grid-outline"} size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
          {filteredTemplates.map((item) => (
            <Card 
              key={item.id} 
              style={StyleSheet.flatten([
                styles.cardBase, 
                isGridView ? styles.cardHalf : styles.cardFull
              ])}
            >
              <Image source={item.image} style={isGridView ? styles.imageGrid : styles.imageFull} />
              <View style={styles.cardInfo}>
                <Text 
                  style={isGridView ? moreSubtitle : subtitle} 
                  numberOfLines={isGridView ? 2 : 1} 
                >
                  {item.title}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  optionBtn: {
    padding: 5,
  },

  listWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
  },

  cardBase: {
    padding: 0, 
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 20, 
  },

  cardFull: {
    width: '100%', 
  },
  cardHalf: {
    width: '48%', 
    
    aspectRatio: 16 / 12, 
    justifyContent: 'flex-start', 
  },

  imageFull: {
    width: '100%',
    height: 180, 
    resizeMode: 'cover',
    backgroundColor: '#F5F5F5',
  },
  
  imageGrid: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    backgroundColor: '#F5F5F5',
  },
  cardInfo: {
    padding: 8,
    flex: 1, // Mengambil sisa ruang kartu
    justifyContent: 'center', // Teks sejajar vertikal ke tengah
  },
});