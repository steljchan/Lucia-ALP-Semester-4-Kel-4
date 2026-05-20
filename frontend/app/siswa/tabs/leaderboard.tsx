import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { COLORS, containerHeader, scrollContent, SPACING } from '@/utils/theme';
import AppHeaderWOsearch from '@/src/components/common/appheaderWOsearch';
import Card from '@/src/components/common/card';

import { auth, db } from "@/src/config/firebase";
import { doc, onSnapshot, collection, query, where, orderBy, limit } from "firebase/firestore";

const { width } = Dimensions.get('window');

export default function LeaderboardSiswa() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const CURRENT_USER_UID = auth.currentUser?.uid;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    
    const unsubUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userTingkat = docSnap.data().tinkat; 

        const q = query(
          collection(db, "users"),
          where("role", "==", "siswa"),
          where("tinkat", "==", userTingkat), 
          orderBy("xp", "desc"), 
          limit(10)
        );

        const unsubLeaderboard = onSnapshot(q, (querySnapshot) => {
          const list: any[] = [];
          querySnapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() });
          });
          setStudents(list);
          setLoading(false);
        });

        return () => unsubLeaderboard();
      }
    });

    return () => unsubUser();
  }, []);

  
  const topThree = students.slice(0, 3);
  const others = students.slice(3, 10);

  const renderPodiumItem = (user: any, rank: number, height: number, color: string) => {
    if (!user) {
      return (
        <View style={[styles.podiumItem, { opacity: 0.3 }]}>
          <View style={[styles.step, { height, backgroundColor: COLORS.smoothBlue}]} />
        </View>
      );
    }
    
    const isMe = user.id === CURRENT_USER_UID;
    const medals = ['', '🥇', '🥈', '🥉'];

    return (
      <View style={styles.podiumItem}>
        {rank === 1 && <Text style={styles.crownIcon}>👑</Text>}
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }} 
            style={[
                rank === 1 ? styles.avatarMain : styles.avatarSecondary,
                isMe && { borderColor: COLORS.primary, borderWidth: 3 }
            ]} 
          />
          <Text style={styles.medalIcon}>{medals[rank]}</Text>
        </View>
        <Text 
          style={[styles.namePodium, isMe && { color: COLORS.primary }]} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
            {user.name}
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={scrollContent}>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>
            Leaderboard {students[0]?.tinkat || ""} 🏆
          </Text>
        </View>
        {/* 3 terartas */}
        <View style={styles.podiumContainer}>
          {renderPodiumItem(topThree[1], 2, 110, COLORS.secondary)}
          {renderPodiumItem(topThree[0], 1, 150, COLORS.primary)}
          {renderPodiumItem(topThree[2], 3, 90, COLORS.secondary)}
        </View>
      <View>
    </View>

        <Card style={styles.listCard}>
          {others.map((item, index) => { 
            const isMe = item.id === CURRENT_USER_UID;
            return (
              <View key={item.id} style={[styles.rankRow, isMe && styles.highlightRow]}>
                <View style={[styles.rankNumberCircle, isMe && {backgroundColor: COLORS.primary}]}>
                  <Text style={[styles.rankNumberText, isMe && {color: 'white'}]}>{index + 4}</Text>
                </View>
                
                <Image 
                  source={{ uri: item.profilePicture || 'https://via.placeholder.com/150' }} 
                  style={styles.rankAvatar} 
                />
            
                <Text style={[styles.rankName, isMe && {color: COLORS.primary}]}>{item.name}</Text>
                <Text style={[styles.rankXP, isMe && {fontSize: 16}]}>{item.xp} XP</Text>
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
    borderColor: COLORS.smoothBlue, 
    borderWidth: 3 
  },

  avatarSecondary: { 
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    borderColor: COLORS.white, 
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
    marginTop: 4, 
    width: width * 0.28,
    height: 20,
    textAlign: "center",
  },

  xpBadge: { 
    backgroundColor: COLORS.smoothBlue, 
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
    borderTopRightRadius: 12 
  },
  
  stepNumber: { 
    fontSize: 42, 
    fontWeight: 'bold', 
    color: COLORS.white, 
    opacity: 0.9 
  },
  
  listCard: {
    marginTop: 20,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.smoothBlue,
  },

  rankRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.smoothBlue
  },
  
  highlightRow: {
    backgroundColor: COLORS.smoothBlue,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: -5,
    borderWidth: 1,
    borderColor: COLORS.primary
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
    marginHorizontal: 12, 
    borderRadius: 17.5,
  },

  rankName: { 
    flex: 1, fontWeight: '700', 
    color: COLORS.textMain, 
    fontSize: 14 },

  rankXP: { 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    fontSize: 14 },
});
