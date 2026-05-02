import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator, StatusBar} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; 
import { COLORS, SPACING, BORDER_RADIUS, title } from '@/utils/theme';
import * as WebBrowser from 'expo-web-browser';

interface MateriFile {
  id: string;
  type: 'image' | 'pdf';
  pages?: string[]; 
}

const defaultMateriFiles: MateriFile[] = [
  {
    id: '1',
    type: 'pdf',
    pages: [
      'https://picsum.photos/id/30/400/200',
      'https://picsum.photos/id/31/400/200',
      'https://picsum.photos/id/32/400/200'
    ]
  },
];

export default function DetailMateri() {
  const router = useRouter();
  const [files, setFiles] = useState<MateriFile[]>([]);
  const [loading, setLoading] = useState(true);

  const openPdf = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  useEffect(() => {
   const loadFiles = async () => {
      try {
        setTimeout(() => {
          setFiles(defaultMateriFiles);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setFiles(defaultMateriFiles);
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  const handleKuisPress = () => {
    router.push('./quiz');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
  
      <LinearGradient colors={['#FFFFFF', '#ADDFFD']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.header}>
        <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={28} color={COLORS.textMain} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Materi</Text>
            <View style={{ width: 40 }} />
        </View>
        <Text style={styles.subtitle}>Cara Menulis Bilangan</Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.imageGrid}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          ) : (
            files.map((item) => (
              <View key={item.id}>
                {item.pages?.map((page, index) => (
                  <View key={index} style={styles.imageCard}>
                    <Image source={{ uri: page }} style={styles.image} />
                  </View>
                ))}
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.kuisButton} onPress={handleKuisPress}>
          <Text style={styles.kuisButtonText}>Kuis</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

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

  subtitle: {
    fontSize: 14,
    color: COLORS.textMain,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.8,
  },

  scrollContent: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  card: {
    paddingBottom: SPACING.lg,
  },

  materiLabel: {
    fontSize: 14,
    color: COLORS.textSub,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
  },

  imageGrid: {
    flexDirection: 'column',
    gap: SPACING.md,
    marginVertical: SPACING.md,
  },

  loader: {
    marginVertical: SPACING.xl,
  },

  imageCard: {
    width: '100%',
    backgroundColor: COLORS.smoothBlue,
    borderRadius: BORDER_RADIUS.m,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },

  kuisButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.m,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  
  kuisButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },

  pdfOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  pdfText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});