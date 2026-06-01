import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, BORDER_RADIUS } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import AppHeaderSimple from '@/src/components/common/headerAdmin';
import AssignPairModal from '@/src/components/modals/AssignPairModals';
import ClassSelector from '@/src/components/common/admin/classSelector';
import SuccessModal from '@/src/components/modals/SuccessModal';

// firebase
import { db } from '@/src/config/firebase'; 
import { doc, updateDoc, getDoc, getDocs, collection, where, query } from 'firebase/firestore';

export default function EditUser() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.id as string; 
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [nis, setNis] = useState('');
  const [nik, setNik] = useState(''); 
  const [tingkat, setTingkat] = useState<'SMP' | 'SMA'>('SMP');
  const [kelas, setKelas] = useState('');
  const [classId, setClassId] = useState('');
  const [waliKelas, setWaliKelas] = useState('None');
  const [pairs, setPairs] = useState<any[]>([]);

  const [editingName, setEditingName] = useState(false);
  const [editingNis, setEditingNis] = useState(false); // tidak digunakan lagi, tapi tetap ada agar tidak mengubah logic
  const [editingAcademic, setEditingAcademic] = useState(false);
  const [showWali, setShowWali] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [allClasses, setAllClasses] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setEmail(data.email || ''); 
          setPassword(data.password || '');
          setRole(data.role || '');
          setNis(data.nis || '');
          setNik(data.nik || '');
          setTingkat(data.tingkat || 'SMP');
          setKelas(data.kelas || ''); 
          setClassId(data.classId || '');
          setWaliKelas(data.waliKelas || 'None');
          setPairs(data.pairs || []);
        } else {
          Alert.alert("Error", "User tidak ditemukan");
          router.back();
        }
      } catch (error) {
        console.error(error);
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
        setAllClasses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) { console.error(e); }
    };
    fetchClasses();
  }, []);
  
  const handleSave = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanNis = nis.trim();
    const cleanNik = nik.trim();

    if (!cleanName) {
      Alert.alert("Error", "Nama tidak boleh kosong");
      return;
    }

    setSaving(true);
    try {
      const fieldToCheck = role === 'siswa' ? "nis" : "nik";
      const valueToCheck = role === 'siswa' ? cleanNis : cleanNik;

      if (valueToCheck) {
        const duplicateQuery = query(
          collection(db, "users"),
          where(fieldToCheck, "==", valueToCheck)
        );
        const duplicateSnap = await getDocs(duplicateQuery);
        const isDuplicate = duplicateSnap.docs.some(d => d.id !== userId);
        if (isDuplicate) {
          Alert.alert("Error", `${role === 'siswa' ? 'NIS' : 'NIK'} sudah digunakan oleh user lain!`);
          setSaving(false);
          return;
        }
      }

      const userRef = doc(db, "users", userId);
      const updatedData: any = { 
        name: cleanName, 
        email: cleanEmail,
        password: cleanPassword,
        updatedAt: new Date() 
      };

      if (role === 'siswa') {
        updatedData.nis = cleanNis;
        updatedData.tingkat = tingkat;
        updatedData.kelas = kelas; 
        updatedData.classId = classId; 
      } else if (role === 'guru') {
        updatedData.nik = cleanNik;
        updatedData.waliKelas = waliKelas;
        updatedData.pairs = pairs;
      }

      await updateDoc(userRef, updatedData);
      setSuccessMessage(`Data ${cleanName} berhasil diperbarui`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal memperbarui data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <View style={[styles.root, { justifyContent: 'center' }]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <AppHeaderSimple title="Edit User" />

        <View style={styles.card}>
          <Text style={styles.section}>Personal</Text>
          
          <Text style={styles.label}>Nama</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          
          <Text style={styles.label}>Role</Text>
          <Text style={[styles.value, { marginBottom: 10, marginLeft: 12 }]}>
            {role.toUpperCase()}
          </Text>

          {role === 'siswa' && (
            <>
              <Text style={styles.label}>NIS</Text>
              <TextInput
                value={nis}
                onChangeText={setNis}
                keyboardType="numeric"
                style={styles.input}
              />
            </>
          )}

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {role === 'siswa' && (
          <View style={styles.card}>
            <Text style={styles.section}>Academic</Text>
            
            <TouchableOpacity onPress={() => setEditingAcademic(!editingAcademic)}>
              <Row 
                label="Kelas & Tingkat" 
                value={`${kelas} - ${tingkat}`} 
                icon={editingAcademic ? "chevron-up" : "create-outline"} 
              />
            </TouchableOpacity>

            {editingAcademic && (
              <View style={{ padding: 15, backgroundColor: '#f9f9f9' }}>
                <ClassSelector 
                  selectedTingkat={tingkat}
                  onTingkatChange={setTingkat}
                  selectedKelas={kelas}
                  onClassSelect={(selectedName, selectedId) => {
                    setKelas(selectedName);
                    setClassId(selectedId);
                  }}
                />
              </View>
            )}
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
          style={[
            styles.button,
            saving && { opacity: 0.7 }
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <AssignPairModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data: any) => setPairs([...pairs, data])}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Berhasil"
        message={successMessage}
        onClose={() => {
          setShowSuccessModal(false);
          router.replace('/admin');
        }}
      />
    </View>
  );
}

// Komponen pembantu (tidak diubah)
function Row({ label, value, icon }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.value}>{value}</Text>
        {icon && <Ionicons name={icon} size={16} color={COLORS.darkGray} style={{ marginLeft: 6 }} />}
      </View>
    </View>
  );
}

function EditableRow({ label, value, onChange, onBlur, keyboardType }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        value={value} 
        onChangeText={onChange} 
        onBlur={onBlur}
        autoFocus
        keyboardType={keyboardType || 'default'}
        style={[styles.input, { textAlign: 'right', color: COLORS.primary }]} 
      />
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
    marginBottom: 4,
    marginLeft: 12,
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: BORDER_RADIUS.s,
    padding: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: BORDER_RADIUS.s,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
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
    borderColor: COLORS.smoothBlue,
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