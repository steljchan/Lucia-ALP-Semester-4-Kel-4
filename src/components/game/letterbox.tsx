import { View, Text, StyleSheet } from 'react-native';

export default function LetterBox({ letter }: any) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{letter || ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#5CBEFA',

    justifyContent: 'center',
    alignItems: 'center',

    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
  },

  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A3B5D',
  },
});