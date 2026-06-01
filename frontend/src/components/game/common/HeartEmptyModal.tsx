import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

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

          {/* HEART ICON */}
          <View style={styles.heartWrapper}>
            <Ionicons
              name="heart-dislike"
              size={70}
              color="#FF5A7A"
            />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>
            Heart Habis
          </Text>

          {/* DESCRIPTION */}
          <Text style={styles.description}>
            Kamu sudah kehabisan heart.
            {'\n\n'}
            Tunggu timer selesai
            untuk bermain lagi
          </Text>

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              Mengerti
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles =
  StyleSheet.create({
    overlay: {
      flex: 1,

      backgroundColor:
        'rgba(0,0,0,0.45)',

      justifyContent:
        'center',

      alignItems: 'center',

      padding: 24,
    },

    modal: {
      width: '100%',

      backgroundColor:
        '#F8FCFF',

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

      backgroundColor:
        '#EAF6FF',

      justifyContent:
        'center',

      alignItems: 'center',

      marginBottom: 18,

      borderWidth: 3,

      borderColor: '#D6EEFF',
    },

    title: {
      fontSize: 26,

      fontWeight: '800',

      color: '#1A3B5D',

      marginBottom: 10,
    },

    description: {
      fontSize: 15,

      color: '#5B6B7A',

      textAlign: 'center',

      lineHeight: 24,

      marginBottom: 26,
    },

    button: {
      backgroundColor:
        '#5CBEFA',

      paddingHorizontal: 34,

      paddingVertical: 14,

      borderRadius: 18,

      elevation: 4,

      shadowColor: '#5CBEFA',

      shadowOpacity: 0.3,

      shadowRadius: 8,
    },

    buttonText: {
      color: '#fff',

      fontSize: 16,

      fontWeight: '700',
    },
  });