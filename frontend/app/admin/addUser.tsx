import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, KeyboardAvoidingView, Platform, ScrollView, GestureResponderEvent} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS } from '@/utils/theme';
import AppHeaderSimple from '@/src/components/common/headerAdmin';
import { useRouter } from 'expo-router';



import { initializeApp, deleteApp } from "firebase/app"; 
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// firebase
import { db, firebaseConfig } from "../../src/config/firebase";
import { collection, getDocs, query, where, doc, setDoc, serverTimestamp} from "firebase/firestore";

export default function AddUser() {
  const router = useRouter();
  
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'guru' | 'siswa'>('siswa');
  const [password, setPassword] = useState('');

  
  const [allClasses, setAllClasses] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

 
  const [nis, setNis] = useState('');
  const [tingkat, setTingkat] = useState<'SMP' | 'SMA'>('SMP');
  const [kelas, setKelas] = useState('');

  
  const [nik, setNik] = useState('');
  const [mapel, setMapel] = useState(''); 
  const [isWalas, setIsWalas] = useState(false);

  
  useEffect(() => {
  const fetchMasterData = async () => {
    try {
      
      const classSnap = await getDocs(collection(db, "class"));
      setAllClasses(classSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
     
      const subjectSnap = await getDocs(collection(db, "subject"));
      setAllSubjects(subjectSnap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,    
        tinkat: doc.data().tinkat 
      })));
    } catch (error) {
      console.error("Gagal ambil data master:", error);
    }
  };
  fetchMasterData();
}, []);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Nama, Email, dan Password wajib diisi!');
      return;
    }

    try {
      
      const secondaryApp = initializeApp(firebaseConfig, "Secondary");
      const secondaryAuth = getAuth(secondaryApp);

      
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      const newUid = userCredential.user.uid;

      
      const userData: any = {
        uid: newUid,
        name,
        email,
        role,
        password, 
        profilePicture: "https://via.placeholder.com/150",
        createdAt: serverTimestamp(),
      };

      if (role === 'siswa') {
        userData.NIS = nis;
        userData.kelas = kelas;
        userData.tinkat = tingkat;
        userData.xp = 0;
        userData.hearts = 3;
      } else {
        userData.NIK = nik;
        userData.mapel = mapel;
        userData.isWalas = isWalas;
        userData.pairs = [];
      }

      await setDoc(doc(db, "users", newUid), userData);
      
      await signOut(secondaryAuth);
      await deleteApp(secondaryApp);

      Alert.alert('Berhasil!', `User ${name} sudah terdaftar di Auth & Database.`);
      router.back();

    } catch (error: any) {
      console.error(error);
      let msg = "Gagal menambahkan user.";
      if (error.code === 'auth/email-already-in-use') msg = "Email sudah terdaftar!";
      Alert.alert('Error', msg);
    }
  };

  function generatePassword(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
  }

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
            <TextInput placeholder="Masukkan nama" value={name} onChangeText={setName} style={styles.input} />

            <Text style={styles.label}>Email</Text>
            <TextInput placeholder="Masukkan email" value={email} onChangeText={setEmail} style={styles.input} />

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
                <TextInput placeholder="Masukkan NIS" value={nis} onChangeText={setNis} keyboardType="numeric" style={styles.input} />
                
                <Text style={styles.label}>Tingkat</Text>
                <View style={styles.roleContainer}>
                  {['SMP', 'SMA'].map((t: any) => (
                    <TouchableOpacity 
                      key={t} 
                      style={[styles.roleButton, tingkat === t && styles.roleActive]} 
                      onPress={() => { setTingkat(t); setKelas(''); }} // Reset kelas jika tingkat ganti
                    >
                      <Text style={[styles.roleText, tingkat === t && { color: COLORS.white }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Kelas</Text>
                <TouchableOpacity 
                  style={styles.input} 
                  onPress={() => setShowDropdown(!showDropdown)}
                >
                  <Text style={{ color: kelas ? COLORS.textMain : COLORS.darkGray }}>
                    {kelas || "Pilih Kelas"}
                  </Text>
                </TouchableOpacity>

                {showDropdown && (
                  <View style={styles.dropdownBox}>
                    {allClasses
                      .filter(c => c.tingkat === tingkat)
                      .map((c, i) => (
                        <TouchableOpacity 
                          key={i} 
                          style={styles.dropdownItem} 
                          onPress={() => { setKelas(c.kelas); setShowDropdown(false); }}
                        >
                          <Text>{c.kelas}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </View>
            )}

            {/* FORM GURU */}
            {role === 'guru' && (
              <View>
                <Text style={styles.label}>NIK</Text>
                <TextInput placeholder="Masukkan NIK" value={nik} onChangeText={setNik} keyboardType="numeric" style={styles.input} />
                
                <Text style={styles.label}>Mata Pelajaran</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                  {allSubjects.map((s, i) => (
                    <TouchableOpacity 
                      key={i} 
                      style={[styles.chip, mapel === s.name && styles.chipActive]}
                      onPress={() => setMapel(s.name)}
                    >
                      <Text style={{ color: mapel === s.name ? COLORS.white : COLORS.primary }}>
                        {s.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>Apakah Wali Kelas?</Text>
                  <Switch value={isWalas} onValueChange={setIsWalas} />
                </View>
              </View>
            )}

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.passwordInput} />
              <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
                <Ionicons name="refresh" size={20} color={COLORS.white}/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Tambah User</Text>
            </TouchableOpacity>
          </View>
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

  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: BORDER_RADIUS.s,
    alignItems: 'center',
  },

  submitText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});