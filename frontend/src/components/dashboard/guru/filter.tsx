import React from 'react';
import {ScrollView, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';

import { COLORS, subtitle } from '@/utils/theme';

interface FilterChipsProps {
  data: string[];
  selected: string;
  onSelect: (value: string) => void;

  containerStyle?: ViewStyle;
  chipStyle?: ViewStyle;
  activeChipStyle?: ViewStyle;

  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
}

export default function FilterChips({
  data,
  selected,
  onSelect,
  containerStyle,
  chipStyle,
  activeChipStyle,
  textStyle,
  activeTextStyle,
}: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        containerStyle,
      ]}
    >
      {data.map((item) => {
        const active = selected === item;

        return (
          <TouchableOpacity
            key={item}
            onPress={() => onSelect(item)}
            style={[
              styles.chip,
              chipStyle,
              active && styles.activeChip,
              active && activeChipStyle,
            ]}
          >
            <Text
              style={[
                subtitle,
                styles.text,
                textStyle,
                active && styles.activeText,
                active && activeTextStyle,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingRight: 10,
    marginBottom: 10,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: COLORS.primary,
  },

  text: {
    color: COLORS.primary,
  },

  activeText: {
    color: COLORS.white,
  },
});