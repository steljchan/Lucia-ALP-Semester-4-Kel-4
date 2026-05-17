import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import {COLORS, title, containerHeader, scrollContent, MARGIN_HORIZONTAL} from '@/utils/theme';
import AppHeader from '../../../src/components/common/guru/appheaderGradient';
import {Ionicons} from '@expo/vector-icons';
import FilterChips from '../../../src/components/dashboard/guru/filter';
import {useRouter} from 'expo-router';
import TemplateCard from '../../../src/components/common/guru/tmplateCard'; 

const TulisBilangan = require('@/assets/images/Template/MenulisBilangan.png');
const Hewan = require('@/assets/images/Template/ciriMakhlukHidup.png');

const TEMPLATES = [
  { 
    id: '1', 
    title: 'Template Matematika', 
    previewUrl: 'https://www.canva.com/design/DAHGdbzbZtw/aUEKtqS9c3mKi65WvcHkxw/view?embed', 
    tmpltUrl: 'https://canva.link/3jsgbl530vcxapz', 
    category: 'Matematika',
    imageUrl: TulisBilangan
  },

  { 
    id: '2', 
    title: 'Template Matematika', 
    previewUrl: 'https://www.canva.com/design/DAHIA-DChvU/BQZq4CsonCBtvDWNy1ZurQ/view?embed', 
    tmpltUrl: 'https://canva.link/pfa2sjxja01knjl', 
    category: 'IPA', 
    imageUrl: Hewan
  },
  
];

const CATEGORIES = ['Semua', 'Matematika', 'Bahasa Inggris', 'Bahasa Indonesia', 'IPA', 'IPS'];

export default function DashboardGuru() {
  const router = useRouter();
  const [isGridView, setIsGridView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const handleGoToPreview = (item: any) => {
    router.push({
      pathname: '/guru/preview',
      params: { 
        previewUrl: item.previewUrl,
        templateUrl: item.tmpltUrl,
        titleName: item.title 
      }
    });
  };

  const filteredTemplates = selectedCategory === 'Semua' 
    ? TEMPLATES 
    : TEMPLATES.filter(item => item.category === selectedCategory);

  return (
    <View style={[containerHeader, { flex: 1 }]}>
      <AppHeader/>
      <View style={{ marginHorizontal: MARGIN_HORIZONTAL }}>
        <Text style={[title, { fontSize: 16, marginTop: 20 }]}>Jelajahi Template Materi</Text>
        <FilterChips
          data={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={scrollContent}
      >
 
        <View style={styles.sectionHeader}>
          <Text style={{ color: COLORS.darkGray, fontSize: 14 }}>
            Menampilkan {filteredTemplates.length} template
          </Text>
          <TouchableOpacity onPress={() => setIsGridView(!isGridView)}>
            <Ionicons name={isGridView ? "list-outline" : "grid-outline"} size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
          {filteredTemplates.map((item) => (
            <TemplateCard 
              key={item.id}
              item={item}
              isGridView={isGridView}
              onPress={handleGoToPreview} 
            />
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

  listWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
  },  
});