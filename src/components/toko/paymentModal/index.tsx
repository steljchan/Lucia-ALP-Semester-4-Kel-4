import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import StepPilihMetode from './pilihMetode';
import StepKonfirmasi from './konfirmasi';
import StepStatus from './status';

export default function PaymentModal({ isVisible, onClose, selectedItem }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedMethod(null);
    onClose();
  };

  const handlePay = () => {
    setCurrentStep(3);
    setTimeout(() => setCurrentStep(4), 2000);
  };

  if (!selectedItem) return null;

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalContainer}>
          {currentStep === 1 && (
            <StepPilihMetode 
              selectedItem={selectedItem} 
              onSelect={(m: any) => { setSelectedMethod(m); setCurrentStep(2); }} 
              onClose={handleClose} 
            />
          )}
          {currentStep === 2 && (
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
            <StepStatus step={currentStep} onClose={handleClose} />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: 40 },
});