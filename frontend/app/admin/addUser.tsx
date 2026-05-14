import React, { useState } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS } from '@/utils/theme';
import AppHeaderSimple from '@/src/components/common/headerAdmin';
import { useRouter } from 'expo-router';

export default function AddUser() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'guru' | 'siswa'>('siswa');
  const [password, setPassword] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

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
      <AppHeaderSimple title="Tambah User" />

      <View style={styles.card}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          placeholder="Masukkan nama"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Masukkan email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'guru' && styles.roleActive]}
            onPress={() => setRole('guru')}>
            <Ionicons name="school-outline" size={18} color={role === 'guru' ? COLORS.white : COLORS.primary} />
            <Text style={[styles.roleText, role === 'guru' && { color: COLORS.white }]}>Guru</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === 'siswa' && styles.roleActive]}
            onPress={() => setRole('siswa')}>
            <Ionicons name="person-outline" size={18} color={role === 'siswa' ? COLORS.white : COLORS.primary} />
            <Text style={[styles.roleText, role === 'siswa' && { color: COLORS.white }]}>Siswa</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            placeholder="Generate password"
            value={password}
            editable={false}
            style={styles.passwordInput}/>

          <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
            <Ionicons name="refresh" size={20} color={COLORS.white}/>
          </TouchableOpacity>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Kirim password ke email</Text>
          <Switch value={sendEmail} onValueChange={setSendEmail}/>
        </View>

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
    backgroundColor: COLORS.background,
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