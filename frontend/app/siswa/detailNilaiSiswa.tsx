import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';

//firebase
import {auth, db} from '@/src/config/firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';

// const QUIZ_DATA = [
//   {title: 'Quiz 1:', desc: 'Mengenal Mata Uang yang terdapat di Indonesia', score: 90,},
//   {title: 'Quiz 2:', desc: 'Mempelajari Perhitungan Mata Uang Indonesia', score: 100},
//   {title: 'Quiz 3:', desc: 'Mahir dalam Menghitung Mata Uang Indonesia', score: 80},
//   {title: 'Final Quiz', desc: '', score: 90},
// ];

export default function DetailNilaiSiswa() {
  const router = useRouter();
  const { subject, score, grade } = useLocalSearchParams();

  const [userQuizzes, setUserQuizzes] = useState<any[]>([]);
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const subjectName = subject;
  const finalGrade = score;
  const gradeLetter = grade;
  const topicName = userQuizzes.length > 0 ? userQuizzes[0].materialName : 'Belum ada kuis';
  const topicScore = userQuizzes.length > 0 ? userQuizzes[0].score : 0;

  // const imageMap: any = {
  //   Inggris: require('@/assets/images/materi/Inggris.png'),
  //   Matematika: require('@/assets/images/materi/Matematika.png'),
  //   IPA: require('@/assets/images/materi/IPA.png'),
  //   Indonesia: require('@/assets/images/materi/Indonesia.png'),
  // };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user || !subjectName) return;

      try {
        setLoading(true);

        // 1. Ambil data Subject (Gunakan field imageUrl agar sama dengan beranda)
        // Kita cari berdasarkan name karena ID di firebase kamu adalah ID Random, bukan "Matematika"
        const qSub = query(collection(db, 'subject'), where('name', '==', subjectName));
        const subSnap = await getDocs(qSub);
        if (!subSnap.empty) {
          const subData = subSnap.docs[0].data();
          setSubjectImage(subData.imageUrl || subData.image); 
        }

        
        const q = query(
          collection(db, 'quizResult'),
          where('userId', '==', user.uid),
          where('subjectId', '==', subjectName), // Jika ini ID, pastikan params yang dikirim juga ID
          orderBy('timestamp', 'asc')
        );

        const querySnapshot = await getDocs(q);
        
        // 3. Ambil Nama Materi untuk setiap kuis secara paralel
        const quizWithMaterialNames = await Promise.all(
          querySnapshot.docs.map(async (quizDoc, index) => {
            const data = quizDoc.data();
            let materialName = "Materi Kuis";

            
            if (data.materialId) {
              const matRef = doc(db, 'material', data.materialId);
              const matSnap = await getDoc(matRef);
              if (matSnap.exists()) {
                materialName = matSnap.data().title; 
              }
            }

            return {
              id: quizDoc.id,
              
              title: `Quiz ${index + 1}: ${materialName}`, 
              materialName: materialName,
              score: data.score || 0,
            };
          })
        );

        setUserQuizzes(quizWithMaterialNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectName]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Tetap Sama */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{subjectName}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.card}>
          <View style={styles.sectionDivider}>
            <View style={styles.line} /><Text style={styles.sectionText}>Nilai</Text><View style={styles.line} />
          </View>
          <View style={styles.gradeRecapRow}>
            <View style={styles.gradeLeft}>
              <Text style={styles.gradeNumberLarge}>{finalGrade}</Text>
              <Text style={styles.gradeLetterLarge}>{gradeLetter}</Text>
            </View>
            <View style={styles.gradeRight}>
              {subjectImage ? (
                <Image source={{ uri: subjectImage }} style={styles.subjectImage} />
              ) : (
                <View style={[styles.subjectImage, { backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }]}>
                   <Ionicons name="image-outline" size={40} color="#CCC" />
                </View>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.quizSectionTitle}>Quiz</Text>
        
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.card}>
            <View style={styles.topicRow}>
              <View style={styles.topicLeft}>
                <Text style={styles.topicTitle}>Topic 1</Text>
                <Text style={styles.topicDesc}>{topicName}</Text>
              </View>
              <View style={styles.scoreRight}>
                <Text style={styles.topicScoreText}>{topicScore}</Text>
                <View style={styles.bar} />
              </View>
            </View>

            {userQuizzes.map((quiz, index) => (
              <View key={index} style={styles.quizItem}>
                <View style={styles.quizLeft}>
                  {/* Judul sekarang berisi "Quiz 1: [Nama Materi]" */}
                  <Text style={styles.quizTitle}>{quiz.title}</Text>
                </View>
                <View style={styles.scoreRight}>
                  <Text style={styles.scoreText}>{quiz.score}</Text>
                  <View style={styles.bar} />
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.textMain,
  },
  sectionText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  gradeRecapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradeLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  gradeNumberLarge: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 12,
  },
  gradeLetterLarge: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  gradeRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 15,
  },
  quizSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray,
  },
  topicLeft: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  topicDesc: {
    fontSize: 13,
    color: COLORS.textSub,
    marginTop: 2,
  },
  topicScoreText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.primary,
  },
  quizItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  quizLeft: {
    flex: 1,
  },
  quizTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.textMain,
  },
  quizDesc: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 2,
  },
  scoreRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  scoreText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.textMain,
  },
  bar: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginTop: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});