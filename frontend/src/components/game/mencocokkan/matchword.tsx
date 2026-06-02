import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {useEffect, useRef} from 'react';
import {COLORS} from '@/utils/theme';

type StatusType = 'correct' | 'wrong' | undefined;

type Props = {
  word: string;
  onDragStart: (word: string) => void;
  setWordPosition: (word: string, pos: { x: number; y: number }) => void;
  active?: boolean;
  disabled?: boolean;
  status?: StatusType;
};

export default function MatchWord({
  word,
  onDragStart,
  setWordPosition,
  active = false,
  disabled = false,
  status,
}: Props) {

  const dotRef = useRef<View>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dotRef.current?.measureInWindow((x, y, width, height) => {
        setWordPosition(word, {
          x: x + width / 2,
          y: y + height / 2,
        });
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}

        onPressIn={() => {
          if (disabled) return;
          onDragStart(word);
        }}
      >
        <View
          style={[
            styles.card,
            disabled && styles.disabled,
            status === 'correct' && styles.correct,
            status === 'wrong' && styles.wrong,
            active && styles.activeCard,
          ]}
        >
          <Text style={styles.text}>{word}</Text>
        </View>
      </TouchableOpacity>

      <View
        ref={dotRef}
        collapsable={false}
        style={[
          styles.dot,
          disabled && styles.dotDisabled,
          status === 'correct' && styles.dotCorrect,
          status === 'wrong' && styles.dotWrong,
          active && styles.dotActive,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginVertical: 12,
    alignItems: 'center',
  },

  card: {
    height: 60,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  activeCard: {
    borderColor: '#2563EB',
    borderWidth: 3,
    backgroundColor: '#DBEAFE',
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.35,
    elevation: 6,
  },

  disabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#CBD5E1',
  },

  correct: {
    backgroundColor: '#C8E6C9',
    borderColor: COLORS.success,
  },

  wrong: {
    backgroundColor: '#FFCDD2',
    borderColor: COLORS.error,
  },

  text: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.textMain,
  },

  dot: {
    position: 'absolute',
    right: -8,
    top: '50%',
    marginTop: -8,
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
    zIndex: 999,
    elevation: 999,
  },

  dotActive: {
    backgroundColor: '#2563EB',
    transform: [{ scale: 1.35 }],
  },

  dotDisabled: {
    backgroundColor: '#CBD5E1',
  },

  dotCorrect: {
    backgroundColor: COLORS.success,
  },

  dotWrong: {
    backgroundColor: COLORS.error,
  },
});