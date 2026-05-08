import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameHeader({
  title = 'Game',
  level = 1,
  hearts = 3,
}: any) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FFFFFF', '#DDF3FF', '#ADDFFD']} // 🔥 smooth gradient
      locations={[0, 0.4, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      
      {/* 🔙 BACK */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color="#1A3B5D" />
      </TouchableOpacity>

      {/* 🎮 CARD */}
      <View style={styles.card}>
        <Image
          source={require('../../../assets/images/siapakahAku.png')}
          style={styles.icon}
        />

        <View style={styles.textWrapper}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.level}>Level {level}</Text>
        </View>
      </View>

      {/* ❤️ HEART */}
      <View style={styles.heart}>
        <Ionicons name="heart" size={16} color="#FF4D4F" />
        <Text style={styles.heartText}>{hearts}</Text>
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 18,

    // 🔥 shadow biar floating
    shadowColor: '#5CBEFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  backBtn: {
    padding: 6,
  },

  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    marginLeft: 8,

    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#5CBEFA',

    elevation: 3,
  },

  icon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },

  textWrapper: {
    justifyContent: 'center',
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A3B5D',
  },

  level: {
    fontSize: 11,
    color: '#666',
  },

  heart: {
    marginLeft: 10,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 20,
    elevation: 2,
  },

  heartText: {
    marginLeft: 5,
    fontWeight: '600',
    color: '#1A3B5D',
  },
});