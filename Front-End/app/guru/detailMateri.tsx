import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS } from '@/utils/theme';

export default function DetailMateriGuru() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title, subtitle, subject, kelas, date, files: filesParam } = params;

  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (filesParam) {
      try {
        const parsed = JSON.parse(filesParam as string);
        setFiles(parsed);
      } catch (e) {
        setFiles([]);
      }
    }
    setLoading(false);
  }, [filesParam]);

  const goToEdit = () => {
    router.push({
      pathname: '/guru/editMateri',
      params: {
        id: id as string,
        title: title as string,
        subtitle: subtitle as string,
        subject: subject as string,
        kelas: kelas as string,
        date: date as string,
        files: filesParam as string,
      },
    });
  };

  const renderFile = (file: any, index: number) => {
    if (file.type === 'image' && file.url) {
      return (
        <View key={index} style={styles.fileCard}>
          <Image source={{ uri: file.url }} style={styles.imagePreview} />
        </View>
      );
    } else if (file.type === 'pdf') {
      return (
        <View key={index} style={styles.fileCard}>
          <View style={styles.pdfPreview}>
            <Ionicons name="document-text" size={48} color={COLORS.primary} />
            <Text style={styles.pdfText}>PDF ({file.pages?.length || 0} halaman)</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#FFFFFF', '#ADDFFD']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={COLORS.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Materi</Text>
          <TouchableOpacity onPress={goToEdit} style={styles.editButton}>
            <Ionicons name="pencil" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>{title as string}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Deskripsi</Text>
          <Text style={styles.infoText}>{subtitle as string}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoDetail}>Mata Pelajaran: {subject as string}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoDetail}>Kelas: {kelas as string || 'Kelas 7'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoDetail}>Tanggal Upload: {date as string}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>File Materi</Text>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : files.length > 0 ? (
          <View style={styles.filesGrid}>
            {files.map((file, idx) => renderFile(file, idx))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Belum ada file materi</Text>
        )}
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  editButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMain,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.8,
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
  fileCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.s,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    marginBottom: 12,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  pdfPreview: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  pdfText: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: 8,
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