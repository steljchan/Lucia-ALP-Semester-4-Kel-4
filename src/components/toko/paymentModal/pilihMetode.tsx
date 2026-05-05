import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, title } from '@/utils/theme';

export default function StepPilihMetode({ selectedItem, paymentMethods, onSelect, onClose }: any) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={title}>Metode Pembayaran</Text>
        <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={COLORS.textMain} /></TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Image source={require('@/assets/images/maskot1.png')} style={styles.mascotSmall} />
        <View style={{ flex: 1 }}>
          <Text style={styles.amountText}>{selectedItem.coin ? `${selectedItem.coin} 🪙` : `${selectedItem.heart} ❤️`}</Text>
          <Text style={styles.appLabel}>Lucia: Learning App</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.priceText}>Rp {Number(selectedItem.price).toLocaleString('id-ID')}</Text>
          <Text style={styles.taxLabel}>+ Pajak</Text>
        </View>
      </View>

      {paymentMethods.map((method: any) => (
        <TouchableOpacity key={method.id} style={styles.cardItem} onPress={() => onSelect(method)}>
          <Image source={method.source} style={styles.methodIcon} resizeMode="contain" />
          <Text style={styles.methodName}>{method.name}</Text>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Gunakan style yang sama (bisa dipindah ke file terpisah atau copy-paste bagian relevan)
const styles = StyleSheet.create({  
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

    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20 
    },

    amountText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: COLORS.error 
    },

    priceText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: COLORS.primary 
    },

    appLabel: { 
        fontSize: 12, 
        color: COLORS.gray 
    },
    
    taxLabel: { 
        fontSize: 10, 
        color: COLORS.gray },
    
    productInfo: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20 },
    
    mascotSmall: { 
        width: 50, 
        height: 50, 
        marginRight: 12 
    },
});