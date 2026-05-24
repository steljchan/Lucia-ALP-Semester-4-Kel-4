import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Alert,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
  useFocusEffect,
} from 'expo-router';

import {
  useRef,
  useState,
  useCallback,
} from 'react';

import {
  jumlahKamiLevels,
} from '../../../../../src/data/berapakahjumlahkami';

import {
  saveGameProgress,
} from '../../../../../src/services/gameProgress';

import useBerapakahJumlahKami
from '../../../../../src/hooks/useBerapakahJumlahKami';

import GameLayout
from '../../../../../src/components/game/layout/GameLayout';

import ResultModal
from '../../../../../src/components/game/common/resultModal';

// Import service regenerasi heart (sudah dibuat sebelumnya)
import { refreshHeart, decrementHeart } from '../../../../../src/services/heartRegen';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../../../src/config/firebase';

export default function JumlahKamiLevel() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const levelIndex = Number(id) - 1;
  const level = jumlahKamiLevels[levelIndex];
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = level.questions[questionIndex];

  const {
    answer,
    status,
    addNumber,
    removeNumber,
    reset,
    check,
    isFilled,
  } = useBerapakahJumlahKami(question.answer);

  // State untuk heart & coin
  const [heart, setHeart] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // State result
  const [showResult, setShowResult] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [xp, setXp] = useState(0);
  const [coinReward, setCoinReward] = useState(0);

  // Animasi
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Load heart & coin saat layar fokus (dengan regenerasi)
  const loadUserStats = async () => {
    try {
      const heartAfterRegen = await refreshHeart(); // auto regen
      const uid = auth.currentUser?.uid;
      if (uid) {
        const userSnap = await getDoc(doc(db, 'users', uid));
        const coin = userSnap.data()?.coin ?? 0;
        setHeart(heartAfterRegen);
        setCoinBalance(coin);
      }
    } catch (error) {
      console.log('Gagal load heart/coin:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserStats();
    }, [])
  );

  const playCorrectAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const playWrongAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onSubmit = () => {
    if (!isFilled) return;

    const result = check();

    if (result) {
      playCorrectAnimation();
    } else {
      playWrongAnimation();

      // Kurangi heart karena jawaban salah (menggunakan service decrementHeart yang sudah handle regenerasi)
      decrementHeart()
        .then((newHeart) => {
          setHeart(newHeart);
          if (newHeart === 0) {
            setGameOver(true);
          }
        })
        .catch((err) => {
          console.log(err.message);
          if (err.message === 'Heart habis!') {
            setGameOver(true);
          } else {
            Alert.alert('Error', err.message);
          }
        });
    }

    // Next question
    if (questionIndex < level.questions.length - 1) {
      setTimeout(() => {
        setQuestionIndex((prev) => prev + 1);
        reset();
      }, 700);
    }
    // Finish level
    else {
      const stars = result ? 3 : 1;
      const earnedXp = result ? 150 : 50;
      const earnedCoin = result ? 8 : 2;

      setEarnedStars(stars);
      setXp(earnedXp);
      setCoinReward(earnedCoin);

      setTimeout(async () => {
        try {
          await saveGameProgress({
            gameId: 'berapakahjumlahkami',
            levelId: level.id,
            stars: stars,
            xp: earnedXp,
            coin: earnedCoin,
          });

          // Refresh ulang heart & coin setelah simpan
          const heartAfterRegen = await refreshHeart();
          const uid = auth.currentUser?.uid;
          if (uid) {
            const userSnap = await getDoc(doc(db, 'users', uid));
            const newCoin = userSnap.data()?.coin ?? 0;
            setHeart(heartAfterRegen);
            setCoinBalance(newCoin);
          }

          setShowResult(true);
        } catch (error) {
          console.log('ERROR SAVE GAME:', error);
        }
      }, 700);
    }
  };

  const goNextLevel = () => {
    const next = levelIndex + 2;
    if (next <= jumlahKamiLevels.length) {
      router.replace(`/siswa/game/berapakahjumlahkami/level/${next}`);
    } else {
      router.back();
    }
  };

  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <>
      <GameLayout
        title="Berapakah Jumlah Kami"
        level={level.id}
        heart={heart}
        coin={coinBalance}
        actions={[
          {
            icon: '⌫',
            color: '#FF6B6B',
            onPress: removeNumber,
          },
          {
            text: 'Jawab',
            color: '#5CBEFA',
            onPress: onSubmit,
            disabled: !isFilled,
            flex: 1,
          },
        ]}
      >
        {/* QUESTION */}
        <Animated.View
          style={[
            styles.questionContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateX: shakeAnim },
              ],
            },
            status === 'correct' && styles.correctContainer,
            status === 'wrong' && styles.wrongContainer,
          ]}
        >
          <View style={styles.itemBox}>
            <Text style={styles.emoji}>{question.emoji1}</Text>
            <Text style={styles.count}>× {question.count1}</Text>
          </View>
          <Text style={styles.plus}>+</Text>
          <View style={styles.itemBox}>
            <Text style={styles.emoji}>{question.emoji2}</Text>
            <Text style={styles.count}>× {question.count2}</Text>
          </View>
        </Animated.View>

        {/* ANSWER */}
        <Animated.View
          style={[
            styles.answerBox,
            status === 'correct' && styles.correctAnswerBox,
            status === 'wrong' && styles.wrongAnswerBox,
            {
              transform: [
                { scale: scaleAnim },
                { translateX: shakeAnim },
              ],
            },
          ]}
        >
          <Text
            style={[
              styles.answerText,
              status === 'correct' && styles.correctAnswerText,
              status === 'wrong' && styles.wrongAnswerText,
            ]}
          >
            {answer || '?'}
          </Text>
        </Animated.View>

        {/* KEYPAD */}
        <View style={styles.keypad}>
          {keypad.map((n) => (
            <TouchableOpacity
              key={n}
              style={styles.keyBtn}
              onPress={() => addNumber(n)}
            >
              <Text style={styles.keyText}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </GameLayout>

      <ResultModal
        visible={showResult}
        gameTitle="Berapakah Jumlah Kami"
        stars={earnedStars}
        xp={xp}
        coin={coinReward}
        onRetry={() => {
          setShowResult(false);
          reset();
          setQuestionIndex(0);
        }}
        onNext={() => {
          setShowResult(false);
          goNextLevel();
        }}
        onLeaderboard={() => {
          router.push('/siswa/tabs/leaderboard');
        }}
      />

      {/* Modal Game Over */}
      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverCard}>
            <Text style={styles.gameOverTitle}>💔 GAME OVER</Text>
            <Text style={styles.gameOverText}>
              Heart habis! Beli heart di toko atau ulang level nanti.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.gameOverButton, styles.buyHeartButton]}
                onPress={() => {
                  setGameOver(false);
                  router.push('/siswa/toko');
                }}
              >
                <Text style={styles.gameOverButtonText}>Toko</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.gameOverButton, styles.backButton]}
                onPress={() => {
                  setGameOver(false);
                  router.back();
                }}
              >
                <Text style={styles.gameOverButtonText}>Kembali ke Peta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  correctContainer: {
    backgroundColor: '#DCFCE7',
  },
  wrongContainer: {
    backgroundColor: '#FEE2E2',
  },
  itemBox: {
    alignItems: 'center',
    width: 95,
  },
  emoji: {
    fontSize: 46,
  },
  count: {
    fontSize: 24,
    fontWeight: '700',
    color: '#163B65',
    marginTop: 6,
  },
  plus: {
    fontSize: 34,
    fontWeight: '800',
    color: '#5CBEFA',
    marginHorizontal: 10,
  },
  answerBox: {
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 22,
    marginTop: 22,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  correctAnswerBox: {
    backgroundColor: '#DCFCE7',
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  wrongAnswerBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  answerText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#163B65',
  },
  correctAnswerText: {
    color: '#15803D',
  },
  wrongAnswerText: {
    color: '#B91C1C',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 20,
  },
  keyBtn: {
    width: 72,
    height: 72,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  keyText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#163B65',
  },
  // Game Over Modal styles
  gameOverOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverCard: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  gameOverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 12,
  },
  gameOverText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  gameOverButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyHeartButton: {
    backgroundColor: '#FF9800',
  },
  backButton: {
    backgroundColor: '#5CBEFA',
  },
  gameOverButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});