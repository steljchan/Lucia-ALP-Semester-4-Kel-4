import React from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity,} from 'react-native';
import { COLORS, BORDER_RADIUS } from '@/utils/theme';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  visible,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalText}>Apakah kamu yakin mau keluar?</Text>
          <View style={styles.modalBtnRow}>
            <TouchableOpacity style={styles.btnNo} onPress={onClose}>
              <Text style={styles.btnNoText}>Tidak</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnYes} onPress={onConfirm}>
              <Text style={styles.btnYesText}>Ya</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.s,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },

  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.textMain,
    marginBottom: 20,
  },

  modalBtnRow: {
    flexDirection: 'row',
    width: '100%',
  },

  btnNo: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },

  btnNoText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  btnYes: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },

  btnYesText: {
    color: 'white',
    fontWeight: 'bold',
  },
});