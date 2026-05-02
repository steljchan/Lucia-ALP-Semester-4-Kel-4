import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#999" />
      <TextInput 
        placeholder="Search"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 12,
    borderRadius: 20,
    height: 40,
    marginTop: 10,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
});