import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export type StatusType =
  | 'default'
  | 'idle'
  | 'correct'
  | 'wrong'
  | 'used';

type Props = {
  letter?: string;
  status?: StatusType;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function LetterBox({
  letter = '',
  status = 'idle',
  style,
  textStyle,
}: Props) {
  const containerStyle = [
    styles.box,
    statusStyles[status] ?? statusStyles.idle,
    style,
  ];

  const labelStyle = [
    styles.text,
    textStyles[status] ?? textStyles.idle,
    textStyle,
  ];

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>
        {letter || ''}
      </Text>
    </View>
  );
}

/* 🔥 STYLE MAP (TYPE SAFE) */
const statusStyles: Record<StatusType, ViewStyle> = {
  default: {
    borderColor: '#5CBEFA',
    backgroundColor: '#FFFFFF',
  },
  idle: {
    borderColor: '#5CBEFA',
    backgroundColor: '#FFFFFF',
  },
  correct: {
    borderColor: '#4CAF50',
    backgroundColor: '#C8E6C9',
  },
  wrong: {
    borderColor: '#FF4D4F',
    backgroundColor: '#FFCDD2',
  },
  used: {
    borderColor: '#ACB4C1',
    backgroundColor: '#E5E7EB',
    opacity: 0.6, // 🔥 bikin lebih jelas “disabled”
  },
};

const textStyles: Record<StatusType, TextStyle> = {
  default: { color: '#1A3B5D' },
  idle: { color: '#1A3B5D' },
  correct: { color: '#2E7D32' },
  wrong: { color: '#C62828' },
  used: { color: '#9CA3AF' },
};

/* 🎨 BASE STYLE */
const styles = StyleSheet.create({
  box: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,

    justifyContent: 'center',
    alignItems: 'center',

    marginHorizontal: 5,

    // ✨ sedikit shadow biar “clickable”
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  text: {
    fontSize: 20,
    fontWeight: '700',
  },
});