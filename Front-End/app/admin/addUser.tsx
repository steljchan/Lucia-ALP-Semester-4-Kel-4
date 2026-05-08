import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS } from '@/utils/theme';
import { useRouter } from 'expo-router';

export default function AddUser() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'guru' | 'siswa'>('siswa');
  const [password, setPassword] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  // 🔥 Generate password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  // 🔥 VALIDASI
  const handleSubmit = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Semua field wajib diisi!');
      return;
    }

    console.log({
      name,
      email,
      role,
      password,
      sendEmail,
    });

    Alert.alert('Success', 'User berhasil ditambahkan!');
  };

  return (
    <View style={styles.root}>

      {/* 🔥 HEADER */}
      <View style={styles.headerRow}>

        {/* BACK */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        {/* TITLE */}
        <Text style={styles.headerTitle}>Tambah User</Text>
        <View style={{ width: 40 }} /> {/* Placeholder untuk buat title tetap di tengah */}
      </View>

      {/* 🔥 FORM */}
      <View style={styles.card}>

        {/* Nama */}
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          placeholder="Masukkan nama"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Masukkan email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        {/* Role */}
        <Text style={styles.label}>Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'guru' && styles.roleActive]}
            onPress={() => setRole('guru')}
          >
            <Ionicons name="school-outline" size={18} color={role === 'guru' ? COLORS.white : COLORS.primary} />
            <Text style={[styles.roleText, role === 'guru' && { color: COLORS.white }]}>
              Guru
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === 'siswa' && styles.roleActive]}
            onPress={() => setRole('siswa')}
          >
            <Ionicons name="person-outline" size={18} color={role === 'siswa' ? COLORS.white : COLORS.primary} />
            <Text style={[styles.roleText, role === 'siswa' && { color: COLORS.white }]}>
              Siswa
            </Text>
          </TouchableOpacity>
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            placeholder="Generate password"
            value={password}
            editable={false}
            style={styles.passwordInput}
          />

          <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
            <Ionicons name="refresh" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Switch */}
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Kirim password ke email</Text>
          <Switch value={sendEmail} onValueChange={setSendEmail} />
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Tambah User</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EAF3FF',
  },

  // 🔥 HEADER
  headerRow: {
    marginTop: 90,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMain,
    textAlign: 'center',
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  // 🔥 FORM CARD
  card: {
    marginTop: 60, // 🔥 lebih turun
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.l,
    padding: 20,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    borderRadius: 10,
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
    borderColor: '#E5E7EB',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 12,
  },

  // 🔥 FIX ukuran sama tinggi input
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
    color: '#374151',
  },

  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  submitText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});