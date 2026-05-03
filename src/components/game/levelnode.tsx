import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function LevelNode({ level, unlocked, onPress }: any) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={onPress}
        disabled={!unlocked}
        style={[
          styles.circle,
          unlocked ? styles.active : styles.locked,
        ]}
      >
        <Text style={styles.levelText}>{level}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
    alignItems: 'center',
  },

  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  active: {
    backgroundColor: '#5CBEFA',
    elevation: 5,
  },

  locked: {
    backgroundColor: '#D1D5DB',
  },

  levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});