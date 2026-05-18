import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, BORDER_RADIUS} from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import AppHeaderSimple from '@/src/components/common/headerAdmin';
import AssignPairModal from '@/src/components/modals/AssignPairModals';

//firebase
import { db } from '@/src/config/firebase'; 
import { doc, updateDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { Alert, ActivityIndicator } from 'react-native';

export default function EditUser() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ID Dokumen untuk edit
  const userId = params.id as string; 
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

 
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [nis, setNis] = useState('');
  const [nik, setNik] = useState(''); 
  const [kelas, setKelas] = useState('');
  const [waliKelas, setWaliKelas] = useState('None');
  const [pairs, setPairs] = useState<any[]>([]);

  const [editingName, setEditingName] = useState(false);
  const [showClass, setShowClass] = useState(false);
  const [showWali, setShowWali] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [allClasses, setAllClasses] = useState<any[]>([]);
  const [tingkatSiswa, setTingkatSiswa] = useState('SMP');
  
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setRole(data.role || '');
          setNis(data.NIS || '');
          setNik(data.NIK || '');
          setKelas(data.kelas || '');
          setWaliKelas(data.waliKelas || 'None');
          setPairs(data.pairs || []);
        } else {
          Alert.alert("Error", "User tidak ditemukan");
          router.back();
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Gagal mengambil data terbaru");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "class"));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllClasses(list);
      } catch (error) {
        console.error("Gagal ambil daftar kelas:", error);
      }
    };
    
    fetchClasses();
  }, []);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", userId);
      
      const updatedData: any = {
        name,
        updatedAt: new Date(),
      };

      if (role === 'siswa') {
        updatedData.NIS = nis;
        updatedData.kelas = kelas;
      } else if (role === 'guru') {
        updatedData.NIK = nik;
        updatedData.waliKelas = waliKelas;
        updatedData.pairs = pairs;
      }

      await updateDoc(userRef, updatedData);
      
      Alert.alert("Berhasil", "Data user telah diperbarui", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal memperbarui data");
    } finally {
      setSaving(false);
    }
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
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <AppHeaderSimple title="Edit User" />

        <View style={styles.card}>
          <Text style={styles.section}>Personal</Text>
          {!editingName ? (
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Row label="Nama" value={name} icon="create-outline" />
            </TouchableOpacity>
          ) : (
            <EditableRow label="Nama" value={name} onChange={setName} onBlur={() => setEditingName(false)} />
          )}
          <Row label="Role" value={role.toUpperCase()} />
          <Row label="Email" value={params.email} />
        </View>

        {role === 'siswa' && (
          <View style={styles.card}>
            <Text style={styles.section}>Academic</Text>
            <EditableRow label="NIS" value={nis} onChange={setNis} />
            <TouchableOpacity onPress={() => setShowClass(!showClass)}>
              <Row label="Kelas" value={kelas || 'Pilih Kelas'} icon={showClass ? 'chevron-up' : 'chevron-down'}/>
            </TouchableOpacity>
            {showClass && allClasses.map((c) => (
              <TouchableOpacity key={c.id} onPress={() => { setKelas(c.kelas); setShowClass(false); }}>
                <Text style={styles.dropdownItem}>{c.kelas}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {role === 'guru' && (
          <View style={styles.card}>
            <Text style={styles.section}>Teaching</Text>
            <EditableRow label="NIK" value={nik} onChange={setNik} />
            <TouchableOpacity onPress={() => setShowWali(!showWali)}>
              <Row label="Wali Kelas" value={waliKelas} icon={showWali ? 'chevron-up' : 'chevron-down'} />
            </TouchableOpacity>
            {showWali && ['None', ...allClasses.map((c) => c.kelas)].map((c) => (
              <TouchableOpacity key={c} onPress={() => { setWaliKelas(c); setShowWali(false); }}>
                <Text style={styles.dropdownItem}>{c}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.subTitle}>Kelas & Subject</Text>
            {pairs.map((p, i) => (
              <View key={i} style={styles.pairCard}>
                <Text style={styles.pairText}>{p.kelas} - {p.subject}</Text>
                <TouchableOpacity onPress={() => setPairs(pairs.filter((_, index) => index !== i))}>
                  <Ionicons name="close-circle" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.addText}>Tambah Pair</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, saving && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>{saving ? "Menyimpan..." : "Simpan Perubahan"}</Text>
        </TouchableOpacity>
      </ScrollView>

      <AssignPairModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        // tingkatData={TINGKAT_DATA}
        onSubmit={(data: any) => setPairs([...pairs, data])}
      />
    </View>
  );
}

function Row({ label, value, icon }: any) {
  return (
    <View style={styles.row}>
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

function EditableRow({ label, value, onChange }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} style={styles.input} />
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
    backgroundColor: COLORS.white,
    overflow: 'hidden',
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

  label: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: BORDER_RADIUS.s,
    padding: 8,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },

  pairCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    borderColor:COLORS.smoothBlue,
  },

  pairText: {
    fontWeight: '600',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
  },

  addText: {
    margin: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },

  button: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: BORDER_RADIUS.s,
    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});