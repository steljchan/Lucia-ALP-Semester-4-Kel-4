import React from 'react';

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  visible: boolean;

  onShop: () => void;

  onBack: () => void;

  title?: string;

  description?: string;
};

export default function GameOverModal({
  visible,
  onShop,
  onBack,
  title = '💔 GAME OVER',
  description = 'Heart habis! Beli heart di toko atau ulang level nanti.',
}: Props) {

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>

        <View style={styles.card}>

          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.description}>
            {description}
          </Text>

          <View style={styles.buttonContainer}>

            <TouchableOpacity
              style={[
                styles.button,
                styles.shopButton,
              ]}
              onPress={onShop}
            >
              <Text style={styles.buttonText}>
                Toko
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.backButton,
              ]}
              onPress={onBack}
            >
              <Text style={styles.buttonText}>
                Kembali
              </Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '82%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  shopButton: {
    backgroundColor: '#FF9800',
  },

  backButton: {
    backgroundColor: '#5CBEFA',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});