import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#9CA3AF" />

      <TextInput
        value={value}                 // 🔥 tambah ini
        onChangeText={onChangeText}   // 🔥 tambah ini
        placeholder={placeholder}
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