import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { mencocokkanLevels } from '../../../../../src/data/mencocokkan';
import useMencocokkan from '../../../../../src/hooks/useMencocokkan';

import MatchWord from '../../../../../src/components/game/matchword';
import MatchImage from '../../../../../src/components/game/matchimage';

export default function MatchingGame() {
  const { id } = useLocalSearchParams();
  const level = mencocokkanLevels[Number(id) - 1];

  const {
    selectWord,
    selectImage,
    matched,
    isComplete,
  } = useMencocokkan(level.pairs);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilih Pasangannya</Text>

      <View style={styles.row}>
        
        {/* WORDS */}
        <View style={styles.column}>
          {level.pairs.map((p: any) => (
            <MatchWord
              key={p.word}
              word={p.word}
              onPress={selectWord}
              disabled={matched.includes(p.word)}
            />
          ))}
        </View>

        {/* IMAGES */}
        <View style={styles.column}>
          {level.pairs.map((p: any) => (
            <MatchImage
              key={p.word}
              item={p}
              onPress={selectImage}
              disabled={matched.includes(p.word)}
            />
          ))}
        </View>

      </View>

      {isComplete && <Text>🎉 Selesai!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '45%',
  },
});