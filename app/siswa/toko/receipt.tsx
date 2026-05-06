import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, title, BTN, containerHeader, scrollContent } from '@/utils/theme';

export default function ReceiptScreen() {
  // Mengambil data yang dikirim dari halaman toko
  const params = useLocalSearchParams();
  
  const harga = Number(params.price) || 10000;
  const pajak = harga * 0.1; // Asumsi pajak 10%
  const total = harga + pajak;

  return (
    <View style={[containerHeader, { justifyContent: 'flex-start', alignItems: 'stretch' }]}>
      <ScrollView contentContainerStyle={[scrollContent, { paddingBottom: 20 }]}>
        
        <View style={styles.receiptContainer}>
          
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="checkmark" size={40} color={COLORS.primary} />
            </View>
          </View>

          {/* Kartu Putih */}
          <View style={styles.card}>
            <Text style={styles.statusTitle}>Pembayaran Berhasil</Text>

            {/* Rincian Harga */}
            <View style={[{marginVertical: 5}]}>
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
                <View style={styles.dashedLine} />
                <View style={[styles.cutout, { left: -25 }]} />
                <View style={[styles.cutout, { right: -25 }]} />
            </View>

            {/* Rincian Transaksi */}
            <View style={[{marginVertical: 5}]}>
              {[
                { label: 'No. Pemesanan', value: '1876543234567876' },
                { label: 'Barang', value: params.itemName || 'Paket Hati' },
                { label: 'Waktu', value: '20.03.2026 - 19:28:30' },
                { label: 'Metode Pembayaran', value: params.method || 'OVO' },
                { label: 'Nama', value: 'Renata' },
                { label: 'Email', value: 'Rena@student.slbn1.ac.id' },
              ].map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.valueDetail}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* Total Pembayaran */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Pembayaran </Text>
              <Text style={styles.totalValue}>Rp{total.toLocaleString('id-ID')}</Text>
            </View>
          </View>
        </View>

        {/* Tombol Kembali */}
        <TouchableOpacity 
          style={[BTN.primary.box, { marginTop: 40, marginHorizontal: 20 }]} 
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
    marginTop: 60, 
    paddingHorizontal: 25 
},
  
  outerCircle: {
    width: 80, height: 80, 
    borderRadius: 40, 
    backgroundColor: 'COLORS.softBlue',
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 2, 
    marginBottom: -40,
    elevation: 5
  },

  innerCircle: {
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    backgroundColor: 'white',
    justifyContent: 'center', 
    alignItems: 'center'
  },

  card: {
    backgroundColor: 'white', width: '100%', borderRadius: 25,
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  statusTitle: { 
    fontSize: 20, fontWeight: 'bold', textAlign: 'center', 
    color: '#1A237E', marginBottom: 25 
  },

  row: { flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },

  label: { 
    color: '#757575', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  value: { 
    color: '#333', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  
  valueDetail: { 
    color: '#333', 
    fontSize: 13, 
    fontWeight: '600', 
    flex: 1, 
    textAlign: 'right', 
    marginLeft: 10 
  },
  
  dashedLineContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 15, 
    position: 'relative'
  },

  dashedLine: {
    flex: 1, 
    height: 1, 
    borderStyle: 'dashed', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 1
  },

  cutout: { 
    position: 'absolute', 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: '#F0F8FF'
  },
  
  totalContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#F9F9F9', 
    padding: 18, 
    borderRadius: 12, 
    marginTop: 15,
    borderWidth: 1, 
    borderColor: '#EEF2FF'
  },
  totalLabel: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#333' 
},
  totalValue: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.primary 
}
});