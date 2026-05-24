import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TEXT, subtitle, PROFILE, BTN, scrollContent } from '@/utils/theme';
import AppHeader from '../../../src/components/common/guru/appheaderguru';
import LogoutModal from '@/src/components/common/logout';
import { useRouter } from 'expo-router';
import FilterChips from '@/src/components/dashboard/guru/filter';

//firebase
import { auth, db } from "../../../src/config/firebase";
import { doc, onSnapshot, updateDoc, collection, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfilGuru() {
  const [image, setImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null); 
  const [showLogout, setShowLogout] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');

  const [materiFirebase, setMateriFirebase] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const unsubscribeUser = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserData(data);
          if (data.profilePicture) setImage(data.profilePicture);
        }
      });

      const materiQuery = query(
        collection(db, "material"),
        where("teacherId", "==", user.uid)
      );

      const unsubscribeMateri = onSnapshot(materiQuery, (snapshot) => {
        const listMateri = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
          }) || 'Baru saja'
        }));
        setMateriFirebase(listMateri);
      });

      return () => {
        unsubscribeUser();
        unsubscribeMateri();
      };
    }
  }, []);

  const filteredMateri = materiFirebase.filter(item => 
    selectedSubject === 'Semua' ? true : item.subjectId === selectedSubject
  );

  const handleUpload = async (uri: string) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const fileRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(fileRef, blob);
      const photoURL = await getDownloadURL(fileRef);

      await updateDoc(doc(db, "users", user.uid), {
        profilePicture: photoURL
      });
      Alert.alert("Sukses", "Foto profil guru berhasil diperbarui!");
    } catch (error) {
      Alert.alert("Error", "Gagal mengunggah foto.");
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin dibutuhkan", "Butuh izin galeri.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      handleUpload(uri);
    }
  };

  const handleMateriPress = (materi: any) => {
    router.push({
      pathname: '/guru/detailMateri',
      params: {
        materialId: materi.id, 
      },
    });
  };
  
  const filterOptions = ['Semua', 'Matematika', 'Bahasa Inggris', 'Bahasa Indonesia', 'IPA', 'IPS'];

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[scrollContent, { paddingTop: 50 }]}>
        
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Image source={image ? { uri: image } : require('../../../assets/images/miniong.jpeg')} style={PROFILE.avatar} />
            <TouchableOpacity style={PROFILE.cameraBtn} onPress={pickImage}>
              <Ionicons name="camera" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={[TEXT.bigTitle, { marginTop: 15 }]}>{userData?.name || "Memuat Nama..."}</Text>
          
          <Text style={{ color: COLORS.textSub, fontSize: 14 }}>NIK: {userData?.NIK || "-"}</Text>
          
          {userData?.isHomeroom && (
            <View style={{ backgroundColor: COLORS.secondary, paddingHorizontal: 10, borderRadius: 5, marginTop: 5 }}>
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>WALI KELAS</Text>
            </View>
          )}

          <View style={PROFILE.emailBadge}>
            <Text style={subtitle}>{auth.currentUser?.email}</Text>
          </View>
        </View>

        <TouchableOpacity style={BTN.logout.box} onPress={() => setShowLogout(true)}>
          <Ionicons name="log-out-outline" size={20} color="white"/>
          <Text style={BTN.logout.text}>Log Out</Text>
        </TouchableOpacity>

        <LogoutModal
          visible={showLogout}
          onClose={() => setShowLogout(false)}
          onConfirm={() => {
            setShowLogout(false);
            router.replace('/auth/login');
          }}
        />

        <View style={styles.reportDivider}>
          <View style={styles.line} />
          <Text style={styles.reportTitle}>Daftar Materi</Text>
          <View style={styles.line} />
        </View>

        <FilterChips
          data={filterOptions}
          selected={selectedSubject}
          onSelect={setSelectedSubject}
        />

        <View style={styles.materiList}>
          {filteredMateri.length > 0 ? (
            filteredMateri.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => handleMateriPress(item)}
                style={styles.materiCard}
              >
                <View style={styles.cardLeftAccent} />
                <View style={styles.materiRow}>
                  <View style={styles.iconWrapper}>
                    {/* Pakai icon dokumen jika tidak ada image materi */}
                    <Ionicons name="document-text" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.materiContent}>
                    <Text style={styles.materiTitle}>{item.title}</Text>
                    <Text style={styles.materiSubtitle} numberOfLines={1}>{item.description}</Text>
                    <Text style={styles.materiSubject}>{item.subjectId} - {item.classId}</Text>
                  </View>
                  <View style={styles.dateBadge}>
                    <Ionicons name="calendar-outline" size={12} color={COLORS.primary} />
                    <Text style={styles.materiDate}>{item.date}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: COLORS.textSub, marginTop: 20 }}>
              Belum ada materi yang diupload.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  profileHeader: {
    alignItems: 'center',
    marginTop: -40,
  },

  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
  },

  reportDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.secondary,
  },

  reportTitle: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  materiList: {
    marginTop: 8,
    gap: 16,
  },

  materiCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },

  cardLeftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  materiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: 16,
    paddingLeft: 16,
  },

  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  materiImage: {
    width: 32,
    height: 32,
    tintColor: COLORS.primary,
  },

  materiContent: {
    flex: 1,
    justifyContent: 'center',
  },

  materiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 2,
  },

  materiSubtitle: {
    fontSize: 13,
    color: COLORS.textSub,
    lineHeight: 18,
  },

  materiSubject: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: '500',
  },

  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor:  COLORS.smoothBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  materiDate: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
});