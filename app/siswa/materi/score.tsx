import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS } from '@/utils/theme';

export default function ScoreScreen() {
  const router = useRouter();
  const { score, correct, wrong, total } = useLocalSearchParams();
  
  const correctNum = parseInt(correct as string) || 0;
  const wrongNum = parseInt(wrong as string) || 0;
  const totalNum = parseInt(total as string) || 1;
  const scoreNum = parseInt(score as string) || 0;
  const progress = totalNum ? (correctNum / totalNum) * 100 : 0;
  console.log('DEBUG SCORE:', { correctNum, wrongNum, totalNum, scoreNum });
  const [openPembahasan, setOpenPembahasan] = useState<Record<number, boolean>>({});
  const togglePembahasan = (index: number) => {
    setOpenPembahasan(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const { answers } = useLocalSearchParams();
  let parsedAnswers = [];
    try {
      parsedAnswers = answers ? JSON.parse(answers as string) : [];
      if (!Array.isArray(parsedAnswers)) parsedAnswers = [];
    } catch (e) {
      parsedAnswers = [];
    }


  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <LinearGradient colors={['#FFFFFF', '#ADDFFD']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textMain}/>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Score</Text>

          <TouchableOpacity onPress={() => router.push('/siswa/leaderboard')}style={styles.iconButton}>
            <Ionicons name="podium-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.mascotWrapper}>
          <Image source={require('@/assets/images/maskot1.png')} style={styles.mascot} resizeMode="contain"/>
        </View>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>CONGRATULATIONS</Text>
            <Text style={styles.subtitle}>Kamu mendapatkan nilai {scoreNum}!</Text>
            <View style={styles.progressBar}>
              <View style={[styles.fill, {width: `${progress}%`}]} />
            </View>

            <View style={styles.divider}/>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <View style={styles.iconRow}>
                    <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
                    <Text style={styles.statNumber}>{totalNum}</Text>
                  </View>
                  <Text style={styles.statLabel}>Soal Terjawab</Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.statBox}>
                  <View style={styles.iconRow}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#22C55E" />
                    <Text style={[styles.statNumber, { color: '#22C55E' }]}>{correctNum}</Text>
                  </View>
                  <Text style={styles.statLabel}>Benar</Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.statBox}>
                  <View style={styles.iconRow}>
                    <Ionicons name="close-circle-outline" size={24} color="#EF4444" />
                    <Text style={[styles.statNumber, { color: '#EF4444' }]}>{wrongNum}</Text>
                  </View>
                  <Text style={styles.statLabel}>Salah</Text>
                </View>
              </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pembahasan Jawaban</Text>
        <View style={styles.quizContainer}>
          {Array.isArray(parsedAnswers) && parsedAnswers.map((item, index) => {
            const letter = (i: number) => String.fromCharCode(65 + i);
            const isSkipped = item.userAnswer === null;

            return (
              <View key={index} style={styles.quizCard}>
                <Text style={styles.questionNumber}>Soal {index + 1}</Text>
                <Text style={styles.questionText}>{item.number} dibaca sebagai:</Text>

                {item.options.map((option: string, i: number) => {
                  const isCorrect = option === item.correctAnswer;
                  const isUserWrong = option === item.userAnswer && !item.isCorrect;
                  const isSkipped = item.userAnswer === null;

                  return (
                    <View key={i}
                      style={[
                        styles.option,
                        isCorrect && styles.correctOption,
                        isUserWrong && styles.wrongOption
                      ]}>
                      <View style={styles.optionLetterBox}>
                        <Text style={styles.optionLetterText}>{letter(i)}</Text>
                      </View>

                      <Text style={styles.optionText}>{option}</Text>
                      {isSkipped && i === 0 && (
                        <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
                          Tidak dijawab
                        </Text>
                      )}

                      {isCorrect && (
                        <Ionicons name="checkmark-circle" size={22} color="#22C55E" />
                      )}

                      {isUserWrong && (
                        <Ionicons name="close-circle" size={22} color="#FF383C" />
                      )}
                    </View>
                  );
                })}

                <TouchableOpacity style={styles.dropdownButton} onPress={() => togglePembahasan(index)}>
                  <Text style={styles.dropdownButtonText}>
                    {openPembahasan[index]
                      ? "Sembunyikan Pembahasan"
                      : "Lihat Pembahasan"}
                  </Text>
                </TouchableOpacity>

                {openPembahasan[index] && (
                  <View style={styles.explanationBox}>
                    <Text>Pembahasan:</Text>
                    <Text>Jawaban benar: {item.correctAnswer}</Text>
                    <Text>Jawaban kamu: {item.userAnswer ?? 'Tidak dijawab'}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },

  iconButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 8,
    borderRadius: BORDER_RADIUS.s,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  content: {
    padding: SPACING.md,
    paddingTop: 100,
  },

  mascotWrapper: {
    position: 'absolute',
    top: 0, 
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  mascot: {
    width: 200,
    height: 200,
    transform: [{ scale: 1.05 }],
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.s,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    elevation: 3,
    borderWidth: 1, 
    borderColor: COLORS.primary,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.primary,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },

  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.primary,
  },

  cardContent: {
    marginTop: 100,
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color:  COLORS.textMain,
    marginBottom: 16,
  },

  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: COLORS.gray,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },

  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.textMain,
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },

  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  quizSection: {
    marginBottom: SPACING.lg,
  },

  quizContainer: {
    marginTop: 20,
    gap: 16,
  },

  quizCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  questionNumber: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  optionLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  optionLetterBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  
  optionLetterText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  optionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },

  correctOption: {
    backgroundColor: '#D8FAE5',
    borderColor: '#22C55E'
  },

  wrongOption: {
    backgroundColor : '#F9C3C4',
    borderColor : '#FF383C'
  },

  dropdownButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.s,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  dropdownButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },

  explanationBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  explanationTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },

  explanationText: {
    fontSize: 13,
    color: COLORS.textSub,
    lineHeight: 18,
  },
});