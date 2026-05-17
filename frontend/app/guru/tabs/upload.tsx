import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, FlatList, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS } from '@/utils/theme';
import AppHeader from '../../../src/components/common/guru/appheaderguru';
import * as ImagePicker from 'expo-image-picker';

interface FileItem {
  id: string;
  url: string;
}

export default function UploadMateri() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subject, setSubject] = useState('');
  const [showSubject, setShowSubject] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  const subjects = ['Matematika', 'Fisika', 'Kimia'];
  const classes = ['Kelas 7', 'Kelas 8', 'Kelas 9'];

  const toggleClass = (cls: string) => {
    if (selectedClasses.includes(cls)) {
      setSelectedClasses(selectedClasses.filter(c => c !== cls));
    } else {
      setSelectedClasses([...selectedClasses, cls]);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin diperlukan');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
    });

    if (!result.canceled) {
      setFiles([
        ...files,
        {
          id: Date.now().toString(),
          url: result.assets[0].uri,
        },
      ]);
    }
  };

  const removeFile = (id: string) => {
    Alert.alert(
      'Hapus File',
      'Yakin ingin menghapus file ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setFiles(files.filter(f => f.id !== id));
          }
        }
      ]
    );
  };

  const isDisabled =
    !title || !desc || !subject || selectedClasses.length === 0 || files.length === 0;

  return (
    <View style={styles.root}>
      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Upload Template</Text>
          <Text style={styles.headerSub}>
            Pilih dan upload file template materi
          </Text>
        </View>

        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          <Ionicons name="cloud-upload-outline" size={40} color="#1E3A8A" />
          <Text style={styles.uploadTitle}>Upload</Text>
          <Text style={styles.uploadSub}>Pilih file</Text>
        </TouchableOpacity>

        <FlatList
          data={files}
          horizontal
          keyExtractor={(item) => item.id}
          style={{ paddingHorizontal: 20, marginTop: 10 }}
          renderItem={({ item }) => (
            <View style={styles.fileCard}>
              <Image source={{ uri: item.url }} style={styles.fileImage} />

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeFile(item.id)}
              >
                <Ionicons name="trash" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        />

        <View style={styles.form}>

          <Text style={styles.label}>Judul Materi</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            multiline
            style={styles.descInput}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Mata Pelajaran</Text>

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowSubject(!showSubject)}
          >
            <Text style={{ color: subject ? '#000' : '#6B7280' }}>
              {subject || 'Pilih Mata Pelajaran'}
            </Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          {showSubject && (
            <View style={styles.dropdownList}>
              {subjects.map((s, index) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.dropdownItemContainer,
                    index !== subjects.length - 1 &&
                      styles.dropdownDivider,
                  ]}
                  onPress={() => {
                    setSubject(s);
                    setShowSubject(false);
                  }}
                >
                  <Text style={styles.dropdownItem}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Kelas</Text>
          {classes.map((c) => {
            const active = selectedClasses.includes(c);
            return (
              <TouchableOpacity
                key={c}
                style={styles.checkboxRow}
                onPress={() => toggleClass(c)}
              >
                <Ionicons
                  name={active ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={{ marginLeft: 8 }}>{c}</Text>
              </TouchableOpacity>
            );
          })}

        </View>

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          disabled={isDisabled}
        >
          <Text style={styles.buttonText}>Konfirmasi</Text>
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

  fileCard: {
    width: 90,
    height: 70,
    borderRadius: BORDER_RADIUS.s,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    marginRight: 10,
  },

  fileImage: {
    width: '100%',
    height: '100%',
  },

  deleteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 2,
  },

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

  dropdownDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.smoothBlue,
  },

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