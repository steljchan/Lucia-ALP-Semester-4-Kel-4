import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, title } from '@/utils/theme';

interface StepPilihMetodeProps {
  selectedItem: any;
  paymentMethods: any[];
  onSelect: (method: any) => void;
  onClose: () => void;
}

export default function StepPilihMetode({ 
  selectedItem, 
  paymentMethods, 
  onSelect, 
  onClose 
}: StepPilihMetodeProps) {
  return (
    <View>
      {/* Header Modal */}
      <View style={styles.header}>
        <Text style={title}>Metode Pembayaran</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={COLORS.textMain} />
        </TouchableOpacity>
      </View>

      {/* Info Produk Singkat */}
      <View style={styles.productInfo}>
        <Image 
          source={require('@/assets/images/maskot1.png')} 
          style={styles.mascotSmall} 
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.amountText}>
            {selectedItem.coin ? `${selectedItem.coin} 🪙` : `${selectedItem.heart} ❤️`}
          </Text>
          <Text style={styles.appLabel}>Lucia: Learning App</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.priceText}>
            Rp {Number(selectedItem.price).toLocaleString('id-ID')}
          </Text>
          <Text style={styles.taxLabel}>+ Pajak</Text>
        </View>
      </View>

      {/* List Metode Pembayaran */}
      {paymentMethods && paymentMethods.map((method) => (
        <TouchableOpacity 
          key={method.id} 
          style={styles.cardItem} 
          onPress={() => onSelect(method)}
        >
          <View style={styles.methodIconBox}>
            <Image 
              source={method.source} 
              style={styles.methodIcon} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.methodName}>{method.name}</Text>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
      ))}
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
  productInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 25,
    backgroundColor: '#F0F9FF', 
    padding: 10,
    borderRadius: 12
  },
  mascotSmall: { 
    width: 50, 
    height: 50, 
    marginRight: 12 
  },
  amountText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.textMain 
  },
  appLabel: { 
    fontSize: 12, 
    color: COLORS.darkGray 
  },
  priceText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.primary 
  },
  taxLabel: { 
    fontSize: 10, 
    color: COLORS.darkGray 
  },
  cardItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8F9FA', 
    padding: 12, 
    borderRadius: 15, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#EEE' 
  },
  methodIconBox: {
    width: 45,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIcon: { 
    width: '100%', 
    height: '100%' 
  },
  methodName: { 
    flex: 1, 
    marginLeft: 12, 
    fontWeight: '600',
    color: COLORS.textMain
  },
});