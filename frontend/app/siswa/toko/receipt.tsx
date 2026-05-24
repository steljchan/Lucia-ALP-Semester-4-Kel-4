import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, BTN, containerHeader, scrollContent } from '@/utils/theme';

export default function ReceiptScreen() {
  const params = useLocalSearchParams();

  const harga = Number(params.price) || 0;
  const pajak = Number(params.pajak) || 0;
  const total = Number(params.total) || 0;

  const orderId = String(params.orderId || "-");
  const itemName = String(params.itemName || "-");
  const itemDetail = String(params.itemDetail || "-");
  const method = String(params.method || "-");
  const userName = String(params.userName || "-");
  const userEmail = String(params.userEmail || "-");
  const time = String(params.time || "-");

  return (
    <View style={[containerHeader, { backgroundColor: COLORS.background }]}>
      <ScrollView contentContainerStyle={[scrollContent, { paddingBottom: 40 }]}>
        <View style={styles.receiptContainer}>
          
          <View style={styles.glowCircle}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <Ionicons name="checkmark" size={35} color= {COLORS.primary} />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.statusTitle}>Pembayaran Berhasil</Text>
            
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Harga</Text>
                <Text style={styles.value}>Rp{harga.toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Pajak 10%</Text>
                <Text style={styles.value}>Rp{pajak.toLocaleString('id-ID')}</Text>
              </View>
            </View>

            
            <View style={styles.dashedLineContainer}>
                <View style={styles.cutoutLeft} />
                <View style={styles.dashedLine} />
                <View style={styles.cutoutRight} />
            </View>

            
            <View style={styles.section}>
              {[
                { label: 'No. Pemesanan', value: orderId },
                {label: 'Barang', value: `${itemName} (${itemDetail})`},
                { label: 'Waktu', value: time },
                { label: 'Metode Pembayaran', value: method },
                { label: 'Nama', value: userName },
                { label: 'Email', value: userEmail },
              ].map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.valueDetail}>{item.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>Rp{total.toLocaleString('id-ID')}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[BTN.primary.box, { marginTop: 30, marginHorizontal: 30, borderRadius: 15 }]} 
          onPress={() => router.back()}
        >
          <Text style={BTN.primary.text}>Kembali</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  receiptContainer: { 
    alignItems: 'center', 
    marginTop: 80, 
    paddingHorizontal: 20 
  },

  glowCircle: {
    width: 110, height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(100, 181, 246, 0.2)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 5, marginBottom: -55
  },

  outerCircle: {
    width: 85, height: 85,
    borderRadius: 42.5,
    backgroundColor: 'rgba(100, 181, 246, 0.4)',
    justifyContent: 'center', alignItems: 'center',
  },

  innerCircle: {
    width: 60, height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    elevation: 3,
  },

  card: {
    backgroundColor: COLORS.white, 
    width: '100%', 
    borderRadius: 15,
    paddingTop: 70, 
    paddingHorizontal: 20, 
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
  },

  statusTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: COLORS.textMain, 
    marginBottom: 30 
  },

  section: {
    marginVertical: 5
  },

  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 15 
  },

  label: { 
    color: COLORS.textMain, 
    fontSize: 14, 
    fontWeight: '700' 
  },

  value: { 
    color: COLORS.primary, 
    fontSize: 14, 
    fontWeight: '800' 
  },

  valueDetail: { 
    color: COLORS.textMain, 
    fontSize: 13, 
    fontWeight: '600', 
    flex: 1, 
    textAlign: 'right' 
  },

  dashedLineContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 10,
    marginHorizontal: -20,
    position: 'relative'
  },

  dashedLine: {
    flex: 1, 
    height: 1, 
    borderStyle: 'dashed', 
    borderWidth: 1, 
    borderColor: '#BBDEFB',
  },

  cutoutLeft: { 
    width: 24, height: 24, 
    borderRadius: 12, 
    backgroundColor: COLORS.background, 
    marginLeft: -12 
  },

  cutoutRight: { 
    width: 24, height: 24, 
    borderRadius: 12, 
    backgroundColor: COLORS.background,
    marginRight: -12 
  },

  totalContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: COLORS.white, 
    paddingVertical: 20,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: COLORS.smoothBlue,
    marginTop: 10
  },

  totalLabel: {
    fontSize: 16, 
    fontWeight: 'bold', 
    color: COLORS.textMain
  },

  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary
  }
});