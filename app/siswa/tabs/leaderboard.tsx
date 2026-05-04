import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { COLORS, containerHeader, scrollContent } from '@/utils/theme';
import AppHeaderWOsearch from '@/src/components/common/appheaderWOsearch';
import Card from '@/src/components/common/card';

const { width } = Dimensions.get('window');

// Data dummy 
const RANKING_DATA = [
  { id: '1', name: 'Arstellian', xp: 500, avatar: require('@/assets/images/miniong.jpeg') },
  { id: '2', name: 'Laury', xp: 300, avatar: require('@/assets/images/avatar1.jpeg') },
  { id: '3', name: 'Gledis', xp: 299, avatar: require('@/assets/images/avatar2.jpeg') },
  { id: '4', name: 'Misel', xp: 200, avatar: require('@/assets/images/avatar3.jpeg') },
  { id: '5', name: 'Vivi', xp: 200, avatar: require('@/assets/images/avatar4.jpeg') },
  { id: '6', name: 'Exsel', xp: 200, avatar: require('@/assets/images/avatar5.jpeg') },
  { id: '7', name: 'Aristo', xp: 200, avatar: require('@/assets/images/avatar6.jpeg') },
  { id: '8', name: 'Dewa', xp: 150, avatar: require('@/assets/images/avatar7.jpeg') },
  { id: '9', name: 'Cherryl', xp: 100, avatar: require('@/assets/images/avatar8.jpeg') },
  { id: '10', name: 'Valderio', xp: 50, avatar: require('@/assets/images/avatar9.jpeg') },
];

export default function LeaderboardSiswa() {
  // Ganti string ini dengan data user yang sedang login dari Auth/Firebase kamu
  const CURRENT_USER_NAME = "Arsya"; 

  const topThree = RANKING_DATA.slice(0, 3);
  const others = RANKING_DATA.slice(3, 10);

  // Helper untuk merender item podium agar DRY (Reuse logika)
  const renderPodiumItem = (user: any, rank: number, height: number, color: string) => {
    const isMe = user.name === CURRENT_USER_NAME;
    const medals = ['', '🥇', '🥈', '🥉'];

    return (
      <View style={styles.podiumItem}>
        {rank === 1 && <Text style={styles.crownIcon}>👑</Text>}
        <View style={styles.avatarWrapper}>
          <Image 
            source={user.avatar} 
            style={[
                rank === 1 ? styles.avatarMain : styles.avatarSecondary,
                isMe && { borderColor: COLORS.primary, borderWidth: 3 }
            ]} 
          />
          <Text style={styles.medalIcon}>{medals[rank]}</Text>
        </View>
        <Text style={[styles.namePodium, isMe && { color: COLORS.primary }]}>
            {user.name}{isMe ? ' (Anda)' : ''}
        </Text>
        <View style={[styles.xpBadge, isMe && { backgroundColor: COLORS.primary }]}>
            <Text style={[styles.xpText, isMe && { color: 'white' }]}>{user.xp} XP</Text>
        </View>
        <View style={[styles.step, { height, backgroundColor: color }]}>
          <Text style={styles.stepNumber}>{rank}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[containerHeader, { justifyContent: 'flex-start', alignItems: 'stretch' }]}>
      <AppHeaderWOsearch />
      
      <View/>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[scrollContent, { paddingTop: 50 }]}>
        
        {/* SECTION PODIUM */}
        <View style={styles.podiumContainer}>
          {renderPodiumItem(topThree[1], 2, 110, '#8ED7FF')}
          {renderPodiumItem(topThree[0], 1, 150, '#39B3FF')}
          {renderPodiumItem(topThree[2], 3, 90, '#A8E1FF')}
        </View>

        {/* SECTION LIST RANKING */}
        <Card style={styles.listCard}>
          {others.map((item) => {
            const isMe = item.name === CURRENT_USER_NAME;
            return (
              <View key={item.id} style={[styles.rankRow, isMe && styles.highlightRow]}>
                <View style={[styles.rankNumberCircle, isMe && {backgroundColor: COLORS.primary}]}>
                  <Text style={[styles.rankNumberText, isMe && {color: 'white'}]}>{item.id}</Text>
                </View>
                <Image source={item.avatar} style={styles.rankAvatar} />
                <Text style={[styles.rankName, isMe && {color: COLORS.primary}]}>
                    {item.name}{isMe ? ' (Anda)' : ''}
                </Text>
                <Text style={[styles.rankXP, isMe && {fontSize: 16}]}>{item.xp}XP</Text>
              </View>
            );
          })}
        </Card>
        
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  blueCurveBackground: {
    position: 'absolute',
    top: 0,
    width: width * 2.2,
    height: 500,
    borderRadius: width * 1.1,
    backgroundColor: '#EBF7FF',
    alignSelf: 'center',
    transform: [{ translateY: -60 }],
    zIndex: -1,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 10,
  },
  
  podiumItem: { 
    alignItems: 'center', 
    marginHorizontal: -2 
  },

  avatarWrapper: { 
    position: 'relative', 
    alignItems: 'center' 
  },

  avatarMain: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderColor: 'white', 
    borderWidth: 3 
  },

  avatarSecondary: { 
    width: 65, 
    height: 65, 
    borderRadius: 40, 
    borderColor: 'white', 
    borderWidth: 2 
  },

  medalIcon: { 
    position: 'absolute', 
    bottom: -2, 
    left: -5, 
    fontSize: 18 
  },

  crownIcon: { 
    fontSize: 24, 
    marginBottom: -5 
  },

  namePodium: { 
    fontWeight: 'bold', 
    fontSize: 13, 
    color: COLORS.textMain, 
    marginTop: 4 
  },

  xpBadge: { 
    backgroundColor: '#D1EFFF', 
    paddingHorizontal: 10, 
    paddingVertical: 2, 
    borderRadius: 10, 
    marginVertical: 6 
  },

  xpText: { 
    fontSize: 10, 
    color: COLORS.primary, 
    fontWeight: 'bold' 
  },
  step: { 
    width: (width - 70) / 3, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingTop: 10, 
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12 },

  stepNumber: { 
    fontSize: 42, 
    fontWeight: 'bold', 
    color: 'white', 
    opacity: 0.9 },
  
  listCard: {
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#BDE4FF',
  },
  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  highlightRow: {
    backgroundColor: '#F0F9FF',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: -5,
    borderWidth: 1,
    borderColor: '#39B3FF'
  },

  rankNumberCircle: { 
    width: 26, 
    height: 26, 
    borderRadius: 13, 
    borderWidth: 1, 
    borderColor: COLORS.primary, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  rankNumberText: { 
    fontSize: 12, 
    color: COLORS.primary, 
    fontWeight: 'bold' 
  },
  rankAvatar: { 
    width: 35, 
    height: 35, 
    marginHorizontal: 12 
  },

  rankName: { 
    flex: 1, 
    fontWeight: '700', 
    color: COLORS.textMain, 
    fontSize: 14 
  },
  rankXP: { 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    fontSize: 14 },
});