import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import {COLORS} from '@/utils/theme';

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

const statusStyles: Record<StatusType, ViewStyle> = {
  default: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  idle: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  correct: {
    borderColor: COLORS.success,
    backgroundColor: '#C8E6C9',
  },
  wrong: {
    borderColor: COLORS.error,
    backgroundColor: '#FFCDD2',
  },
  used: {
    borderColor: '#ACB4C1',
    backgroundColor: '#E5E7EB',
    opacity: 0.6, 
  },
};

const textStyles: Record<StatusType, TextStyle> = {
  default: { color: COLORS.textMain },
  idle: { color: COLORS.textMain },
  correct: { color: '#2E7D32' },
  wrong: { color: '#C62828' },
  used: { color: '#9CA3AF' },
};

const styles = StyleSheet.create({
  box: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
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