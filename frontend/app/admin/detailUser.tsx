import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS } from '@/utils/theme';
import AppHeaderSimple from '@/src/components/common/headerAdmin';
import AssignPairModal from '@/src/components/modals/AssignPairModals';

//firebase
import { db } from '@/src/config/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function DetailUser() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const userId = params.id as string;
  const role = params.role as string;

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openPairs, setOpenPairs] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          Alert.alert("Error", "User tidak ditemukan");
          router.back();
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Gagal mengambil detail user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleAddPair = async (data: any) => {
    try {
      const userRef = doc(db, "users", userId);
      const newPairs = [...(userData.pairs || []), data];
      
      await updateDoc(userRef, { pairs: newPairs });
      setUserData({ ...userData, pairs: newPairs }); 
      setShowModal(false);
    } catch (error) {
      Alert.alert("Error", "Gagal mengupdate kelas & subjek");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Hapus User",
      "Apakah Anda yakin ingin menghapus user ini?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "users", userId));
              router.back();
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus user");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        <AppHeaderSimple
          title="Detail User"
          rightText="Edit"
          onRightPress={() => router.push({
            pathname: '/admin/editUser',
            params: { ...userData, id: userId } // Mengirimkan data terbaru
          })}
        />

        <View style={styles.card}>
          <Text style={styles.section}>Personal</Text>
          <Row label="Nama" value={userData?.name || '-'} isFirst />
          <Row label="Email" value={userData?.email || '-'} />
          <Row label="Role" value={role.toUpperCase()} />
          
          {role === 'guru' ? (
            <Row label="NIK" value={userData?.NIK || '-'} isLast />
          ) : (
            <Row label="NIS" value={userData?.NIS || '-'} isLast />
          )}
        </View>

        {role === 'siswa' && (
          <View style={styles.card}>
            <Text style={styles.section}>Academic</Text>
            
            <Row label="Tingkat" value={userData?.tingkat || userData?.tinkat || '-'} isFirst />
            <Row label="Kelas" value={userData?.kelas || '-'} />
            <Row label="XP" value={(userData?.xp || 0).toString()} />
            <Row label="Hearts" value={(userData?.hearts || 0).toString()} />
            <Row label="Dibuat" value={userData?.createdAt?.toDate().toLocaleDateString() || '-'} isLast />
          </View>
        )}

        {role === 'guru' && (
          <View style={styles.card}>
            <Text style={styles.section}>Teaching</Text>
            <Row label="Wali Kelas" value={userData?.waliKelas || 'Bukan Wali Kelas'} isFirst />

            <TouchableOpacity onPress={() => setOpenPairs(!openPairs)}>
              <Row
                label="Kelas & Subject"
                value={openPairs ? "Tutup" : "Lihat Detail"}
                icon={openPairs ? "chevron-up" : "chevron-down"} 
                isLast={!openPairs}
              />
            </TouchableOpacity>

            {openPairs && (
              <View style={styles.dropdown}>
                {userData?.pairs && userData.pairs.length > 0 ? (
                  userData.pairs.map((item: any, i: number) => (
                    <Text key={i} style={styles.dropdownItem}>
                      • {item.kelas} - {item.subject} ({item.tingkat})
                    </Text>
                  ))
                ) : (
                  <Text style={styles.dropdownItem}>Belum ada kelas yang di-assign.</Text>
                )}
              </View>
            )}
          </View>
        )}

        <View style={styles.actions}>
          {role === 'guru' && (
            <TouchableOpacity style={styles.primaryButton} onPress={() => setShowModal(true)}>
              <Text style={styles.primaryButtonText}>Assign Kelas & Subject</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Hapus User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AssignPairModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddPair}
      />
    </View>
  );
}

function Row({ label, value, icon, isFirst, isLast }: any) {
  return (
    <View
      style={[
        styles.row,
        isFirst && styles.rowTop,
        isLast && styles.rowBottom,
      ]}
    >
      <Text style={styles.label}>{label}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.value}>{value}</Text>
        {icon && (
          <Ionicons name={icon} size={16} color={COLORS.darkGray} style={{ marginLeft: 6 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: BORDER_RADIUS.s,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    elevation: 2,
  },

  section: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    padding: 12,
    fontWeight: '700',
  },

  subTitle: {
    marginTop: 10,
    marginLeft: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  row: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },

  rowTop: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  rowBottom: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 0,
  },

  label: {
    color: COLORS.textSub,
    fontSize: 12,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },

  pairCard: {
    marginHorizontal: 12,
    marginTop: 8,
    padding: 10,
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
  },

  pairText: {
    fontWeight: '600',
  },

  dropdown: {
    padding: 12,
    backgroundColor: COLORS.gray,
  },

  dropdownItem: {
    fontSize: 13,
    marginBottom: 6,
  },

  actions: {
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'flex-start',
    gap: 14,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.s,
    width: '100%',
    alignItems: 'center',
  },

  primaryButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },

  deleteButton: {
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.s,
    width: '100%',
    alignItems: 'center',
  },

  deleteButtonText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 14,
  },
});