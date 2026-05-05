import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, title, BTN } from '@/utils/theme';

const logoOvo = require('@/assets/images/pembayaran/ovo.png');
const logoGopay = require('@/assets/images/pembayaran/gopay.png');
const logoDana = require('@/assets/images/pembayaran/dana.png');
const logoShopee = require('@/assets/images/pembayaran/spay.png');

interface PaymentModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedItem: any;
}

export default function PaymentModal({ isVisible, onClose, selectedItem }: PaymentModalProps) {
  
  const [currentStep, setCurrentStep] = useState(1); 
  const [selectedMethod, setSelectedMethod] = useState<any>(null);

  if (!selectedItem) return null;

  const paymentMethods = [
    { id: 'OVO', name: 'OVO', source: logoOvo },
    { id: 'GOPAY', name: 'GOPAY', source: logoGopay },
    { id: 'DANA', name: 'DANA', source: logoDana },
    { id: 'SHOPEE', name: 'SHOPEEPAY', source: logoShopee },
  ];

  // Fungsi saat user klik salah satu metode
  const handleSelectMethod = (method: any) => {
    setSelectedMethod(method);
    setCurrentStep(2); 
  };

  // Fungsi reset saat modal ditutup
  const handleClose = () => {
    setCurrentStep(1);
    setSelectedMethod(null);
    onClose();
  };

  const pajak = 5000; // pjak

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalContainer}>
          
          {currentStep === 1 && (
            <View>
              <View style={styles.header}>
                <Text style={title}>Metode Pembayaran</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
              </View>

              <View style={styles.productInfo}>
                <Image source={require('@/assets/images/maskot1.png')} style={styles.mascot} />
                <View style={styles.productText}>
                  <Text style={styles.amountText}>
                    {selectedItem.coin ? `${selectedItem.coin} 🪙` : `${selectedItem.heart} ❤️`}
                  </Text>
                  <Text style={styles.appLabel}>Lucia: Learning App</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.priceText}>Rp {Number(selectedItem.price).toLocaleString('id-ID')}</Text>
                  <Text style={styles.taxLabel}>+ Pajak</Text>
                </View>
              </View>

              {paymentMethods.map((method) => (
                <TouchableOpacity 
                  key={method.id} 
                  style={styles.methodItem}
                  onPress={() => handleSelectMethod(method)} 
                >
                  <View style={styles.methodIconBox}>
                    <Image source={method.source} style={styles.methodIcon} resizeMode="contain" />
                  </View>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#CCC" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/*  konfirm bayar*/}
          {currentStep === 2 && selectedMethod && (
            <View>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setCurrentStep(1)}>
                   <Ionicons name="chevron-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={title}>Konfirmasi Pembayaran</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Item</Text>
                <Text style={[styles.value, { color: COLORS.primary }]}>{selectedItem.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Detail</Text>
                <Text style={[styles.value, { color: COLORS.error }]}>
                   {selectedItem.coin ? `${selectedItem.coin} 🪙` : `${selectedItem.heart} ❤️`}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Harga</Text>
                <Text style={styles.value}>{Number(selectedItem.price).toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Pajak</Text>
                <Text style={styles.value}>{Number(pajak).toLocaleString('id-ID')}</Text>
              </View>

              <View style={styles.lineDivider} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>Total</Text>
                <Text style={[styles.value, { fontSize: 18, color: COLORS.primary }]}>
                  Rp {Number(selectedItem.price + pajak).toLocaleString('id-ID')}
                </Text>
              </View>

              <View style={styles.methodSelectionHeader}>
                <Text style={styles.label}>Metode Pembayaran</Text>
                <TouchableOpacity onPress={() => setCurrentStep(1)}>
                  <Text style={{ color: COLORS.primary, fontSize: 12 }}>Ganti Metode</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.selectedMethodCard}>
                <Image source={selectedMethod.source} style={styles.methodIconSmall} resizeMode="contain" />
                <Text style={styles.methodName}>{selectedMethod.name}</Text>
              </View>

              <TouchableOpacity style={[BTN.primary.box, {marginTop: 15}] } onPress={() => alert('Pembayaran Berhasil!')}>
                <Text style={BTN.primary.text}>Bayar</Text>
              </TouchableOpacity>
            </View>
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

    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20 
    },

    productInfo: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20 
    },

    mascot: { 
        width: 50, 
        height: 50, 
        marginRight: 12
    },

    productText: { 
        flex: 1 
    },

    amountText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: COLORS.error 
    },
    appLabel: { 
        fontSize: 12, 
        color: COLORS.gray 
    },
    priceText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: COLORS.primary 
    },
    taxLabel: { 
        fontSize: 10, 
        color: COLORS.gray 
    },

    methodItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F8F9FA', 
        padding: 12, 
        borderRadius: 12, 
        marginBottom: 8, 
        borderWidth: 1, 
        borderColor: '#EEE' 
    },

    selectedItem: { 
        borderColor: COLORS.primary, 
        backgroundColor: '#F0F9FF' 
    },

    methodIconBox: { 
        width: 40, 
        height: 30, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    methodIcon: {
        width: '100%', 
        height: '100%', 
    },
    methodName: { 
        flex: 1, 
        marginLeft: 10, 
        fontWeight: '600' 
    },

    radioButton: { 
        width: 18, 
        height: 18, 
        borderRadius: 9, 
        borderWidth: 2, 
        borderColor: '#DDD' 
    },

    radioActive: { 
        borderColor: COLORS.primary, 
        backgroundColor: COLORS.primary },
    
  
    infoRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginVertical: 6 
    },
    
    label: { 
        color: COLORS.gray, 
        fontSize: 14 
    },
    value: { 
        fontWeight: 'bold' 
    },

    lineDivider: { 
        height: 1, backgroundColor: '#EEE', 
        marginVertical: 12 },
    
    methodSelectionHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 15, 
        marginBottom: 10 
    },
    selectedMethodCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F8F9FA', 
        padding: 12, 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: '#EEE' 
    },
    methodIconSmall: { 
        width: 30, 
        height: 20, 
        marginRight: 10 
    },
});