import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
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
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

import {
  saveGameProgress,
} from '../../../../../src/services/gameProgress';

import { siapakahAkuLevels } from '../../../../../src/data/siapakahaku';

import { siapakahAkuImages } from '../../../../../src/constants/siapakahAku';

import useSiapakahAku from '../../../../../src/hooks/usesiapakahaku';

import LetterBox from '../../../../../src/components/game/siapakahAku/LetterBox';

import GameLayout from '../../../../../src/components/game/layout/GameLayout';

import HintModal from '../../../../../src/components/game/common/hintModal';

import ResultModal from '../../../../../src/components/game/common/resultModal';

// ==================== Import service regenerasi heart ====================
import { refreshHeart, decrementHeart } from '../../../../../src/services/heartRegen';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../../../src/config/firebase';
// =========================================================================

export default function GamePlay() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const levelIndex = Number(id) - 1;
  const level = siapakahAkuLevels[levelIndex];
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = level.questions[questionIndex];

  const {
    selected,
    usedIndexes,
    select,
    remove,
    removeLast,
    reset,
    check,
    isFull,
    status,
  } = useSiapakahAku(question.answer);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const options = useMemo(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const answerLetters = question.answer.split('');
    const extra = alphabet
      .filter((l) => !answerLetters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [...answerLetters, ...extra].sort(() => Math.random() - 0.5);
  }, [question]);

  const splitIndex = options.length <= 5 ? options.length : Math.floor(options.length / 2);
  const topRow = options.slice(0, splitIndex);
  const bottomRow = options.slice(splitIndex);

  const playAnimation = (correct: boolean) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (!correct) {
      setTimeout(() => {
        reset();
      }, 900);
    }
  };

  const [showHint, setShowHint] = useState(false);
  const [hintStep, setHintStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [xp, setXp] = useState(0);
  const [rewardCoin, setRewardCoin] = useState(0);   // koin hadiah dari level
  const [userHeart, setUserHeart] = useState(0);     // heart milik user (ditampilkan di header)
  const [userCoin, setUserCoin] = useState(0);       // saldo coin user (ditampilkan di header)
  const [gameOver, setGameOver] = useState(false);

  // Load heart & coin dengan regenerasi otomatis
  const loadUserStats = async () => {
    try {
      const heartAfterRegen = await refreshHeart(); // auto regen
      const uid = auth.currentUser?.uid;
      if (uid) {
        const userSnap = await getDoc(doc(db, 'users', uid));
        const coin = userSnap.data()?.coin ?? 0;
        setUserHeart(heartAfterRegen);
        setUserCoin(coin);
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

  const hintText = useMemo(() => {
    const answer = question.answer;
    switch (hintStep) {
      case 0:
        return `Huruf pertama: ${answer[0]}`;
      case 1:
        return `Huruf terakhir: ${answer[answer.length - 1]}`;
      case 2:
        return `Jumlah huruf: ${answer.length}`;
      default:
        return `Semangat 😄`;
    }
  }, [hintStep, question.answer]);

  const onSubmit = () => {
    if (!isFull) return;

    const result = check();

    if (result) {
      playAnimation(true);
    } else {
      playAnimation(false);

      // Kurangi heart karena jawaban salah (menggunakan service yang sudah handle refresh)
      decrementHeart()
        .then((newHeart) => {
          setUserHeart(newHeart);
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

    // ========== NEXT QUESTION ==========
    if (questionIndex < level.questions.length - 1) {
      setTimeout(() => {
        setQuestionIndex((prev) => prev + 1);
        reset();
      }, 700);
    }
    // ========== FINISH LEVEL ==========
    else {
      const finalStars = result ? 3 : 1;
      const earnedXp = result ? 150 : 50;
      const earnedCoin = result ? 8 : 2;

      setEarnedStars(finalStars);
      setXp(earnedXp);
      setRewardCoin(earnedCoin);   // simpan hadiah koin untuk ResultModal

      setTimeout(async () => {
        try {
          await saveGameProgress({
            gameId: 'siapakahaku',
            levelId: level.id,
            stars: finalStars,
            xp: earnedXp,
            coin: earnedCoin,
          });

          // Refresh ulang heart & coin setelah simpan
          const heartAfterRegen = await refreshHeart();
          const uid = auth.currentUser?.uid;
          if (uid) {
            const userSnap = await getDoc(doc(db, 'users', uid));
            const newCoin = userSnap.data()?.coin ?? 0;
            setUserHeart(heartAfterRegen);
            setUserCoin(newCoin);
          }

          setShowResult(true);
        } catch (error) {
          console.log('ERROR SAVE GAME:', error);
        }
      }, 700);
    }
  };

  return (
    <>
      <GameLayout
        title="Siapakah Aku"
        level={level.id}
        heart={userHeart}
        coin={userCoin}
        actions={[
          {
            icon: '💡',
            color: '#FFD700',
            onPress: () => setShowHint(true),
          },
          {
            icon: '⌫',
            color: '#FF6B6B',
            onPress: removeLast,
          },
          {
            text: 'Jawab',
            color: '#5CBEFA',
            onPress: onSubmit,
            disabled: !isFull,
            flex: 1,
          },
        ]}
      >
        <Text style={styles.title}>Siapakah Aku?</Text>

        <Image
          source={siapakahAkuImages[question.image as keyof typeof siapakahAkuImages]}
          style={styles.image}
        />

        <Animated.View
          style={[
            styles.answerRow,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {question.answer.split('').map((_, i) => (
            <TouchableOpacity key={i} onPress={() => remove(i)}>
              <LetterBox letter={selected[i]} status={status} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        <View style={styles.optionsContainer}>
          <View style={styles.row}>
            {topRow.map((l, i) => {
              const index = i;
              const isUsed = usedIndexes.includes(index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionBtn, isUsed && styles.optionDisabled]}
                  onPress={() => select(l, index)}
                  disabled={isUsed}
                >
                  <Text style={styles.optionText}>{l}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {bottomRow.length > 0 && (
            <View style={styles.row}>
              {bottomRow.map((l, i) => {
                const index = i + 4;
                const isUsed = usedIndexes.includes(index);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionBtn, isUsed && styles.optionDisabled]}
                    onPress={() => select(l, index)}
                    disabled={isUsed}
                  >
                    <Text style={styles.optionText}>{l}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </GameLayout>

      <HintModal
        visible={showHint}
        hintText={hintText}
        onClose={() => {
          setShowHint(false);
          setHintStep((prev) => (prev < 2 ? prev + 1 : prev));
        }}
      />

      <ResultModal
        visible={showResult}
        gameTitle="Siapakah Aku?"
        stars={earnedStars}
        xp={xp}
        coin={rewardCoin}
        onRetry={() => {
          setShowResult(false);
          reset();
          setQuestionIndex(0);
        }}
        onNext={() => {
          const next = levelIndex + 2;
          if (next <= siapakahAkuLevels.length) {
            router.replace(`/siswa/game/siapakahaku/level/${next}`);
          } else {
            router.back();
          }
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
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 40,
    color: '#1A3B5D',
  },
  image: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    marginVertical: 20,
    resizeMode: 'contain',
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  optionBtn: {
    width: 55,
    height: 55,
    backgroundColor: '#ADDFFD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionDisabled: {
    backgroundColor: '#E5E7EB',
  },
  optionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A3B5D',
  },
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