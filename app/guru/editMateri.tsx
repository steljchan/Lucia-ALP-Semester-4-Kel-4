import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput, Modal, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS } from '@/utils/theme';
import * as ImagePicker from 'expo-image-picker';

interface FileItem {
  id: string;
  type: 'image' | 'pdf';
  url?: string;
  pages?: string[];
}

export default function EditMateriGuru() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title, subtitle, subject, class: classParam, date, files: filesParam } = params;

  const [materiTitle, setMateriTitle] = useState(title as string || '');
  const [materiSubtitle, setMateriSubtitle] = useState(subtitle as string || '');
  const [materiSubject, setMateriSubject] = useState(subject as string || 'Matematika');
  const [materiClass, setMateriClass] = useState(classParam as string || 'Kelas 7');
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [showClassPicker, setShowClassPicker] = useState(false);

  useEffect(() => {
    if (filesParam) {
      try {
        const parsed = JSON.parse(filesParam as string);
        setFileList(parsed);
      } catch (e) {
        setFileList([]);
      }
    }
  }, [filesParam]);

  const pickImageFile = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin diperlukan", "Aplikasi membutuhkan akses galeri.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      const newFile: FileItem = {
        id: Date.now().toString(),
        type: 'image',
        url: result.assets[0].uri,
      };
      setFileList(prev => [...prev, newFile]);
    }
  };

  const addPdfPlaceholder = () => {
    const newPdf: FileItem = {
      id: Date.now().toString(),
      type: 'pdf',
      pages: [
        'https://picsum.photos/id/40/400/200',
        'https://picsum.photos/id/41/400/200',
      ],
    };
    setFileList(prev => [...prev, newPdf]);
  };

  const removeFile = (fileId: string) => {
    Alert.alert("Hapus", "Yakin ingin menghapus file ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => setFileList(prev => prev.filter(f => f.id !== fileId)) }
    ]);
  };

  const saveChanges = () => {
    if (!materiTitle.trim()) {
      Alert.alert("Error", "Judul materi tidak boleh kosong");
      return;
    }
    // Simpan ke backend atau state global (contoh hanya alert)
    Alert.alert("Berhasil", `Perubahan materi "${materiTitle}" untuk ${materiClass} - ${materiSubject} telah disimpan`);
    router.back();
  };

  const renderFileItem = ({ item }: { item: FileItem }) => (
    <View style={styles.fileCard}>
      {item.type === 'image' && item.url && (
        <Image source={{ uri: item.url }} style={styles.fileImage} />
      )}
      {item.type === 'pdf' && (
        <View style={styles.pdfPreview}>
          <Ionicons name="document-text" size={40} color={COLORS.primary} />
          <Text style={styles.pdfText}>PDF ({item.pages?.length || 0} halaman)</Text>
        </View>
      )}
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeFile(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#FF383C" />
      </TouchableOpacity>
    </View>
  );

  // Daftar kelas
  const classOptions = ['Kelas 7', 'Kelas 8', 'Kelas 9'];

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#FFFFFF', '#ADDFFD']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={COLORS.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Materi</Text>
          <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
            <Ionicons name="checkmark" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Judul Materi</Text>
          <TextInput
            style={styles.input}
            value={materiTitle}
            onChangeText={setMateriTitle}
            placeholder="Contoh: Mengenal Mata Uang"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Deskripsi Singkat</Text>
          <TextInput
            style={styles.input}
            value={materiSubtitle}
            onChangeText={setMateriSubtitle}
            placeholder="Deskripsi materi"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mata Pelajaran</Text>
          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowSubjectPicker(true)}>
            <Text style={styles.pickerText}>{materiSubject}</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textMain} />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kelas</Text>
          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowClassPicker(true)}>
            <Text style={styles.pickerText}>{materiClass}</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textMain} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>File Materi (Gambar / PDF)</Text>
        <FlatList
          data={fileList}
          keyExtractor={(item) => item.id}
          renderItem={renderFileItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.fileList}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={pickImageFile}>
            <Ionicons name="image-outline" size={24} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Tambah Gambar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={addPdfPlaceholder}>
            <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Tambah PDF</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteMateriButton}>
          <Text style={styles.deleteMateriText}>Hapus Materi Ini</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Pilih Mata Pelajaran */}
      <Modal visible={showSubjectPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Mata Pelajaran</Text>
            {['Matematika', 'Bahasa Inggris'].map((subj) => (
              <TouchableOpacity
                key={subj}
                style={styles.modalOption}
                onPress={() => {
                  setMateriSubject(subj);
                  setShowSubjectPicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{subj}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowSubjectPicker(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Pilih Kelas */}
      <Modal visible={showClassPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Kelas</Text>
            {classOptions.map((cls) => (
              <TouchableOpacity
                key={cls}
                style={styles.modalOption}
                onPress={() => {
                  setMateriClass(cls);
                  setShowClassPicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{cls}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowClassPicker(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  saveButton: {
    padding: 8,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: BORDER_RADIUS.s,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: BORDER_RADIUS.s,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 14,
    color: COLORS.textMain,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
    marginVertical: 12,
  },
  fileList: {
    gap: 12,
    paddingVertical: 8,
  },
  fileCard: {
    width: 150,
    height: 120,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    overflow: 'hidden',
    position: 'relative',
  },
  fileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pdfPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfText: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.smoothBlue,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  deleteMateriButton: {
    marginTop: 24,
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.s,
    alignItems: 'center',
  },
  deleteMateriText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.smoothBlue,
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalClose: {
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    color: COLORS.error,
    fontWeight: '600',
  },
});