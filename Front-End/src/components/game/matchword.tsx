import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

type StatusType = 'correct' | 'wrong' | undefined;

type Props = {
  word: string;
  onPress: (word: string) => void;

  // 🔥 WAJIB (buat garis)
  setWordPosition: (word: string, pos: { x: number; y: number }) => void;

  disabled?: boolean;
  status?: StatusType;
};

export default function MatchWord({
  word,
  onPress,
  setWordPosition,
  disabled = false,
  status,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(word)}
      disabled={disabled}
      style={styles.wrapper}
    >
      {/* 🔵 CARD */}
      <View
        style={[
          styles.card,
          disabled && styles.disabled,
          status === 'correct' && styles.correct,
          status === 'wrong' && styles.wrong,
        ]}
      >
        <Text style={styles.text}>{word}</Text>
      </View>

      {/* 🔴 DOT (ANCHOR LINE) */}
      <View
        style={[
          styles.dot,
          disabled && styles.dotDisabled,
          status === 'correct' && styles.dotCorrect,
          status === 'wrong' && styles.dotWrong,
        ]}
        onLayout={(e) => {
          e.target.measureInWindow((x, y, width, height) => {
            setWordPosition(word, {
              x: x + width / 2,
              y: y + height / 2,
            });
          });
        }}
              />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginVertical: 12,
    alignItems: 'center',
  },

  /* 🔵 CARD */
  card: {
    height: 60,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#5CBEFA',
    backgroundColor: '#FFFFFF',
    shadowColor: '#5CBEFA',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  disabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#CBD5E1',
  },

  correct: {
    backgroundColor: '#C8E6C9',
    borderColor: '#4CAF50',
  },

  wrong: {
    backgroundColor: '#FFCDD2',
    borderColor: '#FF4D4F',
  },

  text: {
    fontWeight: '700',
    fontSize: 14,
    color: '#1A3B5D',
  },

  /* 🔴 DOT */
  dot: {
    position: 'absolute',
    right: -6,
    top: '50%',
    marginTop: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5CBEFA',
    zIndex: 10,
  },

  dotDisabled: {
    backgroundColor: '#CBD5E1',
  },

  dotCorrect: {
    backgroundColor: '#4CAF50',
  },

  dotWrong: {
    backgroundColor: '#FF4D4F',
  },
});