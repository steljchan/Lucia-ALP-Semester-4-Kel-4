import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, title } from '@/utils/theme';
import { ShopItem } from "@/src/types/shop";

type PaymentMethod = {
  id: string;
  name: string;
  source: ImageSourcePropType;
};

interface StepPilihMetodeProps {
  selectedItem: ShopItem | null;
  paymentMethods: PaymentMethod[];
  onSelect: (method: PaymentMethod) => void;
  onClose: () => void;
}

export default function StepPilihMetode({
  selectedItem,
  paymentMethods,
  onSelect,
  onClose
}: StepPilihMetodeProps) {

  if (!selectedItem) return null;

  const getDetailText = () => {
    if (selectedItem.type === "coin") {
      return `${selectedItem.coin} 🪙`;
    }

    if (selectedItem.type === "heart") {
      return `${selectedItem.heart} ❤️`;
    }

    if (selectedItem.type === "limited") {
      return `${selectedItem.coin} 🪙 + ${selectedItem.heart} ❤️`;
    }

    return "-";
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={title}>Metode Pembayaran</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={COLORS.textMain} />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Image 
          source={require('@/assets/images/maskot1.png')} 
          style={styles.mascotSmall} 
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.amountText}>
            {getDetailText()}
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
      
      {paymentMethods.map((method) => (
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
    backgroundColor: COLORS.background, 
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
    borderColor: COLORS.gray 
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