import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, title, subtitle, container } from '@/utils/theme';

export default function NilaiSiswa() {
  return (
   <View style={container}>
      {/* isi kode dsini */}
      <Text style={title}>INI Nilai siswa</Text>
      <Text style={subtitle}>jangan lupa import subtitle</Text>
    </View>
  );
}

