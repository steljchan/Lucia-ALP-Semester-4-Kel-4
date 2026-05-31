import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView,TouchableOpacity, Image} from 'react-native';
import AppHeader from '../../../src/components/common/guru/appheaderGradient';
import {BORDER_RADIUS, COLORS} from '@/utils/theme';
import {useRouter} from 'expo-router';
import FilterChips from '@/src/components/dashboard/guru/filter';

//firebase
import { db } from "@/src/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// const DATA = [
//   { name: 'Renata Ramadhani', nis: '230101', score: 90, mapel: 'Matematika', image: require('@/assets/images/avatar1.jpeg')},
//   { name: 'Lily Hartanto', nis: '230101', score: 80, mapel: 'Bahasa Inggris', image: require('@/assets/images/avatar2.jpeg')},
//   { name: 'Ricky bambang', nis: '230101', score: 100, mapel: 'IPA', image: require('@/assets/images/avatar3.jpeg')},
//   { name: 'Arsya Aulia', nis: '230101', score: 90, mapel: 'Matematika', image: require('@/assets/images/avatar4.jpeg')},
//   { name: 'Budi Budiman', nis: '230101', score: 70, mapel: 'Matematika', image: require('@/assets/images/avatar5.jpeg')},
// ];

export default function NilaiSiswa() {
  const [students, setStudents] = useState<any[]>([]);

  const router = useRouter();
  useEffect(() => {
    const fetchStudents = async () => {
      const q = query(collection(db, "users"), where("role", "==", "siswa"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const [selectedMapel, setSelectedMapel] = useState('Semua');
  const [showSemester, setShowSemester] = useState(false);
  const [semester, setSemester] = useState('Semester 1 2025/2026');

  const [showClass, setShowClass] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Select a Class');

  const filteredData =
    selectedMapel === 'Semua'
      ? students
      : students.filter(item => item.mapel === selectedMapel);

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

        <FilterChips
          data={['Semua', 'Matematika', 'Bahasa Inggris', 'Bahasa Indonesia', 'IPA', 'IPS']}
          selected={selectedMapel}
          onSelect={setSelectedMapel}
        />

        <View style={styles.titleRow}>
          <Text style={styles.title}>Nama Siswa</Text>

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

        {students.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/guru/detailNilai',
                params: {
                  userId: item.id,
                  name: item.name,
                  nis: item.nis,
                  // Ambil field profilePicture dari Firestore
                  photoProfile: item.profilePicture || '', 
                  mapel: selectedMapel,
                },
              })
            }
          >
            <Image
              source={
                item.profilePicture 
                  ? { uri: item.profilePicture } 
                  : require('@/assets/images/avatar1.jpeg') // Gambar default
              }
              style={styles.avatar}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.nis}>NIS: {item.nis}</Text>
            </View>

          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{selectedMapel}</Text>
            </View>
            
            <Text style={styles.score}>{item.score || 0}</Text>
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
    borderRadius: BORDER_RADIUS.s,
    alignItems: 'center',
    marginBottom: 10,
  },

  semesterText: {
    color: COLORS.white,
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
    borderRadius: BORDER_RADIUS.s,
  },

  classText: {
    fontSize: 12,
    color: COLORS.textMain,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: BORDER_RADIUS.m,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
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
    borderRadius: BORDER_RADIUS.s,
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
    borderRadius: BORDER_RADIUS.s,
    marginTop: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    zIndex: 10,
  },
}); 