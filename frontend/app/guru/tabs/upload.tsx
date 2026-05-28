import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS } from '@/utils/theme';
import AppHeader from '../../../src/components/common/guru/appheaderguru';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';

// firebase
import { db, storage, auth } from "@/src/config/firebase"
import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

// pdf & preview
import { PDFDocument } from 'pdf-lib';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

interface FileItem {
  id: string;
  url: string;
  name: string;
}

export default function UploadMateri() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subject, setSubject] = useState('');
  const [showSubject, setShowSubject] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [teacherPairs, setTeacherPairs] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uniqueSubjects = [...new Set(teacherPairs.map(p => p.subject))];
  const availableClasses = teacherPairs.filter(p => p.subject === subject);

  const resetUpload = () => {
    setTitle('');
    setDesc('');
    setSubject('');
    setSelectedClasses([]);
    setFiles([]);
  };

  
  useEffect(() => {
    const fetchTeacherData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setTeacherPairs(userDoc.data().pairs || []);
        }
      } catch (error) {
        console.error("Gagal ambil data guru:", error);
      }
    };
    fetchTeacherData();
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        setFiles([{ id: Date.now().toString(), url: asset.uri, name: asset.name }]);
      }
    } catch (err) {
      console.error("Gagal memilih dokumen:", err);
    }
  };

  
  const previewFileContent = async (uri: string) => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Info", "File terpilih: " + files[0].name);
    }
  };

  
  const handleUpload = async () => {
    const user = auth.currentUser;
    if (!user || files.length === 0) return;
    setIsUploading(true);
    try {
      const file = files[0];
      const fileBase64 = await FileSystem.readAsStringAsync(file.url, { encoding: "base64" });
      const pdfDoc = await PDFDocument.load(fileBase64);
      const pageCount = pdfDoc.getPageCount();

      const storagePath = `materials/${user.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const response = await fetch(file.url);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const materialRef = await addDoc(collection(db, "material"), {
        title,
        description: desc,
        subjectId: subject,
        classId: selectedClasses[0],
        teacherId: user.uid,
        fileUrl: downloadURL,
        storagePath: storagePath,
        totalSteps: pageCount,
        createdAt: serverTimestamp(),
      });

      const stepsRef = collection(db, "material", materialRef.id, "steps");
      for (let i = 1; i <= pageCount; i++) {
        await addDoc(stepsRef, { order: i, pageNumber: i, description: i === 1 ? desc : "", imageUrl: downloadURL });
      }

      Alert.alert('Sukses', `Materi berhasil diupload!`);
      resetUpload();
      router.push({ pathname: "../detailMateri", params: { materialId: materialRef.id } });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal mengupload materi');
    } finally { setIsUploading(false); }
  };

  const toggleClass = (cls: string) => {
    selectedClasses.includes(cls) 
      ? setSelectedClasses(selectedClasses.filter(c => c !== cls)) 
      : setSelectedClasses([...selectedClasses, cls]);
  };

  const isDisabled = !title || !desc || !subject || selectedClasses.length === 0 || files.length === 0;

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <AppHeader />
      
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Upload Template</Text>
            <Text style={styles.headerSub}>Pilih dan upload file template materi</Text>
          </View>

          <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
            <Ionicons name="cloud-upload-outline" size={40} color= 'COLORS.textMain' />
            <Text style={styles.uploadTitle}>Upload</Text>
            <Text style={styles.uploadSub}>Pilih file PDF</Text>
          </TouchableOpacity>

          
          {files.length > 0 && (
            <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
              <Text style={styles.headerTitle}>File Terpilih</Text>
              <View style={[styles.uploadBox, { height: 'auto', paddingVertical: 15, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10 }]}>
                <Ionicons name="document-text" size={40} color={COLORS.primary} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontWeight: 'bold' }} numberOfLines={1}>{files[0].name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textSub }}>Siap Upload</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => previewFileContent(files[0].url)} style={{ padding: 8, backgroundColor: COLORS.background, borderRadius: 8 }}>
                    <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFiles([])} style={{ padding: 8, backgroundColor: COLORS.background, borderRadius: 8 }}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.label}>Judul Materi</Text>
            <TextInput value={title} onChangeText={setTitle} style={styles.input} />

            <Text style={styles.label}>Deskripsi</Text>
            <TextInput value={desc} onChangeText={setDesc} multiline style={styles.descInput} textAlignVertical="top" />

            <Text style={styles.label}>Mata Pelajaran</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowSubject(!showSubject)}>
              <Text style={{ color: subject ? '#000' : '#6B7280' }}>{subject || 'Pilih Mata Pelajaran'}</Text>
              <Ionicons name="chevron-down" size={18} />
            </TouchableOpacity>

            {showSubject && (
              <View style={styles.dropdownList}>
                {uniqueSubjects.map((s) => (
                  <TouchableOpacity key={s} onPress={() => { setSubject(s); setShowSubject(false); setSelectedClasses([]); }} style={styles.dropdownItemContainer}>
                    <Text style={styles.dropdownItem}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>Kelas yang Diajar</Text>
            {availableClasses.map((c) => (
              <TouchableOpacity key={c.kelas} style={styles.checkboxRow} onPress={() => toggleClass(c.kelas)}>
                <Ionicons name={selectedClasses.includes(c.kelas) ? 'checkbox' : 'square-outline'} size={20} color={COLORS.primary} />
                <Text style={{ marginLeft: 8 }}>{c.kelas} ({c.tingkat})</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.button, (isDisabled || isUploading) && styles.buttonDisabled]} 
            disabled={isDisabled || isUploading} 
            onPress={handleUpload}
          >
            <Text style={styles.buttonText}>{isUploading ? 'Sedang Mengupload...' : 'Konfirmasi'}</Text>
          </TouchableOpacity>
        </ScrollView>

      </KeyboardAvoidingView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },

  headerText: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  headerSub: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  uploadBox: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    paddingHorizontal: 12,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  uploadSub: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  // fileImage: {
  //   width: '100%',
  //   height: '100%',
  // },

  // deleteBtn: {
  //   position: 'absolute',
  //   top: 4,
  //   right: 4,
  //   backgroundColor: COLORS.white,
  //   borderRadius: 10,
  //   padding: 2,
  // },

  form: {
    paddingHorizontal: 20,
    marginTop: 5,
  },

  label: {
    marginTop: 12,
    marginBottom: 12,
    fontWeight: '600',
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

  descInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: BORDER_RADIUS.s,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    height: 100,
  },

  dropdown: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: BORDER_RADIUS.s,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dropdownList: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
    marginTop: 5,
    borderRadius: 10,
    padding: 10,
  },

  dropdownItem: {
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: '500',
  },

  dropdownItemContainer: {
    paddingVertical: 10,
  },

  // dropdownDivider: {
  //   borderBottomWidth: 1,
  //   borderBottomColor: COLORS.smoothBlue,
  // },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  button: {
    margin: 20,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: BORDER_RADIUS.s,
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: COLORS.gray,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});