import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BORDER_RADIUS, COLORS } from '@/utils/theme';
import DetailHeader from '@/src/components/common/guru/detailHeader';

//firebase
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/config/firebase";

export default function DetailNilai() {
  const params = useLocalSearchParams();

  const { userId, materialId, name, nis, mapel } = params;

  const [userQuizzes, setUserQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGrades = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "quizResults"),
          where("userId", "==", userId),
          where("materialId", "==", materialId)
        );
        
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserQuizzes(data);
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId && materialId) {
      fetchUserGrades();
    }
  }, [userId, materialId]);

  const totalRataRata = userQuizzes.length > 0 
    ? (userQuizzes.reduce((acc, curr) => acc + (curr.score || 0), 0) / userQuizzes.length).toFixed(0)
    : "0";

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>

        <DetailHeader
          title="Detail Nilai"
        />

        <View style={styles.profile}>
          <Image
            source={require('@/assets/images/maskotMTK.png')}
            style={styles.avatar}
          />

          <View style={styles.classBadge}>
            <Text style={styles.classText}>SMP 7</Text>
          </View>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.nis}>{nis}</Text>

          <View style={styles.emailBadge}>
            <Text style={styles.emailText}>{name}@student.SLBN1.ac.id</Text>
          </View>
        </View>

        <View style={styles.card}>
          
          <View style={styles.topicRow}>
            <View>
              <Text style={styles.topicTitle}>{mapel}</Text>
              <Text style={styles.topicDesc}>Cara menghitung mata uang</Text>
            </View>

            <View style={styles.scoreRight}>
              <Text style={styles.score}>{totalRataRata}</Text>
              <View style={styles.bar}/>
            </View>
          </View>

          <View style={styles.divider} />

          {loading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : userQuizzes.length === 0 ? (
            <Text style={{ textAlign: 'center', color: COLORS.textSub }}>Belum ada data kuis.</Text>
          ) : (
            userQuizzes.map((q, i) => (
              <View key={i} style={styles.quizItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quizTitle}>{q.quizTitle || `Kuis ${i+1}`}</Text>
                  <Text style={styles.quizDesc}>{q.desc || 'Telah diselesaikan'}</Text>
                </View>
                <View style={styles.scoreRight}>
                  <Text style={styles.score}>{q.score}</Text>
                  <View style={styles.bar}/>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  profile: {
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  classBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: -15,
  },

  classText: {
    color: COLORS.white,
    fontSize: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginTop: 8,
  },

  nis: {
    color: COLORS.textSub,
  },

  emailBadge: {
    backgroundColor: COLORS.smoothBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.l,
    marginTop: 6,
  },

  emailText: {
    fontSize: 12,
    color: COLORS.textMain,
  },

  card: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },

  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  topicTitle: {
    fontWeight: 'bold',
    color: COLORS.textMain,
  },

  topicDesc: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  quizItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  quizTitle: {
    fontWeight: 'bold',
    color: COLORS.textMain,
  },

  quizDesc: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  scoreRight: {
    alignItems: 'flex-end',
  },

  score: {
    fontWeight: 'bold',
    color: COLORS.textMain,
  },

  bar: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.l,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.gray,
    marginVertical: 10,
  },
});