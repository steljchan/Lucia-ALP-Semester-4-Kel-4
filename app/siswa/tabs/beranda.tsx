import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { COLORS, title, subtitle, container } from '@/utils/theme';

export default function DashboardSiswa() {
  return (
   <View style={container}>
      <Text style={title}>Dashboard Siswa</Text>
      <Text style={subtitle}>Temukan materi dan latihan untuk belajar lebih mudah.</Text>

      <Link href="/siswa/materi/detailMateri" style={styles.button}>
        <Text style={styles.buttonText}>Lihat Detail Materi</Text>
      </Link>

       <Link href="/siswa/toko" style={styles.button}>
        <Text style={styles.buttonText}>Toko</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});