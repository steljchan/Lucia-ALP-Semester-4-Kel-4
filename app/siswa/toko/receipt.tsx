import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
// Pastikan COLORS sudah memiliki primary yang sesuai (biru muda)
import { COLORS, BTN, containerHeader, scrollContent } from '@/utils/theme';

export default function ReceiptScreen() {
  const params = useLocalSearchParams();
  
  const harga = Number(params.price) || 10000;
  const pajak = harga * 0.1;
  const total = harga + pajak;

  return (
    <View style={[containerHeader, { backgroundColor: '#F0F8FF' }]}>
      <ScrollView contentContainerStyle={[scrollContent, { paddingBottom: 40 }]}>
        
        <View style={styles.receiptContainer}>
          
          {/* Ikon Centang dengan Efek Glow */}
          <View style={styles.glowCircle}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <Ionicons name="checkmark" size={35} color="#64B5F6" />
              </View>
            </View>
          </View>

          {/* Kartu Struk */}
          <View style={styles.card}>
            <Text style={styles.statusTitle}>Pembayaran Berhasil</Text>

            {/* Bagian Atas: Rincian Harga */}
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

            {/* Garis Putus-putus dengan Lubang (Cutout) */}
            <View style={styles.dashedLineContainer}>
                <View style={styles.cutoutLeft} />
                <View style={styles.dashedLine} />
                <View style={styles.cutoutRight} />
            </View>

            {/* Bagian Tengah: Detail Transaksi */}
            <View style={styles.section}>
              {[
                { label: 'No. Pemesanan', value: '1876543234567876' },
                { label: 'Barang', value: params.itemName || 'Paket Hati' },
                { label: 'Waktu', value: '20.03.2026 - 19:28:30' },
                { label: 'Metode Pembayaran', value: params.method || 'OVO' },
                { label: 'Nama', value: 'Renata' },
                { label: 'Email', value: 'Rena@student.SLBN1.ac.id' },
              ].map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.valueDetail}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* Total Pembayaran (Kotak Biru Muda) */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>Rp{total.toLocaleString('id-ID')}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[BTN.primary.box, { marginTop: 30, marginHorizontal: 30, borderRadius: 15 }]} 
          onPress={() => router.replace('/siswa/toko')}
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
    backgroundColor: '#FFFFFF',
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
    borderColor: '#E3F2FD',
  },
  statusTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: COLORS.textMain, 
    marginBottom: 30 
  },
  section: { marginVertical: 5 },
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
    color: '#64B5F6', 
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
    backgroundColor: '#F0F8FF', 
    marginLeft: -12 
  },
  cutoutRight: { 
    width: 24, height: 24, 
    borderRadius: 12, 
    backgroundColor: '#F0F8FF',
    marginRight: -12 
  },
  totalContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
    paddingVertical: 20,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
    marginTop: 10
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#64B5F6' }
});