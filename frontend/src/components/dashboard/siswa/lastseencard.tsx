import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

interface LastSeenCardProps {
  title: string;
  subtitle: string;
  image: any;
  onPress?: () => void;
}

export default function LastSeenCard({
  title,
  subtitle,
  image,
  onPress,
}: LastSeenCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    marginTop: 10,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  image: {
    width: 75,
    height: 75,
    marginRight: 14,
    resizeMode: 'contain',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontWeight: '600',
    fontSize: 15,
    color: '#1A3B5D',
  },

  subtitle: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
  },
});