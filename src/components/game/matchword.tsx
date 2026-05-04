import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MatchWord({ word, onPress, disabled }: any) {
  return (
    <TouchableOpacity
      style={styles.box}
      onPress={() => onPress(word)}
      disabled={disabled}
    >
      <Text style={styles.text}>{word}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E6F2FF',
    marginVertical: 8,
  },
  text: {
    fontWeight: '600',
  },
});