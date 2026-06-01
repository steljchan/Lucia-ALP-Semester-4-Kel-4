import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AppHeader from '../../../src/components/common/guru/appheaderGradient';
import { BORDER_RADIUS, COLORS } from '@/utils/theme';
import { useRouter } from 'expo-router';
import FilterChips from '@/src/components/dashboard/guru/filter';
import { Ionicons } from '@expo/vector-icons';

// firebase
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/src/config/firebase";

export default function NilaiSiswa() {
  const router = useRouter();
  
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  
  const [teacherPairs, setTeacherPairs] = useState<any[]>([]);

  
  const [search, setSearch] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(''); 
  
  const [showSemester, setShowSemester] = useState(false);
  const [semester, setSemester] = useState('Semester 1 2025/2026');
  const [showClass, setShowClass] = useState(false);


  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const pairsData = userDoc.data().pairs || [];
          setTeacherPairs(pairsData);
          
          
          if (pairsData.length > 0) {
            setSelectedMapel(pairsData[0].subject);
            setSelectedClass(pairsData[0].kelas);
            setSelectedClassId(pairsData[0].classId || pairsData[0].kelas); 
          }
        }
      } catch (error) {
        console.error("Gagal ambil data guru:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, []);

  
  const uniqueSubjects = [...new Set(teacherPairs.map(p => p.subject))];

  const availableClasses = teacherPairs.filter(p => p.subject === selectedMapel);

  
  useEffect(() => {
    if (availableClasses.length > 0) {
      const isStillAvailable = availableClasses.some(c => c.kelas === selectedClass);
      if (!isStillAvailable) {
        setSelectedClass(availableClasses[0].kelas);
        setSelectedClassId(availableClasses[0].classId || availableClasses[0].kelas);
      }
    } else {
      setSelectedClass('');
      setSelectedClassId('');
    }
  }, [selectedMapel, teacherPairs]);

  
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        return;
      }

      try {
        setLoading(true);

        const q = query(
          collection(db, "users"), 
          where("role", "==", "siswa"),
          where("kelas", "==", selectedClass)
        );
        
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(data);
      } catch (error) {
        console.error("Gagal ambil data siswa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  // Handle Search Siswa berdasarkan Nama atau NIS
  const filteredData = students.filter((item) => {
    const matchSearch =
      (item.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (item.nis?.toLowerCase() || "").includes(search.toLowerCase());

    return matchSearch;
  });

  return (
    <View style={styles.container}>
      <AppHeader search={search} setSearch={setSearch} />

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={{ position: 'relative', marginBottom: 12 }}>
          <TouchableOpacity 
            style={styles.semesterBox}
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
                  onPress={() => { setSemester(s); setShowSemester(false); }}>
                  <Text style={styles.dropdownItem}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        
        <FilterChips
          data={uniqueSubjects}
          selected={selectedMapel}
          onSelect={setSelectedMapel}
        />

        <View style={styles.titleRow}>
          <Text style={styles.title}>Daftar Siswa</Text>
          
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              style={styles.classBtn}
              onPress={() => {
                setShowClass(!showClass);
                setShowSemester(false);
              }}
            >
              <Text style={styles.classText}>{selectedClass || 'Pilih Kelas'}</Text>
            </TouchableOpacity>

            {/* Dropdown Kelas dinamis berdasarkan mapel pilihan guru saat ini */}
            {showClass && (
              <View style={styles.dropdownAbsolute}>
                {availableClasses.map((c: any, i: number) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.dropdownItemBox}
                    onPress={() => {
                      setSelectedClass(c.kelas);
                      setSelectedClassId(c.classId || c.kelas);
                      setShowClass(false);
                    }}
                  >
                    <Text style={styles.dropdownItem}>{c.kelas} ({c.tingkat})</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : filteredData.length > 0 ? (
          filteredData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/guru/detailNilai',
                  params: {
                    userId: item.id, 
                    name: item.name,
                    nis: item.nis,
                    mapel: selectedMapel, // Mengirim mapel aktif ke detail view guru
                  },
                })
              }
            >
              <Image
                source={item.profilePicture ? { uri: item.profilePicture } : require('@/assets/images/avatar1.jpeg')}
                style={styles.avatar}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name || "Siswa"}</Text>
                <Text style={styles.nis}>NIS: {item.nis || "-"}</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{selectedMapel}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.gray} style={{ marginTop: 4 }} />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={40} color={COLORS.darkGray} />
            <Text style={styles.emptyText}>Tidak ada siswa di kelas ini</Text>
          </View>
        )}
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

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },

  emptyText: {
    marginTop: 8,
    color: COLORS.darkGray,
    fontSize: 14,
  },
}); 