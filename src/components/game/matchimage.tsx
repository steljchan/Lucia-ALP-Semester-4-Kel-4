import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MatchImage({ item, onPress, disabled }: any) {
  return (
    <TouchableOpacity
      style={styles.box}
      onPress={() => onPress(item.word)}
      disabled={disabled}
    >
      <Text style={{ fontSize: 30 }}>{item.image}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginVertical: 8,
    elevation: 2,
  },
});