import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function NavbarBaseAdmin({ navigation }: any) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">

      {/* 🔥 NAVBAR BACKGROUND */}
      <View style={styles.navbar} />

      {/* 🔥 FLOATING BUTTON (QRIS STYLE) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('addUser')}
        activeOpacity={0.8}
      >
        <Ionicons name="person-add" size={30} color={COLORS.white} />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },

  navbar: {
    width: '100%',
    height: 70,
    backgroundColor: COLORS.secondary,

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  // 🔥 TOMBOL QRIS STYLE
  fab: {
    position: 'absolute',
    top: -30, // 🔥 keluar dari navbar
    width: 65,
    height: 65,
    borderRadius: 35,

    backgroundColor: COLORS.primary,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 5,
    borderColor: COLORS.background,

    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});