import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useRef } from 'react';

export default function QuizScreen() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const skippedRef = useRef(0);
  const answersRef = useRef<any[]>([]);
  const navigatingRef = useRef(false);

  const questions = [
    {
      questionText: 'Tentukan bentuk kalimatnya!',
      number: 100000,
      options: ['Seratus Ribu', 'Satu Nol Nol Nol Nol Nol', 'Sepuluh Ribu', 'Seribu'],
      correctAnswer: 'Seratus Ribu',
    },
    {
      questionText: 'Tentukan bentuk kalimatnya!',
      number: 5000,
      options: ['Lima Ribu', 'Lima Puluh Ribu', 'Lima Ratus', 'Lima Juta'],
      correctAnswer: 'Lima Ribu',
    }
  ];

  const totalQuestions = questionData.totalQuestions;
  const currentQuestionNumber = currentQuestionIndex + 1;
  const progress = currentQuestionNumber / totalQuestions;
  const [showResult, setShowResult] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: number;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setSelectedOption(null);
      finalizeAnswer(null, true);
      setShowResult(true);
      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const resetTimer = () => {
    setTimeLeft(30);
    setTimerActive(true);
  };

  const finalizeAnswer = (selectedOption: string | null, isSkippedByTimer = false) => {
    const current = questions[currentQuestionIndex];
    const alreadyAnswered = answersRef.current.some(a => a.number === current.number);
    if (alreadyAnswered) return;

    let isCorrect = false;
    let status = 'answered';
    if (isSkippedByTimer || selectedOption === null) {
      status = 'skipped';
      skippedRef.current += 1;
    } else if (selectedOption === current.correctAnswer) {
      isCorrect = true;
      correctRef.current += 1;
    } else {
      wrongRef.current += 1;
    }

    const answerData = {
      number: current.number,
      question: current.questionText,
      options: current.options,
      userAnswer: selectedOption,
      correctAnswer: current.correctAnswer,
      isCorrect: isCorrect,
      status: status,
    };
    answersRef.current.push(answerData);
  };

  const handleAnswer = (option: string) => {
    if (showResult || isChecking) return;
    finalizeAnswer(option, false);
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
      const finalScore = Math.round((finalCorrect / totalQuestions) * 100);
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
    const mins = Math.floor(seconds / 30);
    const secs = seconds % 30;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <LinearGradient colors={[COLORS.white, '#ADDFFD']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Quiz</Text>
        </View>
        <Text style={styles.subtitle}>Algebra : The Basics, Calculation and Usage</Text>
      </LinearGradient>

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
            <AnimatedCircularProgress size={70} width={6} fill={(timeLeft / 20) * 100} tintColor={COLORS.primary} backgroundColor={COLORS.white} rotation={0} lineCap="round">
              {() => <Text style={{ fontSize: 12, fontWeight: '600' }}>{formatTime(timeLeft)}</Text>}
            </AnimatedCircularProgress>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        <View style={styles.numberContainer}>
          <Text style={styles.bigNumber}>{questionData.number.toLocaleString()}</Text>
        </View>

        <Text style={styles.questionText}>{questionData.questionText}</Text>

        <View style={styles.optionsContainer}>
          {questionData.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isCorrect = option === questionData.correctAnswer;
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
                onPress={() => {
                  if (showResult || isChecking) return;
                  setSelectedOption(option);
                  setIsChecking(true);
                  setTimeout(() => {
                    setIsChecking(false);
                    setShowResult(true);
                    setTimerActive(false);
                    handleAnswer(option);
                    setTimeout(() => {
                      handleNextQuestion();
                    }, 2000);
                  }, 1000);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={[styles.optionCircle, showResult && isCorrect && styles.circleCorrect, showResult && isSelected && !isCorrect && styles.circleWrong]}>
                    <Text style={styles.optionLetterText}>{letter}</Text>
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                </View>
                {showResult && (isCorrect ? <Ionicons name="checkmark-circle" size={24} color={COLORS.success} /> : isSelected ? <Ionicons name="close-circle" size={24} color={COLORS.error} /> : null)}
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
  
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20, 
    shadowColor: COLORS.primary, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 5 
  },
    
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8 
  },

  headerTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: COLORS.textMain, 
    textAlign: 'center' 
  },

  subtitle: { 
    fontSize: 14,
    color: COLORS.textMain, 
    textAlign: 'center', 
    fontWeight: '500', 
    opacity: 0.8 
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

  numberContainer: { 
    backgroundColor: COLORS.white, 
    borderRadius: BORDER_RADIUS.s, 
    paddingVertical: SPACING.xl, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: SPACING.lg, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },

  bigNumber: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    color: COLORS.textMain, 
    letterSpacing: 2 
  },

  questionText: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: COLORS.textMain, 
    textAlign: 'center', 
    marginBottom: SPACING.lg 
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
    flex: 1 
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
    marginRight: 12 
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