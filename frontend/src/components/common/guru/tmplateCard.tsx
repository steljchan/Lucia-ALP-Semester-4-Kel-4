import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {moreSubtitle, subtitle, COLORS, BORDER_RADIUS} from '@/utils/theme';
import Card from '../card';

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
    marginBottom: 15,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    elevation: 2,
    overflow: 'hidden', 
  },

  cardFull: {
    width: '100%',
  },

  cardHalf: {
    width: '48%',
    aspectRatio: 16 / 14,
  },

  imageFull: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderTopLeftRadius: BORDER_RADIUS.m,
    borderTopRightRadius: BORDER_RADIUS.m,
  },

  imageGrid: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderTopLeftRadius: BORDER_RADIUS.m,
    borderTopRightRadius: BORDER_RADIUS.m,
  },

  cardInfo: {
    padding: 10,
    justifyContent: 'center',
  },
});