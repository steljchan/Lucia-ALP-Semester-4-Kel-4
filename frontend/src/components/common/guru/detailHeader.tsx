import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS } from '@/utils/theme';

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  onEdit?: () => void;
  showBackButton?: boolean;
}

export default function DetailHeader({
  title,
  subtitle,
  onEdit,
  showBackButton = true,
}: DetailHeaderProps) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FFFFFF', '#ADDFFD']}
      style={styles.header}
    >
      <View style={styles.headerRow}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={COLORS.textMain}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}

        <Text style={styles.headerTitle}>
          {title}
        </Text>

        {onEdit ? (
          <TouchableOpacity
            onPress={onEdit}
            style={styles.editButton}
          >
            <Ionicons
              name="pencil"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {subtitle && (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    marginBottom: 12,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  backButton: {
    padding: 8,
  },

  editButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textMain,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.textMain,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.8,
  },
});