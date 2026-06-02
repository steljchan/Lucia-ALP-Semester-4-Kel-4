import {TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';
import {COLORS} from '@/utils/theme';

type Props = {
  icon?: string;
  text?: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  flex?: number;
  style?: ViewStyle;
};

export default function GameActionButton({
  icon,
  text,
  color,
  onPress,
  disabled = false,
  flex = 0,
  style,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: color,
          opacity: disabled ? 0.5 : 1,
          flex,
        },
        style,
      ]}
    >
      {icon && (
        <Text style={styles.icon}>
          {icon}
        </Text>
      )}

      {text && (
        <Text style={styles.text}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 55,
    minWidth: 55,
    paddingHorizontal: 20,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  icon: {
    fontSize: 22,
    color: COLORS.white,
  },

  text: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
});