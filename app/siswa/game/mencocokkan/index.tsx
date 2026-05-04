import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import LevelNode from '../../../../src/components/game/levelnode';
import { COLORS } from '../../../../utils/theme'

export default function MencocokkanRoadmap() {
  const router = useRouter();

  const levels = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    unlocked: i < 3, // 3 level pertama terbuka
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayo Mencocokkan</Text>

      <FlatList
        data={levels}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <LevelNode
            level={item.id}
            unlocked={item.unlocked}
            onPress={() =>
              router.push(`/siswa/game/mencocokkan/level/${item.id}`)
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },

  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1A3B5D',
  },

  list: {
    alignItems: 'center',
    paddingBottom: 100,
  },
});