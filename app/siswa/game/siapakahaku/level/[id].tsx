import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { siapakahAkuLevels } from '../../../../../src/data/siapakahaku';
import useSiapakahAku from '../../../../../src/hooks/usesiapakahaku';

export default function GamePlay() {
  const { id } = useLocalSearchParams();
  const level = siapakahAkuLevels[Number(id) - 1];

  const { selected, select, isCorrect } = useSiapakahAku(level.answer);

  const options = level.answer.split('').sort(() => Math.random() - 0.5);

  return (
    <View style={{ padding: 20 }}>
      <Text>Siapakah Aku?</Text>

      {/* Answer */}
      <View style={{ flexDirection: 'row' }}>
        {level.answer.split('').map((_, i) => (
          <View key={i} style={{ width: 30, height: 30, borderWidth: 1 }}>
            <Text>{selected[i]}</Text>
          </View>
        ))}
      </View>

      {/* Options */}
      {options.map((l, i) => (
        <TouchableOpacity key={i} onPress={() => select(l)}>
          <Text>{l}</Text>
        </TouchableOpacity>
      ))}

      {isCorrect && <Text>Benar!</Text>}
    </View>
  );
}