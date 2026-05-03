import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#9CA3AF" />
      <TextInput
        placeholder="Search"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
    borderRadius: 50,

    paddingHorizontal: 16,
    height: 45,
    marginTop: 12,
  },

  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
});