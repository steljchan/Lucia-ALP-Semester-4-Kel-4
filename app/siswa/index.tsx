import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/utils/theme';

export default function DashboardSiswa() {
  return (
    <View style={styles.container}>
      {/* Konten Dashboard disini*/}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: COLORS.background  ,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A3B5D',
  },
  subtitle: {
    fontSize: 16,
    color: '#76CFFF',
    marginTop: 8,
  },
});