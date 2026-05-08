import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, containerHeader, TEXT, subtitle, PROFILE, BTN, scrollContent, SafeArea} from '@/utils/theme';
import AppHeader from '../../../src/components/common/guru/appheaderguru';
import LogoutModal from '@/src/components/common/logout';
import Card from '../../../src/components/common/card';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const MATERI = [
  {
    title: 'Mengenal Mata Uang',
    subtitle: 'Materi dasar tentang uang',
    date: '12 Mei 2026',
    image: require('../../../assets/images/lucia.png'),
  },
  {
    title: 'Perhitungan Uang',
    subtitle: 'Belajar menghitung uang',
    date: '10 Mei 2026',
    image: require('../../../assets/images/lucia.png'),
  },
];

export default function ProfilGuru() {
  const [image, setImage] = useState<string | null>(null);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

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
    <SafeAreaView style={SafeArea}>
      <View style={[containerHeader, { justifyContent: 'flex-start', alignItems: 'stretch' }]}>
        <AppHeader/>

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
            
            </View>

            <Text style={[TEXT.bigTitle, { marginTop: 15 }]}>Arsya Aulia</Text>          
            <View style={PROFILE.emailBadge}>
              <Text style={subtitle}>Arsya@teacher.SLBN1.ac.id</Text>
            </View>
          </View>

          {/* LOGOUT */}
          <TouchableOpacity 
            style={BTN.logout.box}
            onPress={() => setShowLogout(true)}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={BTN.logout.text}>Log Out</Text>
          </TouchableOpacity>

          <LogoutModal
            visible={showLogout}
            onClose={() => setShowLogout(false)}
            onConfirm={() => {
              setShowLogout(false);
              router.replace('/auth/login'); 
            }}
          />

          <View style={styles.reportDivider}>
            <View style={styles.line} />
            <Text style={styles.reportTitle}>Daftar Materi</Text>
            <View style={styles.line} />
          </View>

          <View>
          {MATERI.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{ marginBottom: 15 }}
              onPress={() => Alert.alert(item.title)}
            >
              <Card style={styles.materiRow}>
                
                {/* GAMBAR KIRI */}
                <Image source={item.image} style={styles.materiImage} />

                {/* KONTEN KANAN */}
                <View style={styles.materiContent}>
                  
                  {/* TANGGAL */}
                  <Text style={styles.materiDate}>{item.date}</Text>

                  {/* JUDUL */}
                  <Text style={styles.materiTitle}>{item.title}</Text>

                  {/* SUBTITLE */}
                  <Text style={styles.materiSubtitle}>{item.subtitle}</Text>

                </View>

              </Card>
            </TouchableOpacity>
          ))}
        </View>

        </ScrollView>
      </View>
    </SafeAreaView>
    
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

  reportDivider: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginVertical: 25 
  },

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

  materiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },

  materiImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },

  materiContent: {
    flex: 1,
    justifyContent: 'center',
  },

  materiDate: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 10,
    color: COLORS.textSub,
  },

  materiTitle: {
    fontWeight: 'bold',
    color: COLORS.textMain,
  },

  materiSubtitle: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 2,
  },
});