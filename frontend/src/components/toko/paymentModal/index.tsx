import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Alert } from 'react-native';
import StepPilihMetode from './pilihMetode';
import StepKonfirmasi from './konfirmasi';
import StepStatus from './status';
import { router } from 'expo-router';
import { COLORS } from '@/utils/theme';
import { purchaseItem } from '@/src/services/paymentService';
const logoOvo = require('@/assets/images/pembayaran/ovo.png');
const logoGopay = require('@/assets/images/pembayaran/gopay.png');
const logoDana = require('@/assets/images/pembayaran/dana.png');
const logoShopee = require('@/assets/images/pembayaran/spay.png');

export default function PaymentModal({

  isVisible,
  onClose,
  selectedItem,
  userData,
  onSuccess,

}: any) {

  const [currentStep, setCurrentStep] =
    useState(1);

  const [selectedMethod, setSelectedMethod] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const paymentMethods = [

    {
      id: 'OVO',
      name: 'OVO',
      source: logoOvo,
    },

    {
      id: 'GOPAY',
      name: 'GOPAY',
      source: logoGopay,
    },

    {
      id: 'DANA',
      name: 'DANA',
      source: logoDana,
    },

    {
      id: 'SHOPEE',
      name: 'SHOPEEPAY',
      source: logoShopee,
    },
  ];

  const handleClose = () => {

    setCurrentStep(1);

    setSelectedMethod(null);

    onClose();
  };

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

  const handlePay = async () => {

    try {

      if (
        !selectedItem ||
        !selectedMethod
      ) return;

      setLoading(true);

      const result: any =
        await purchaseItem(

          selectedItem.id,

          selectedMethod.name
        );

      handleClose();

      if (onSuccess) {

        await onSuccess();
      }

      router.push({

        pathname:
          "/siswa/toko/receipt",

        params: {

          orderId:
            result.orderId,

          itemName:
            selectedItem.name,

          itemDetail:
            getDetailText(),

          price:
            result.subtotal,

          pajak:
            result.tax,

          total:
            result.total,

          method:
            selectedMethod.name,

          userName:
            userData?.name || "-",

          userEmail:
            userData?.email || "-",

          time:
            new Date()
            .toLocaleString(
              "id-ID"
            ),
        },
      });

    } catch (error: any) {

      console.log(error);

      Alert.alert(
        "Pembelian Gagal",

        error.message ||
        "Terjadi kesalahan"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <Modal 
      visible={isVisible} 
      transparent 
      animationType="slide" 
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalContainer}>
          
          {currentStep === 1 && (
            <StepPilihMetode 
              selectedItem={selectedItem} 
              paymentMethods={paymentMethods}
              onSelect={(method: any) => { 
                setSelectedMethod(method); 
                setCurrentStep(2); 
              }} 
              onClose={handleClose} 
            />
          )}

          {currentStep === 2 && selectedMethod && (
            <StepKonfirmasi 
              selectedItem={selectedItem} 
              selectedMethod={selectedMethod} 
              onBack={() => setCurrentStep(1)} 
              onPay={handlePay} 
              onClose={handleClose}
              pajak={selectedItem.price * 0.1}
              loading={loading}
            />
          )}

          {(currentStep === 3 || currentStep === 4) && (
            <StepStatus 
              step={currentStep} 
              onClose={handleClose} 
            />
          )}

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: COLORS.overlay, 
    justifyContent: 'flex-end' 
  },
  modalContainer: { 
    backgroundColor: COLORS.white, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20, 
    paddingBottom: 40 
  },
});