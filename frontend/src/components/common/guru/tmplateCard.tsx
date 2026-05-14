import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { moreSubtitle, subtitle, COLORS } from '@/utils/theme';
import Card from '../card';
// import { useLocalSearchParams,} from 'expo-router';

interface TemplateCardProps {
  item: {
    id: string;
    title: string;
    previewUrl: string; 
    tmpltUrl: string;   
    category: string;
    imageUrl: any;
  };
  isGridView: boolean;
  onPress: (item: any) => void; 
}


export default function TemplateCard({ item, isGridView, onPress }: TemplateCardProps) {
    return (
    <Card 
      style={StyleSheet.flatten([
        styles.cardBase, 
        isGridView ? styles.cardHalf : styles.cardFull
      ])}
    >
      <TouchableOpacity onPress={() => onPress(item)}>
        <Image 
            source={item.imageUrl}
            style={isGridView ? styles.imageGrid : styles.imageFull} 
        />
        <View style={styles.cardInfo}>
          <Text 
            style={isGridView ? moreSubtitle : subtitle} 
            numberOfLines={isGridView ? 2 : 1} 
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    padding: 0, 
    // overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: COLORS.white ,
    borderRadius: 20,
    elevation: 2,
  },
    cardFull: { 
        width: '100%' 
    },
    
    cardHalf: { 
        width: '48%', 
        aspectRatio: 16 / 14 
    },
    imageFull: { 
        width: '100%', 
        height: 180, 
        resizeMode: 'cover' 
    },
    imageGrid: { width: '100%', 
        height: 100, 
        resizeMode: 'cover' 
    },
    cardInfo: { 
        padding: 10, 
        justifyContent: 'center' 
    },
});