import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '@/utils/theme';
import DetailHeader from '@/src/components/common/guru/detailHeader';

export default function ScoreScreen() {
  const router = useRouter();
  const { score, correct, wrong, skipped, total, answers } = useLocalSearchParams();

  const correctNum = parseInt(correct as string) || 0;
  const wrongNum = parseInt(wrong as string) || 0;
  const skippedNum = parseInt(skipped as string) || 0;
  const totalNum = parseInt(total as string) || 1;
  const scoreNum = parseInt(score as string) || 0;
  const progress = totalNum ? (correctNum / totalNum) * 100 : 0;

  const [openPembahasan, setOpenPembahasan] = useState<Record<number, boolean>>({});
  const togglePembahasan = (index: number) => {
    setOpenPembahasan(prev => ({ ...prev, [index]: !prev[index] }));
  };

  let parsedAnswers: any[] = [];
  try {
    parsedAnswers = answers ? JSON.parse(answers as string) : [];
    if (!Array.isArray(parsedAnswers)) parsedAnswers = [];
  } catch (e) {
    parsedAnswers = [];
  }

  const getCircleColor = (option: string, correctAnswer: string, userAnswer: string | null, isSkipped: boolean, isCorrectAnswer: boolean) => {
    if (isSkipped && isCorrectAnswer) return COLORS.yellow;
    if (!isSkipped && userAnswer === option) {
      if (option === correctAnswer) return COLORS.success;
      return COLORS.error;
    }
    if (option === correctAnswer) return COLORS.success;
    return COLORS.primary;
  };

  const imageMap: any = {
    seratus: require('@/assets/images/materi/seratus.jpg'),
    limapuluh: require('@/assets/images/materi/limapuluh.jpg'),
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <DetailHeader
        title="Score"
        subtitle="Hasil Quiz Kamu"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mascotWrapper}>
          <Image source={require('@/assets/images/maskot1.png')} style={styles.mascot} resizeMode="contain" />
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>CONGRATULATIONS</Text>
            <Text style={styles.subtitle}>Kamu mendapatkan nilai {scoreNum}!</Text>
            <View style={styles.progressBar}>
              <View style={[styles.fill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Ionicons name="document-text-outline" size={28} color={COLORS.primary} />
                <Text style={styles.statNumber}>{totalNum}</Text>
                <Text style={styles.statLabel}>Total Soal</Text>
              </View>

              <View style={styles.verticalDivider} />
              <View style={styles.statBox}>
                <Ionicons name="checkmark-circle-outline" size={28} color={COLORS.success} />
                <Text style={[styles.statNumber, { color: COLORS.success }]}>{correctNum}</Text>
                <Text style={styles.statLabel}>Benar</Text>
              </View>

              <View style={styles.verticalDivider} />
              <View style={styles.statBox}>
                <Ionicons name="close-circle-outline" size={28} color={COLORS.error} />
                <Text style={[styles.statNumber, { color: COLORS.error }]}>{wrongNum}</Text>
                <Text style={styles.statLabel}>Salah</Text>
              </View>

              <View style={styles.verticalDivider} />
              <View style={styles.statBox}>
                <Ionicons name="hourglass-outline" size={28} color={COLORS.yellow} />
                <Text style={[styles.statNumber, { color: COLORS.yellow }]}>{skippedNum}</Text>
                <Text style={styles.statLabel}>Kosong</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pembahasan Jawaban</Text>
        <View style={styles.quizContainer}>
          {parsedAnswers.map((item, index) => {
            const letter = (i: number) => String.fromCharCode(65 + i);
            const isSkipped = item.status === 'skipped' || item.userAnswer === null;

            return (
              <View key={index} style={styles.quizCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.questionNumber}>Soal {index + 1}</Text>
                  {isSkipped && (
                    <View style={styles.skippedBadge}>
                      <Ionicons name="time-outline" size={16} color={COLORS.yellow} />
                      <Text style={styles.skippedBadgeText}>Skip</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.questionText}>{item.question}</Text>
                <Image
                  source={imageMap[item.image]}
                  style={styles.questionImage}
                  resizeMode="contain"
                />

                {item.options.map((option: string, i: number) => {
                  const isCorrectAnswer = option === item.correctAnswer;
                  const isUserAnswer = !isSkipped && option === item.userAnswer;
                  const isUserCorrect = isUserAnswer && item.isCorrect;
                  const isUserWrong = isUserAnswer && !item.isCorrect;

                  let optionBg = COLORS.white;
                  let borderColor = '#E5E7EB'; 

                  if (isUserCorrect) {
                    optionBg = '#D8FAE5';
                    borderColor = COLORS.success;
                  } else if (isUserWrong) {
                    optionBg = '#F9C3C4';
                    borderColor = COLORS.error;
                  } else if (isSkipped && isCorrectAnswer) {
                    optionBg = '#FEF3C7';
                    borderColor = COLORS.yellow;
                  } else if (!isSkipped && !isUserAnswer && isCorrectAnswer) {
                    optionBg = '#D8FAE5';
                    borderColor = COLORS.success;
                  }

                  const circleColor = getCircleColor(option, item.correctAnswer, item.userAnswer, isSkipped, isCorrectAnswer);

                  let rightIcon = null;
                  if (isUserCorrect) rightIcon = <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />;
                  else if (isUserWrong) rightIcon = <Ionicons name="close-circle" size={22} color={COLORS.error} />;
                  else if (!isSkipped && !isUserAnswer && isCorrectAnswer) rightIcon = <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />;
                  else if (isSkipped && isCorrectAnswer) rightIcon = <Ionicons name="checkmark-circle" size={22} color={COLORS.yellow} />;

                  return (
                    <View key={i} style={[styles.option, { backgroundColor: optionBg, borderColor }]}>
                      <View style={[styles.optionLetterBox, { backgroundColor: circleColor }]}>
                        <Text style={styles.optionLetterText}>{letter(i)}</Text>
                      </View>
                      <Text style={styles.optionText}>{option}</Text>
                      {rightIcon}
                    </View>
                  );
                })}

                <TouchableOpacity style={styles.dropdownButton} onPress={() => togglePembahasan(index)}>
                  <Text style={styles.dropdownButtonText}>
                    {openPembahasan[index] ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan'}
                  </Text>
                </TouchableOpacity>

                {openPembahasan[index] && (
                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>Pembahasan:</Text>
                    <Text style={styles.explanationText}>Jawaban benar: {item.correctAnswer}</Text>
                    <Text style={styles.explanationText}>
                      Jawaban kamu: {isSkipped ? 'Tidak dijawab' : (item.userAnswer ?? 'Tidak dijawab')}
                    </Text>
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
    marginVertical: 12,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },

  verticalDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    marginHorizontal: 8,
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
    color: COLORS.textMain,
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
    paddingVertical: 8,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 2,
    textAlign: 'center',
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.textMain,
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
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  questionNumber: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  questionImage: {
    width: '100%',
    height: 180,
    marginBottom: 14,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },

  optionLetterBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  optionLetterText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },

  optionText: {
    fontSize: 14,
    color: COLORS.textMain,
    flex: 1,
  },

  skippedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },

  skippedBadgeText: {
    color: COLORS.yellow,
    fontWeight: '600',
    fontSize: 12,
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