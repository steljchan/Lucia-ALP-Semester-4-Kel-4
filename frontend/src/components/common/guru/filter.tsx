import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import { COLORS } from '@/utils/theme';

type FilterChipsProps = {
  data: string[];
  selected: string;
  onSelect: (value: string) => void;
};

export default function FilterChips({
  data,
  selected,
  onSelect,
}: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {data.map((item, index) => {
        const active = selected === item;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(item)}
            style={[
              styles.filterBtn,
              active && styles.filterActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                active && styles.activeText,
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
    paddingRight: 10,
    marginBottom: 20,
  },

  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 10,
  },

  filterActive: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  activeText: {
    color: COLORS.white,
  },
});