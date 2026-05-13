import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/utils/theme';

type Props = {
  title: string;
  rightText?: string;
  onRightPress?: () => void;
};

export default function AppHeaderSimple({
  title,
  rightText,
  onRightPress,
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>

      {rightText ? (
        <TouchableOpacity onPress={onRightPress}>
          <Text style={styles.rightText}>{rightText}</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 22 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 60,
    paddingTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  rightText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});