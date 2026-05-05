import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, title, BTN } from '@/utils/theme';

export default function StepKonfirmasi({ selectedItem, selectedMethod, onBack, onClose, onPay, pajak }: any) {
  const rows = [
    { label: 'Item', value: selectedItem.name, color: COLORS.primary },
    { label: 'Detail', value: selectedItem.coin ? `${selectedItem.coin} 🪙` : `${selectedItem.heart} ❤️`, color: COLORS.error },
    { label: 'Harga', value: Number(selectedItem.price).toLocaleString('id-ID') },
    { label: 'Pajak', value: Number(pajak).toLocaleString('id-ID') },
  ];

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><Ionicons name="chevron-back" size={24} color={COLORS.textMain} /></TouchableOpacity>
        <Text style={title}>Konfirmasi</Text>
        <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={COLORS.textMain} /></TouchableOpacity>
      </View>

      {rows.map((row, i) => (
        <View key={i} style={styles.infoRow}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={[styles.value, row.color ? { color: row.color } : {}]}>{row.value}</Text>
        </View>
      ))}

      <View style={styles.lineDivider} />
      <View style={styles.infoRow}>
        <Text style={styles.label}>Total</Text>
        <Text style={[styles.value, { fontSize: 18, color: COLORS.primary }]}>
          Rp {Number(selectedItem.price + pajak).toLocaleString('id-ID')}
        </Text>
      </View>

      <View style={styles.cardItem}>
        <Image source={selectedMethod.source} style={styles.methodIcon} resizeMode="contain" />
        <Text style={styles.methodName}>{selectedMethod.name}</Text>
      </View>

      <TouchableOpacity style={[BTN.primary.box, { marginTop: 15 }]} onPress={onPay}>
        <Text style={BTN.primary.text}>Bayar Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ 
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20 
    },

    infoRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginVertical: 6 
    },

    methodName: { 
        flex: 1, 
        marginLeft: 10, 
        fontWeight: '600' 
    },

    cardItem: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', 
        padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#EEE' 
    },

    methodIcon: { 
        width: 40, 
        height: 25 
    },

   
    label: { 
        color: COLORS.gray, 
        fontSize: 14 
    },

    value: { 
        fontWeight: 'bold' 
    },

    lineDivider: { 
        height: 1, 
        backgroundColor: '#EEE', 
        marginVertical: 12 
    },
});