import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Card from './card';
import { COLORS } from '@/utils/theme';

interface ReportCardProps {
  subject: string;
  score: number;
  grade: string;
  image: any;
}

export const ReportCard = ({ subject, score, grade, image }: ReportCardProps) => {
  return (
    //pakai Card lalu, sma buat biar bisa muat 2 row
    <Card style={styles.customCard}>
      
      {/* Gambar Maskot */}
      <Image source={image} style={styles.icon} />
      
      {/* Nilai dan kelas */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{score}</Text>
        <Text style={styles.gradeText}>{grade}</Text>
      </View>
      
      {/* Baris Bawah: Nama Mapel & Tombol */}
      <View style={styles.bottomRow}>
        <Text style={styles.subjectText} numberOfLines={1}>{subject}</Text>
        <TouchableOpacity style={styles.detailBtn}>
          <Text style={styles.detailText}>Detail</Text>
        </TouchableOpacity>
      </View>

    </Card>
  );
};

const styles = StyleSheet.create({
  customCard: {
    padding: 12,   
    marginBottom: 15,
  },
  icon: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 10,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  gradeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 4,
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  subjectText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: 5,
  },
  detailBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  detailText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});