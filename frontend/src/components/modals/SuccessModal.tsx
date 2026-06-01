import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS } from '@/utils/theme';

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
};

export default function SuccessModal({
  visible,
  title = 'Berhasil',
  message,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Ionicons
            name="checkmark-circle"
            size={70}
            color={COLORS.success}
          />

          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    padding: 24,
    alignItems: 'center',
  },

  title: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.success,
  },

  message: {
    marginTop: 8,
    textAlign: 'center',
    color: COLORS.textMain,
  },

  button: {
    marginTop: 20,
    backgroundColor: COLORS.success,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.s,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});