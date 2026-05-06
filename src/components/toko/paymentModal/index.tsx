import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import StepPilihMetode from './pilihMetode';
import StepKonfirmasi from './konfirmasi';
import StepStatus from './status';
import { router } from 'expo-router';


const logoOvo = require('@/assets/images/pembayaran/ovo.png');
const logoGopay = require('@/assets/images/pembayaran/gopay.png');
const logoDana = require('@/assets/images/pembayaran/dana.png');
const logoShopee = require('@/assets/images/pembayaran/spay.png');

export default function PaymentModal({ isVisible, onClose, selectedItem }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);

  const paymentMethods = [
    { id: 'OVO', name: 'OVO', source: logoOvo },
    { id: 'GOPAY', name: 'GOPAY', source: logoGopay },
    { id: 'DANA', name: 'DANA', source: logoDana },
    { id: 'SHOPEE', name: 'SHOPEEPAY', source: logoShopee },
  ];

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedMethod(null);
    onClose();
  };

  const handlePay = () => {
    setCurrentStep(3); // Memproses
    
    setTimeout(() => {
        setCurrentStep(4); // Tampilan Centang Saja
        
        // Tunggu 1.5 detik agar animasi centang terlihat, lalu navigasi
        setTimeout(() => {
        onClose(); // Tutup modal dulu
        router.push({
            pathname: '/siswa/toko/receipt',
            params: { 
            price: selectedItem.price, 
            itemName: selectedItem.name,
            method: selectedMethod.name 
            }
        });
        }, 1500);
        
    }, 2000);
  };

  if (!selectedItem) return null;

  return (
    <Modal 
      visible={isVisible} 
      transparent 
      animationType="slide" 
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        {/* Pressable kedua tanpa onPress agar klik di dalam modal tidak menutup modal */}
        <Pressable style={styles.modalContainer}>
          
          {currentStep === 1 && (
            <StepPilihMetode 
              selectedItem={selectedItem} 
              paymentMethods={paymentMethods}
              onSelect={(m: any) => { 
                setSelectedMethod(m); 
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
              pajak={5000}
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
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  modalContainer: { 
    backgroundColor: 'white', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20, 
    paddingBottom: 40 
  },
});