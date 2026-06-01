import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BORDER_RADIUS, COLORS } from '@/utils/theme';
import DetailHeader from '@/src/components/common/guru/detailHeader';

//firebase
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db, } from "@/src/config/firebase";

export default function DetailNilai() {
  const { userId, materialId, mapel } = useLocalSearchParams();
  
  const [userData, setUserData] = useState<any>(null);
  const [userQuizzes, setUserQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);

       
        const userSnap = await getDoc(doc(db, "users", userId as string));
        if (userSnap.exists()) setUserData(userSnap.data());

        
        const q = materialId 
          ? query(collection(db, "quizResult"), where("userId", "==", userId), where("materialId", "==", materialId))
          : query(collection(db, "quizResult"), where("userId", "==", userId));
          
        const quizSnap = await getDocs(q);
        
       
        const quizWithMaterialNames = await Promise.all(
          quizSnap.docs.map(async (quizDoc) => {
            const data = quizDoc.data();
            let materialName = "Materi tidak ditemukan";

            
            if (data.materialId) {
              const matRef = doc(db, "material", data.materialId);
              const matSnap = await getDoc(matRef);
              if (matSnap.exists()) {
               
                materialName = matSnap.data().title || matSnap.data().description || "Tanpa Judul";
              }
            }

            return {
              id: quizDoc.id,
              ...data,
              materialTitle: materialName // Simpan nama materi asli di sini
            };
          })
        );

        setUserQuizzes(quizWithMaterialNames);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, materialId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={COLORS.primary} />;

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>

        <DetailHeader
          title="Detail Nilai"
        />

        <View style={styles.profile}>
          <Image
            source={userData?.profilePicture ? { uri: userData.profilePicture } : { uri: 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />

          <View style={styles.classBadge}>
            <Text style={styles.classText}>
               {`${userData?.tingkat || "Tingkat"} ${userData?.kelas || "Kelas"}`} 
            </Text>
          </View>

          <Text style={styles.name}>{userData?.name || "Nama Siswa"}</Text>
          <Text style={styles.nis}>{userData?.nis || "NIS"}</Text>

          <View style={styles.emailBadge}>
            <Text style={styles.emailText}>{userData?.email}</Text>
          </View>
        </View>

        <View style={styles.card}>
    
          <View style={styles.topicRow}>
            <View>
              <Text style={styles.topicTitle}>{mapel}</Text>
              <Text style={styles.topicDesc}>Cara menghitung mata uang</Text>
            </View>

            <View style={styles.scoreRight}>
              <Text style={styles.score}>
                {userQuizzes.length > 0 
                  ? (userQuizzes.reduce((acc, curr) => acc + (curr.score || 0), 0) / userQuizzes.length).toFixed(0) 
                  : 0}
              </Text>
              <View style={styles.bar}/>
            </View>
          </View>

          <View style={styles.divider} />

          {userQuizzes.map((quiz, i) => (
            <View key={i} style={styles.quizItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.quizTitle}>
                  {mapel} | {quiz.materialTitle}
                </Text>
                <Text style={styles.quizDesc}>
                  Selesai pada: {quiz.timestamp?.toDate().toLocaleDateString('id-ID')}
                </Text>
              </View>
              <View style={styles.scoreRight}>
                <Text style={styles.score}>{quiz.score}</Text>
                <View style={styles.bar}/>
              </View>
            </View>
          ))}
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