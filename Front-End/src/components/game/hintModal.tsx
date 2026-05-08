import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS} from '@/utils/theme';

export default function HintModal({
  visible,
  onClose,
  hintText,
}: {
  visible: boolean;
  onClose: () => void;
  hintText: string;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.emoji}>💡✨</Text>
          <Text style={styles.title}>Hint</Text>
          <Text style={styles.text}>{hintText}</Text>
          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>Oke</Text>
          </TouchableOpacity>
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

  box: {
    width: '75%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.l,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },

  emoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.yellow,
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 20,
  },

  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.m,
  },

  btnText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});