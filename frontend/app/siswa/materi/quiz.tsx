import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import DetailHeader from '@/src/components/common/guru/detailHeader';

// Firebase
import { db } from '@/src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Helper: hilangkan prefix huruf dari option (contoh: "A. Memompa darah" -> "Memompa darah")
const stripOptionPrefix = (option: string): string => {
  return option.replace(/^[A-D]\.\s*/, '');
};

// Helper: konversi huruf jawaban ke index (A=0, B=1, dst)
const letterToIndex = (letter: string): number => {
  const map: { [key: string]: number } = { A: 0, B: 1, C: 2, D: 3 };
  return map[letter] ?? 0;
};

interface Question {
  questionText: string;
  options: string[]; // sudah di-strip tanpa prefix huruf
  correctAnswer: string; // teks jawaban benar
  correctAnswerIndex: number;
}

export default function QuizScreen() {
  const router = useRouter();
  const { id: materialId } = useLocalSearchParams<{ id: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const skippedRef = useRef(0);
  const answersRef = useRef<any[]>([]);
  const navigatingRef = useRef(false);

  // Fetch quiz dari Firestore
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!materialId) {
        setError('Material ID tidak ditemukan');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'material', materialId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('Materi tidak ditemukan');
          setLoading(false);
          return;
        }

        const data = docSnap.data();
        const quizData = data.quiz;

        if (!quizData || !Array.isArray(quizData) || quizData.length === 0) {
          setError('Quiz belum tersedia. Silakan coba lagi nanti.');
          setLoading(false);
          return;
        }

        // Transformasi data quiz dari backend ke format yang digunakan frontend
        const transformedQuestions: Question[] = quizData.map((item: any) => {
          // Hilangkan prefix huruf dari options (A., B., dll)
          const rawOptions = item.options || [];
          const strippedOptions = rawOptions.map(stripOptionPrefix);

          // Dapatkan jawaban benar dalam bentuk teks
          const correctAnswerIndex = letterToIndex(item.answer);
          const correctAnswerText = strippedOptions[correctAnswerIndex] || '';

          return {
            questionText: item.question || '',
            options: strippedOptions,
            correctAnswer: correctAnswerText,
            correctAnswerIndex: correctAnswerIndex,
          };
        });

        setQuestions(transformedQuestions);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Gagal memuat quiz. Periksa koneksi Anda.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [materialId]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  const progress = totalQuestions > 0 ? currentQuestionNumber / totalQuestions : 0;

  // Timer effect
  useEffect(() => {
    if (loading || questions.length === 0) return;

    let interval: number;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive && !isChecking && !showResult) {
      setTimerActive(false);
      setSelectedOption(null);
      finalizeAnswer(null, true);
      setShowResult(true);
      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, currentQuestionIndex, loading, questions.length]);

  const resetTimer = () => {
    setTimeLeft(30);
    setTimerActive(true);
  };

  const finalizeAnswer = (selectedOptionText: string | null, isSkippedByTimer = false) => {
    if (!currentQuestion) return;
    const alreadyAnswered = answersRef.current.some(a => a.questionIndex === currentQuestionIndex);
    if (alreadyAnswered) return;

    let isCorrect = false;
    let status = 'answered';

    if (isSkippedByTimer || selectedOptionText === null) {
      status = 'skipped';
      skippedRef.current += 1;
    } else if (selectedOptionText === currentQuestion.correctAnswer) {
      isCorrect = true;
      correctRef.current += 1;
    } else {
      wrongRef.current += 1;
    }

    const answerData = {
      questionIndex: currentQuestionIndex,
      question: currentQuestion.questionText,
      options: currentQuestion.options,
      userAnswer: selectedOptionText,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect,
      status: status,
    };
    answersRef.current.push(answerData);
  };

  const handleAnswer = (optionText: string) => {
    if (showResult || isChecking || !currentQuestion) return;

    setSelectedOption(optionText);
    setIsChecking(true);

    setTimeout(() => {
      finalizeAnswer(optionText, false);
      setIsChecking(false);
      setShowResult(true);
      setTimerActive(false);

      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
      setIsChecking(false);
      resetTimer();
      setTimeout(() => {
        navigatingRef.current = false;
      }, 100);
    } else {
      const finalCorrect = correctRef.current;
      const finalWrong = wrongRef.current;
      const finalSkipped = skippedRef.current;
      const finalScore = totalQuestions > 0 ? Math.round((finalCorrect / totalQuestions) * 100) : 0;

      router.replace({
        pathname: '/siswa/materi/score',
        params: {
          score: finalScore.toString(),
          correct: finalCorrect.toString(),
          wrong: finalWrong.toString(),
          skipped: finalSkipped.toString(),
          total: totalQuestions.toString(),
          answers: JSON.stringify(answersRef.current)
        }
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <DetailHeader title="Quiz" subtitle="Memuat soal..." />
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        <Text style={styles.loadingText}>Mempersiapkan quiz...</Text>
      </View>
    );
  }

  // Error state
  if (error || questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <DetailHeader title="Quiz" subtitle="Gagal memuat" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.error} />
          <Text style={styles.errorText}>{error || 'Quiz tidak tersedia'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <DetailHeader
        title="Quiz"
        subtitle={`Soal ${currentQuestionNumber} dari ${totalQuestions}`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topContainer}>
          <View style={styles.leftSection}>
            <Text style={styles.remainingLabel}>Tersisa</Text>
            <Text style={styles.remainingValue}>
              <Text style={{ color: COLORS.textMain }}>{String(currentQuestionNumber).padStart(2, '0')}</Text>
              <Text style={{ color: COLORS.textSub }}>/{String(totalQuestions).padStart(2, '0')} soal</Text>
            </Text>
          </View>
          <View style={styles.rightSection}>
            <AnimatedCircularProgress 
              size={70} 
              width={6} 
              fill={(timeLeft / 30) * 100} 
              tintColor={COLORS.primary} 
              backgroundColor={COLORS.white} 
              rotation={0} 
              lineCap="round"
            >
              {() => <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>}
            </AnimatedCircularProgress>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = selectedOption === option;

            let backgroundColor = COLORS.white;
            let borderColor = COLORS.smoothBlue;

            if (isChecking && isSelected) {
              backgroundColor = COLORS.smoothBlue;
              borderColor = COLORS.primary;
            } else if (showResult) {
              if (isCorrect) {
                backgroundColor = '#D8FAE5';
                borderColor = COLORS.success;
              } else if (isSelected) {
                backgroundColor = '#F9C3C4';
                borderColor = COLORS.error;
              }
            }

            return (
              <TouchableOpacity
                key={idx}
                disabled={showResult || isChecking}
                style={[styles.optionItem, { backgroundColor, borderColor, borderWidth: 2 }]}
               onPress={() => handleAnswer(option)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={[
                    styles.optionCircle, 
                    showResult && isCorrect && styles.circleCorrect, 
                    showResult && isSelected && !isCorrect && styles.circleWrong
                  ]}>
                    <Text style={styles.optionLetterText}>{letter}</Text>
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                </View>
                {showResult && (
                  isCorrect ? 
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} /> : 
                    isSelected ? 
                      <Ionicons name="close-circle" size={24} color={COLORS.error} /> : 
                      null
                )}
              </TouchableOpacity>
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
    backgroundColor: COLORS.background 
  },
  
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingText: {
    textAlign: 'center',
    marginTop: SPACING.md,
    color: COLORS.textSub,
    fontSize: 14,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },

  errorText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.m,
  },

  retryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
    
  scrollContent: { 
    paddingHorizontal: SPACING.md, 
    paddingTop: SPACING.lg, 
    paddingBottom: SPACING.xl 
  },

  topContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },

  leftSection: { 
    flex: 1 
  },

  rightSection: { 
    marginLeft: 10 
  },

  remainingLabel: { 
    fontSize: 14, 
    color: COLORS.textMain, 
    fontWeight: '600', 
    marginBottom: 2 
  },

  remainingValue: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: COLORS.primary 
  },

  progressContainer: {
    marginBottom: SPACING.md 
  },

  progressBarBackground: { 
    height: 8, 
    backgroundColor: COLORS.smoothBlue, 
    borderRadius: 4, 
    overflow: 'hidden' 
  },

  progressBarFill: { 
    height: '100%', 
    backgroundColor: COLORS.primary, 
    borderRadius: 4 
  },

  timerText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMain,
  },

  questionText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: COLORS.textMain, 
    textAlign: 'center', 
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },

  optionsContainer: { 
    marginBottom: SPACING.xl 
  },

  optionItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: COLORS.white, 
    borderRadius: BORDER_RADIUS.s, 
    paddingVertical: SPACING.md, 
    paddingHorizontal: SPACING.lg, 
    marginBottom: SPACING.sm, 
    borderWidth: 1, 
    borderColor: COLORS.smoothBlue 
  },

  optionText: { 
    fontSize: 16, 
    color: COLORS.textMain, 
    flex: 1,
    marginLeft: 12,
  },

  optionCircle: { 
    width: 26, 
    height: 26, 
    borderRadius: 18, 
    backgroundColor: COLORS.primary, 
    borderWidth: 1, 
    borderColor: COLORS.smoothBlue, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },

  optionLetterText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: COLORS.white 
  },

  circleCorrect: { 
    backgroundColor: COLORS.success, 
    borderColor: COLORS.success 
  },

  circleWrong: { 
    backgroundColor: COLORS.error, 
    borderColor: COLORS.error 
  },
});