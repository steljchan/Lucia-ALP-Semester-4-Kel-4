import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {COLORS, title, BTN} from '@/utils/theme';
import {ShopItem} from "@/src/types/shop";

type Props = {
  selectedItem: ShopItem | null;
  selectedMethod: {
    source: any;
    name: string;
  };
  onBack: () => void;
  onClose: () => void;
  onPay: () => void;
  pajak: number;
  loading?: boolean;
};

export default function StepKonfirmasi({
  selectedItem,
  selectedMethod,
  onBack,
  onClose,
  onPay,
  pajak,
  loading = false,
}: Props) {

  if (!selectedItem) {
    return null;
  }

  const subtotal =
    Number(selectedItem.price || 0);

  const total =
    subtotal + pajak;

  const formatRupiah = (
    value: number
  ) => {

    return `Rp ${value.toLocaleString(
      "id-ID"
    )}`;
  };

  const getDetailText = () => {
    if (
      selectedItem.type === "coin"
    ) {
      return `${selectedItem.coin} 🪙`;
    }
    if (
      selectedItem.type === "heart"
    ) {
      return `${selectedItem.heart} ❤️`;
    }
    if (
      selectedItem.type === "limited"
    ) {
      return `${selectedItem.coin} 🪙 + ${selectedItem.heart} ❤️`;
    }
    return "-";
  };

  const rows = [
    {
      label: 'Item',
      value: selectedItem.name,
      color: COLORS.primary,
    },
    {
      label: 'Detail',
      value: getDetailText(),
      color: COLORS.textMain,
    },
    {
      label: 'Harga',
      value: formatRupiah(
        subtotal
      ),
    },
    {
      label: 'Pajak 10%',
      value: formatRupiah(
        pajak
      ),
    },
  ];

  return (

    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} disabled={loading}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={COLORS.textMain}
          />
        </TouchableOpacity>

        <Text style={title}>Konfirmasi</Text>

        <TouchableOpacity
          onPress={onClose}
          disabled={loading}
        >

          <Ionicons
            name="close"
            size={24}
            color={COLORS.textMain}
          />

        </TouchableOpacity>

      </View>

      {rows.map((row, i) => (

        <View
          key={i}
          style={styles.infoRow}
        >

          <Text style={styles.label}>
            {row.label}
          </Text>

          <Text
            style={[
              styles.value,

              row.color
                ? {
                    color:
                      row.color
                  }
                : {},
            ]}
          >

            {row.value}

          </Text>

        </View>
      ))}

      <View style={styles.lineDivider} />

      <View style={styles.infoRow}>

        <Text style={styles.totalLabel}>
          Total
        </Text>

        <Text style={styles.totalValue}>
          {formatRupiah(total)}
        </Text>

      </View>

      <View style={styles.cardItem}>

        <Image
          source={selectedMethod.source}
          style={styles.methodIcon}
          resizeMode="contain"
        />

        <Text style={styles.methodName}>
          {selectedMethod.name}
        </Text>

      </View>

      <TouchableOpacity

        style={[
          BTN.primary.box,
          {
            marginTop: 15,
            opacity:
              loading
                ? 0.7
                : 1,
          },
        ]}

        onPress={onPay}

        disabled={loading}
      >

        {loading ? (

          <ActivityIndicator
            color={COLORS.white}
          />

        ) : (

          <Text style={BTN.primary.text}>
            Bayar Sekarang
          </Text>

        )}

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.smoothBlue,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  methodIcon: {
    width: 40,
    height: 25,
  },

  methodName: {
    flex: 1,
    marginLeft: 10,
    fontWeight: '600',
    color: COLORS.textMain,
  },

  label: {
    color:COLORS.darkGray,
    fontSize: 14,
  },

  value: {
    fontWeight: 'bold',
    color: COLORS.textMain,
  },

  lineDivider: {
    height: 1,
    backgroundColor: COLORS.smoothBlue,
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },

  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color:COLORS.primary,
  },
});