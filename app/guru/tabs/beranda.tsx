import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, title, containerHeader, scrollContent } from '@/utils/theme';
import AppHeader from '../../../src/components/common/appheaderguru';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../src/components/common/card'; 

const TEMPLATES = [
  { id: '1', title: 'Template Matematika', image: require('@/assets/images/avatar1.jpeg') },
  { id: '2', title: 'Template Makhluk Hidup', image: require('@/assets/images/avatar2.jpeg') },
  { id: '3', title: 'Template Indonesia', image: require('@/assets/images/avatar4.jpeg') },
  { id: '4', title: 'Template Tumbuhan', image: require('@/assets/images/avatar5.jpeg') },
];

export default function DashboardGuru() {
  const [isGridView, setIsGridView] = useState(false);

  return (
    <View style={[containerHeader, { flex: 1 }]}>
      <AppHeader />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[scrollContent, { paddingTop: 20 }]}
      >
        
        <View style={styles.sectionHeader}>
          <Text style={[title, { fontSize: 18 }]}>Jelajahi Template Materi</Text>
          
          <TouchableOpacity 
            onPress={() => setIsGridView(!isGridView)}
            style={styles.optionBtn}
          >
            <Ionicons 
              name={isGridView ? "list-outline" : "grid-outline"} 
              size={24} 
              color={COLORS.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Wrapper List menggunakan .map() */}
        <View style={styles.listWrapper}>
          {TEMPLATES.map((item) => (
            <Card 
              key={item.id} 
              style={StyleSheet.flatten([
                styles.cardBase, 
                isGridView ? styles.cardHalf : styles.cardFull
              ])}
            >
              <Image source={item.image} style={styles.image} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
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
    borderRadius: 20, 
  },
  cardFull: {
    width: '100%', 
  },
  cardHalf: {
    width: '48%', 
  },
  image: {
  width: '100%',
  // aspectRatio: 16 / 9, 
  // resizeMode: 'contain', 
  backgroundColor: '#F5F5F5',
  height: 170
},
  cardInfo: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
});