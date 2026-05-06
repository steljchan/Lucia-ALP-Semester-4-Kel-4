import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, title, subtitle, containerHeader } from '@/utils/theme';
import AppHeader from '../../../src/components/common/appheaderguru';

export default function DashboardGuru() {
  return (
   <View style={containerHeader}>
      {/* isi kode dsini */}
      <AppHeader/>
      <Text style={title}>INI DASHBOARD Guru</Text>
      <Text style={subtitle}>jangan lupa import subtitle</Text>
    </View>
  );
}