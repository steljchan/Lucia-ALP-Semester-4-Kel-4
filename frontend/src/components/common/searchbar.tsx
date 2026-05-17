import {View, TextInput, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '@/utils/theme';

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
      <Ionicons name="search" size={18} color={COLORS.darkGray} />

      <TextInput
        value={value}                
        onChangeText={onChangeText} 
        placeholder={placeholder}
        placeholderTextColor={COLORS.darkGray}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
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