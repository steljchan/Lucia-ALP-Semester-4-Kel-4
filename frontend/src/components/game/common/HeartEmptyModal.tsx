import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '@/utils/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function HeartEmptyModal({
  visible,
  onClose,
}: Props) {

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >

      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.heartWrapper}>
            <Ionicons
              name="heart-dislike"
              size={70}
              color="#FF5A7A"
            />
          </View>

          <Text style={styles.title}>Heart Habis</Text>
          <Text style={styles.description}>Kamu sudah kehabisan heart. {'\n\n'} Tunggu timer selesai untuk bermain lagi</Text>

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Mengerti</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  modal: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 28,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BFE7FF',
    elevation: 12,
  },

  heartWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EAF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 3,
    borderColor: '#D6EEFF',
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: COLORS.textSub,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 26,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 34,
    paddingVertical: 14,
    borderRadius: 18,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});