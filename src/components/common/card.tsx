import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../../../utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle; 
}

const Card = ({ children, style }: CardProps) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 30, 
    padding: SPACING.lg,
    // Efek Shadow & Border standar Lucia
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#EAF6FF',
  },
});

export default Card;