import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../utils/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // 1. Inisialisasi Nilai Animasi
  const circleScale = useRef(new Animated.Value(0)).current; // Skala genangan air
  const mascotScale = useRef(new Animated.Value(0)).current; // Skala maskot muncul
  const mascotTranslateX = useRef(new Animated.Value(0)).current; // Geser maskot ke kiri
  const textTranslateX = useRef(new Animated.Value(50)).current; // Geser teks dari kanan
  const textOpacity = useRef(new Animated.Value(0)).current; // Transparansi teks

  useEffect(() => {
    // 2. Sequence (Urutan Animasi)
    Animated.sequence([
      // A. Lingkaran air muncul (0.3s)
      Animated.timing(circleScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // B. Maskot muncul (pop up)
      Animated.spring(mascotScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      // C. Barengan: Maskot geser ke kiri & Teks muncul dari balik maskot
      Animated.parallel([
        Animated.timing(mascotTranslateX, {
          toValue: -60, // Geser ke kiri
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateX, {
          toValue: 20, // Geser teks ke posisinya
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => {
        router.replace('/auth/login');
      }, 1500);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Efek Genangan Air */}
      <Animated.View style={[styles.circle, { transform: [{ scale: circleScale }] }]} />

      <View style={styles.contentRow}>
        {/* Maskot Lucia */}
        <Animated.View style={{ 
          transform: [
            { scale: mascotScale }, 
            { translateX: mascotTranslateX }
          ] 
        }}>
          <Image 
            source={require('../../assets/images/lucia.png')} 
            style={styles.mascot} 
          />
        </Animated.View>

        {/* Teks Lucia (Muncul dari balik maskot) */}
        <Animated.View style={{ 
          opacity: textOpacity,
          transform: [{ translateX: textTranslateX }],
          position: 'absolute', // Membuatnya seolah di belakang maskot awalnya
          left: '50%',
        }}>
          <Text style={styles.textLucia}>Lucia</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#C5EAFF', // Warna air lebih muda
  },
  contentRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' },
  mascot: { width: 120, height: 120, zIndex: 2 }, // zIndex tinggi agar di atas teks
  textLucia: { fontSize: 50, fontWeight: 'bold', color: COLORS.primary, zIndex: 1 },
});