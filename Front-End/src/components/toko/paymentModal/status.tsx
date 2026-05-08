import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BTN } from '@/utils/theme';
import { Background } from '@react-navigation/elements';

export default function StepStatus({ step, onClose }: any) {
  return (
    <View style={styles.centerContent}>
      {step === 3 ? (
        <>
          <Image source={require('@/assets/images/maskot1.png')} style={styles.mascotLarge} />
          <Text style={styles.statusTitle}>Memproses Pembayaran</Text>
          <Text style={styles.statusSubtitle}>Mohon tunggu sebentar...</Text>
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        </>
      ) : (
        <>
          <View style={styles.checkCircle}><Ionicons name="checkmark" size={60} color="white" /></View>
            <Text style={[styles.statusTitle, { marginTop: 20 }]}>Pembayaran Berhasil!</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({  
    centerContent: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 20 
    },

    mascotLarge: { 
        width: 150, 
        height: 150, 
        marginBottom: 20 
    },

    statusTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: COLORS.textMain, 
    },

    statusSubtitle: { 
        fontSize: 14, 
        color: COLORS.darkGray, 
        textAlign: 'center' 
    },
    
    checkCircle: { 
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        backgroundColor: COLORS.primary, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});