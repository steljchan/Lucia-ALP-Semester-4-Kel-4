import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, containerHeader, TEXT, subtitle, PROFILE, BTN, scrollContent} from '@/utils/theme';
import AppHeaderWOsearch from '../../../src/components/common/appheaderWOsearch';
import Card from '../../../src/components/common/card';

// data report dummy
const REPORT_DATA = [
  { id: '1', title: "Bahasa Inggris", score: 96, grade: "A+", image: require('../../../assets/images/maskot1.png') },
  { id: '2', title: "Matematika", score: 96, grade: "A+", image: require('../../../assets/images/maskotMTK.png') },
  { id: '3', title: "IPA", score: 96, grade: "A+", image: require('../../../assets/images/maskot1.png') },
  { id: '4', title: "Indonesia", score: 96, grade: "A+", image: require('../../../assets/images/maskotMTK.png') },
];

// komponen report card
interface ReportCardProps {
  subject: string;
  score: number;
  grade: string;
  image: any;
}

const ReportCard = ({ subject, score, grade, image }: ReportCardProps) => {
  return (
    <Card style={styles.reportCardWrapper}>
      <Image source={image} style={styles.reportIcon} />
      <View style={styles.scoreRow}>
        <Text style={styles.scoreNumber}>{score}</Text>
        <Text style={styles.scoreGrade}>{grade}</Text>
      </View>
      <View style={styles.reportFooter}>
        <Text style={styles.subjectText} numberOfLines={1}>{subject}</Text>
        <TouchableOpacity style={styles.detailBtn}>
          <Text style={styles.detailText}>Detail</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

// profile
export default function ProfilSiswa() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin dibutuhkan", "Kami butuh izin akses galeri untuk mengubah foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={[containerHeader, { justifyContent: 'flex-start', alignItems: 'stretch' }]}>
      <AppHeaderWOsearch />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[scrollContent, { paddingTop: 50 }]}>
        
        {/*AVATAR & INFO */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Image
              source={image ? { uri: image } : require('../../../assets/images/miniong.jpeg')}
              style={PROFILE.avatar} 
            />
            <TouchableOpacity style={PROFILE.cameraBtn} onPress={pickImage}>
              <Ionicons name="camera" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            
            <View style={styles.badge}>
              <Text style={styles.badgeText}>SMP 7</Text>
            </View>
          </View>

          <Text style={[TEXT.bigTitle, { marginTop: 15 }]}>Arstellian</Text>
          <Text style={PROFILE.studentId}>230101</Text> 
          
          <View style={PROFILE.emailBadge}>
             <Text style={subtitle}>Rena@student.SLBN1.ac.id</Text>
          </View>
        </View>

        {/* XP, RANK, QUIZ */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="star" size={24} color={COLORS.textMain} />
            <Text style={styles.statLabel}>XP</Text>
            <Text style={styles.statValue}>200</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Ionicons name="podium" size={24} color={COLORS.textMain} />
            <Text style={styles.statLabel}>Rank</Text>
            <Text style={styles.statValue}>11</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="document-text" size={24} color={COLORS.textMain} />
            <Text style={styles.statLabel}>Quiz Selesai</Text>
            <Text style={styles.statValue}>14</Text>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity 
          style={BTN.logout.box} // <-- Pakai ini
          onPress={() => Alert.alert("Logout", "Apa kamu yakin?")}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={BTN.logout.text}>Log Out</Text>
        </TouchableOpacity>

        {/* REPORT GRID  */}
        <View style={styles.reportDivider}>
          <View style={styles.line} />
          <Text style={styles.reportTitle}>Report</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.reportGrid}>
          {REPORT_DATA.map((item) => (
            <ReportCard 
              key={item.id}
              subject={item.title} 
              score={item.score} 
              grade={item.grade} 
              image={item.image} 
            />
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    marginTop: -40, 
  },

  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  
  badge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 15,
  },

  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 25,
    borderRadius: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
  },

  statBox: { 
    flex: 1, 
    alignItems: 'center' 
  },

  statBorder: { 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#EEE' 
  },

  statLabel: { 
    fontSize: 12, 
    color: COLORS.textMain, 
    marginVertical: 2 },

  statValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: COLORS.secondary 
  },

  
  reportDivider: { 
    flexDirection: 'row', 
    alignItems: 'center',
     marginVertical: 25 },

  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: COLORS.secondary },
  reportTitle: { marginHorizontal: 15, fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },

  reportCardWrapper: {
    width: '48%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 25,
    alignItems: 'flex-start', 
  },

  reportIcon: { 
    width: 60, 
    height: 60, 
    resizeMode: 'contain' 
  },

  scoreRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    marginVertical: 5 
  },
  
  scoreNumber: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#64B5F6' 
  },

  scoreGrade: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#64B5F6', 
    marginLeft: 4, 
    marginBottom: 4 
  },

  reportFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%', 
    marginTop: 5 
  },

  subjectText: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#333', 
    flex: 1 
  },

  detailBtn: { 
    backgroundColor: COLORS.secondary, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 10 },

  detailText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold' },
});