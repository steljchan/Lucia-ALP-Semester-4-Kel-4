import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LevelNode({
  level,
  unlocked,
  onPress,
  stars = 3, 
}: any) {

  const renderStars = () => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3].map((i) => (
          <Ionicons
            key={i}
            name="star"
            size={10}
            color={
              i <= stars
                ? (unlocked ? '#FFC107' : '#AAA')
                : '#E0E0E0'
            }
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!unlocked}
      style={[
        styles.circle,
        unlocked ? styles.unlocked : styles.locked,
      ]}
    >
      <Text style={styles.level}>{level}</Text>

      {/* ⭐ STARS INSIDE */}
      {renderStars()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 4,
  },

  unlocked: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4DA6FF',
  },

  locked: {
    backgroundColor: '#DDD',
  },

  level: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A3B5D',
  },

  starRow: {
    flexDirection: 'row',
    marginTop: 4,
  },

  starIcon: {
    marginHorizontal: 1, // 🔥 spacing antar star
  },
});