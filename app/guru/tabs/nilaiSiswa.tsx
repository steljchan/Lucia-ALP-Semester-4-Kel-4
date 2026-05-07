import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image
} from 'react-native';
import AppHeader from '../../../src/components/common/guru/appheaderguruWOsearch';
import { COLORS } from '@/utils/theme';
import { useRouter } from 'expo-router';

const DATA = [
  { name: 'Renata Ramadhani', nis: '230101', score: 90, mapel: 'Matematika', },
  { name: 'Lily Hartanto', nis: '230101', score: 80, mapel: 'Bahasa Inggris' },
  { name: 'Ricky bambang', nis: '230101', score: 100, mapel: 'IPA' },
  { name: 'Arsya Aulia', nis: '230101', score: 90, mapel: 'Matematika' },
  { name: 'Budi Budiman', nis: '230101', score: 70, mapel: 'Matematika' },
];

export default function NilaiSiswa() {
  const router = useRouter();

  const [selectedMapel, setSelectedMapel] = useState('Semua');
  const [showSemester, setShowSemester] = useState(false);
  const [semester, setSemester] = useState('Semester 1 2025/2026');

  const [showClass, setShowClass] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Select a Class');

  const filteredData =
    selectedMapel === 'Semua'
      ? DATA
      : DATA.filter(item => item.mapel === selectedMapel);

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ position: 'relative', marginBottom: 12 }}>
          <TouchableOpacity style={styles.semesterBox}
            onPress={() => {
              setShowSemester(!showSemester);
              setShowClass(false);
            }}>
            <Text style={styles.semesterText}>{semester}</Text>
          </TouchableOpacity>

          {showSemester && (
            <View style={styles.dropdownAbsolute}>
              {['Semester 1 2025/2026', 'Semester 2 2025/2026'].map((s, i) => (
                <TouchableOpacity key={i} style={styles.dropdownItemBox}
                  onPress={() => {
                    setSemester(s);
                    setShowSemester(false);
                  }}>
                  <Text style={styles.dropdownItem}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* FILTER (SCROLL HORIZONTAL) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {['Semua', 'Matematika', 'Bahasa Inggris', 'IPA'].map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedMapel(item)}
              style={[
                styles.filterBtn,
                selectedMapel === item && styles.filterActive
              ]}
            >
              <Text style={[styles.filterText, selectedMapel === item && { color: COLORS.white }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TITLE + CLASS */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Nama Siswa</Text>

          {/* CLASS BUTTON + DROPDOWN */}
          <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={styles.classBtn}
            onPress={() => {
              setShowClass(!showClass);
              setShowSemester(false);
            }}
          >
            <Text style={styles.classText}>{selectedClass}</Text>
          </TouchableOpacity>

          {showClass && (
            <View style={styles.dropdownAbsolute}>
              {['Kelas 7', 'Kelas 8', 'Kelas 9'].map((c, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.dropdownItemBox}
                  onPress={() => {
                    setSelectedClass(c);
                    setShowClass(false);
                  }}
                >
                  <Text style={styles.dropdownItem}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

          )}
        </View>
        </View>

        {/* LIST SISWA */}
        {filteredData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/guru/detailNilai',
                params: {
                  name: item.name,
                  nis: item.nis,
                  score: item.score,
                  mapel: item.mapel,
                },
              })
            }
          >
            <Image
              source={require('@/assets/images/lucia.png')}
              style={styles.avatar}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.nis}>NIS: {item.nis}</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.mapel}</Text>
              </View>
              <Text style={styles.score}>{item.score}</Text>
              <Text style={styles.scoreLabel}>Score</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  semesterBox: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  semesterText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 10,
  },

  filterActive: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },

  classBtn: {
    backgroundColor: COLORS.smoothBlue,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  classText: {
    fontSize: 12,
    color: COLORS.textMain,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },

  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
  },

  name: {
    fontWeight: 'bold',
    color: COLORS.textMain,
  },

  nis: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  badge: {
    backgroundColor: COLORS.smoothBlue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 5,
  },

  badgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },

  scoreLabel: {
    fontSize: 10,
    color: COLORS.textSub,
  },

  dropdownItemBox: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.primary,
  },

  dropdownItem: {
    color: COLORS.textMain,
    textAlign: 'center',
    fontWeight: '500',
  },

  dropdownAbsolute: {
    position: 'absolute',
    top: '100%',  
    left: 0,
    right: 0,  
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    zIndex: 10,
  },
}); 