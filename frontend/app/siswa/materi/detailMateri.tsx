import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, BTN } from '@/utils/theme';
import DetailHeader from '@/src/components/common/guru/detailHeader';
import PdfDetailMateri from '@/src/components/common/PDFDetailMateri';

//fireabase
import { db } from '@/src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

//pdf
// import Pdf from 'react-native-pdf';

export default function DetailMateri() {
  const router = useRouter();
  const { materialId } = useLocalSearchParams(); 

  const [materialData, setMaterialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const goToKuis = () => {
    router.push({
      pathname: '/quiz', 
      params: { id: materialId as string },
    });
  };

  useEffect(() => {
    const fetchFullData = async () => {
      if (!materialId) return;
      try {
        const docRef = doc(db, "material", materialId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMaterialData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
  }, [materialId]);

  const goToEdit = () => {
    router.push({
      pathname: '/guru/editMateri',
      params: { id: materialId as string },
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.root}>
      <DetailHeader
        title="Detail Materi"
        subtitle={materialData?.title || "Detail"}
        onEdit={goToEdit}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Text style={styles.sectionTitle}>Isi Materi</Text>
        
        <PdfDetailMateri materialId={materialId as string} />

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Deskripsi Umum</Text>
          <Text style={styles.infoText}>{materialData?.description || "Tidak ada deskripsi"}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoDetail}>Mata Pelajaran: {materialData?.subjectId}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoDetail}>Kelas: {materialData?.classId}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={BTN.primary.box} 
          onPress={goToKuis}
          activeOpacity={0.8}
        >
          <Text style={BTN.primary.text}>Mulai Kuis</Text>
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

  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },

  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 4,
  },

  infoText: {
    fontSize: 14,
    color: COLORS.textSub,
    marginBottom: 12,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  infoDetail: {
    fontSize: 13,
    color: COLORS.textMain,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 12,
  },

  filesGrid: {
    flexDirection: 'column',
    gap: 12,
  },

  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },

  loader: {
    marginVertical: 40,
  },

  emptyText: {
    textAlign: 'center',
    color: COLORS.textSub,
    marginTop: 20,
  },
});