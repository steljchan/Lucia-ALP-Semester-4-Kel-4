import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, KeyboardAvoidingView, Platform, ScrollView, GestureResponderEvent, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BTN, BORDER_RADIUS } from '@/utils/theme';
import AppHeaderSimple from '@/src/components/common/headerAdmin';
import { useRouter } from 'expo-router';
import ClassSelector from '@/src/components/common/admin/classSelector';
// firebase
import { initializeApp, deleteApp, getApp } from "firebase/app"; 
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db, firebaseConfig } from "../../src/config/firebase";
import { collection, getDocs, query, where, doc, setDoc, serverTimestamp} from "firebase/firestore";
import AssignPairModal from '@/src/components/modals/AssignPairModals';
import SuccessModal from '@/src/components/modals/SuccessModal';

export default function AddUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [pairs, setPairs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'guru' | 'siswa'>('siswa');
  const [password, setPassword] = useState('');

  const [allSubjects, setAllSubjects] = useState<any[]>([]);
 
  const [nis, setNis] = useState('');
  const [tingkat, setTingkat] = useState<'SMP' | 'SMA'>('SMP');
  const [kelas, setKelas] = useState('');
  const [classId, setClassId] = useState('');

  const [nik, setNik] = useState('');
  const [mapel, setMapel] = useState(''); 
  const [isWalas, setIsWalas] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    nis: '',
    nik: '',
    password: '',
    kelas: '',
  });

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('siswa');
    setNis('');
    setNik('');
    setKelas('');
    setPairs([]);
    setIsWalas(false);
    setMapel('');
    setClassId('');
    setErrors({ name: '', nis: '', nik: '', password: '', kelas: '' });
  };

  useEffect(() => {
    if (name.trim() === "") {
      setEmail("");
      return;
    }
    const firstName = name.trim().split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
    const domain = role === 'siswa' ? "@siswa.lucia.com" : "@guru.lucia.com";
    setEmail(`${firstName}${domain}`);
  }, [name, role]);
  
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const subjectSnap = await getDocs(collection(db, "subject"));
        setAllSubjects(subjectSnap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,    
          tingkat: doc.data().tingkat 
        })));
      } catch (error) {
        console.error("Gagal ambil data master:", error);
      }
    };
    fetchMasterData();
  }, []);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 3) + 6; // 6,7,8
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    let secondaryApp = null;

    try {
      const newErrors = {
        name: '',
        nis: '',
        nik: '',
        password: '',
        kelas: '',
      };

      if (!name.trim()) newErrors.name = 'Nama wajib diisi';
      if (!password.trim()) newErrors.password = 'Password wajib diisi';

      if (role === 'siswa') {
        if (!nis.trim()) newErrors.nis = 'NIS wajib diisi';
        if (!kelas) newErrors.kelas = 'Kelas wajib dipilih';
      }

      if (role === 'guru') {
        if (!nik.trim()) newErrors.nik = 'NIK wajib diisi';
      }

      setErrors(newErrors);
      if (Object.values(newErrors).some(error => error !== '')) return;

      const cleanName = name.trim();
      const cleanNis = nis.trim();
      const cleanNik = nik.trim();
      const cleanPassword = password.trim();

      if (!name || !email || !password) {
        Alert.alert('Error', 'Nama dan Password wajib diisi!');
        return;
      }

      const fieldToCheck = role === 'siswa' ? 'nis' : 'nik';
      const valueToCheck = role === 'siswa' ? cleanNis : cleanNik;

      if (!valueToCheck) {
        Alert.alert('Error', `${role === 'siswa' ? 'NIS' : 'NIK'} wajib diisi!`);
        return;
      }

      const duplicateQuery = query(collection(db, 'users'), where(fieldToCheck, '==', valueToCheck));
      const duplicateSnap = await getDocs(duplicateQuery);
      if (!duplicateSnap.empty) {
        Alert.alert('Error', `${role === 'siswa' ? 'NIS' : 'NIK'} sudah terdaftar di sistem.`);
        return;
      }

      // Cegah error duplicate app
      try {
        secondaryApp = getApp('Secondary');
      } catch {
        secondaryApp = initializeApp(firebaseConfig, 'Secondary');
      }

      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, cleanPassword);
      const newUid = userCredential.user.uid;

      const userData: any = {
        uid: newUid,
        name: cleanName,
        email,
        role,
        password: cleanPassword,
        profilePicture: 'https://firebasestorage.googleapis.com/v0/b/lucia-4b190.firebasestorage.app/o/profilePictures%2Fpfp%20icon.jpeg?alt=media&token=9b9255dc-d61e-4b5b-b5cf-43ae9b786fa4',
        createdAt: serverTimestamp(),
      };

      if (role === 'siswa') {
        userData.nis = nis;
        userData.classId = classId;
        userData.kelas = kelas;
        userData.tingkat = tingkat;
        userData.hearts = 3;
        userData.xp = 0;
        userData.coin = 0;
      } else {
        userData.nik = nik;
        userData.mapel = mapel;
        userData.isWalas = isWalas;
        userData.pairs = pairs;
      }

      await setDoc(doc(db, 'users', newUid), userData);
      await signOut(secondaryAuth);
      await deleteApp(secondaryApp);
      secondaryApp = null;

      setSuccessMessage(`User ${cleanName} berhasil ditambahkan`);
      setShowSuccessModal(true);
      resetForm();
    } catch (error: any) {
      console.error(error);
      let msg = 'Gagal menambahkan user.';
      if (error.code === 'auth/email-already-in-use') msg = 'Email sudah terdaftar!';
      Alert.alert('Error', msg);
    } finally {
      if (secondaryApp) {
        try { await deleteApp(secondaryApp); } catch (e) { console.warn(e); }
      }
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <AppHeaderSimple title="Tambah User" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 50 }} 
          keyboardShouldPersistTaps="handled" 
        >
          <View style={styles.card}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              placeholder="Masukkan nama"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              style={[styles.input, errors.name && styles.inputError]}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

            <Text style={styles.label}>Email (Otomatis)</Text>
            <TextInput 
              placeholder="Email akan terisi otomatis" 
              value={email} 
              editable={false} 
              style={[styles.input, { paddingLeft: 14 }]} 
            />

            <Text style={styles.label}>Role</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity style={[styles.roleButton, role === 'guru' && styles.roleActive]} onPress={() => setRole('guru')}>
                <Ionicons name="school-outline" size={18} color={role === 'guru' ? COLORS.white : COLORS.primary} />
                <Text style={[styles.roleText, role === 'guru' && { color: COLORS.white }]}>Guru</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.roleButton, role === 'siswa' && styles.roleActive]} onPress={() => setRole('siswa')}>
                <Ionicons name="person-outline" size={18} color={role === 'siswa' ? COLORS.white : COLORS.primary} />
                <Text style={[styles.roleText, role === 'siswa' && { color: COLORS.white }]}>Siswa</Text>
              </TouchableOpacity>
            </View>

            {role === 'siswa' && (
              <View>
                <Text style={styles.label}>NIS</Text>
                <TextInput
                  placeholder="Masukkan NIS"
                  value={nis}
                  onChangeText={(text) => {
                    setNis(text);
                    if (errors.nis) setErrors(prev => ({ ...prev, nis: '' }));
                  }}
                  style={[styles.input, errors.nis && styles.inputError]}
                />
                {errors.nis && <Text style={styles.errorText}>{errors.nis}</Text>}
                
                <ClassSelector 
                  selectedTingkat={tingkat}
                  onTingkatChange={setTingkat}
                  selectedKelas={kelas}
                  onClassSelect={(name, id) => {
                    setKelas(name);
                    setClassId(id);
                    if (errors.kelas) setErrors(prev => ({ ...prev, kelas: '' }));
                  }}
                />
                {errors.kelas && <Text style={styles.errorText}>{errors.kelas}</Text>}
              </View>
            )}
            
            {role === 'guru' && (
              <View>
                <Text style={styles.label}>NIK</Text>
                <TextInput
                  placeholder="Masukkan NIK"
                  value={nik}
                  onChangeText={(text) => {
                    setNik(text);
                    if (errors.nik) setErrors(prev => ({ ...prev, nik: '' }));
                  }}
                  keyboardType="numeric"
                  style={[styles.input, errors.nik && styles.inputError]}
                />
                {errors.nik && <Text style={styles.errorText}>{errors.nik}</Text>}
                
                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>Apakah Wali Kelas?</Text>
                  <Switch value={isWalas} onValueChange={setIsWalas} />
                </View>

                <Text style={styles.label}>Assign Kelas & Subject</Text>
                {pairs.map((p, i) => (
                  <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 5 }}>
                    <Text style={{ fontSize: 12 }}>{p.kelas} - {p.subject} ({p.tingkat})</Text>
                    <TouchableOpacity onPress={() => setPairs(pairs.filter((_, idx) => idx !== i))}>
                      <Ionicons name="close-circle" size={18} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                ))}
                
                <TouchableOpacity 
                  style={[styles.roleButton, { borderStyle: 'dashed', marginTop: 5 }]} 
                  onPress={() => setShowModal(true)}
                >
                  <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.roleText}>Tambah Pair</Text>
                </TouchableOpacity>

                <AssignPairModal
                  visible={showModal}
                  onClose={() => setShowModal(false)}
                  onSubmit={(data: any) => setPairs([...pairs, data])}
                />
              </View>
            )}

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput 
                placeholder="Password" 
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                style={[styles.passwordInput, errors.password && styles.inputError]}
              />
              <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
                <Ionicons name="refresh" size={20} color={COLORS.white}/>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity
              style={[BTN.primary.box, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={BTN.primary.text}>Tambah User</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: 10,
    marginTop: -10,
    marginBottom: 14,
    backgroundColor: '#F9FAFB'
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7'
  },
  card: {
    marginTop: 16, 
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.s,
    padding: 20,
    shadowColor: COLORS.darkGray,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: COLORS.textMain,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: 6,
  },
  roleActive: {
    backgroundColor: COLORS.primary,
  },
  roleText: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  passwordRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 12,
  },
  generateButton: {
    width: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 13,
    color: COLORS.textMain,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
  },
});