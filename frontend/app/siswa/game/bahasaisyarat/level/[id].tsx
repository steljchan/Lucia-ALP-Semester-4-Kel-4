import {View, Text, TouchableOpacity, StyleSheet, Animated, Image, ScrollView, Modal, Alert} from 'react-native';
import {useLocalSearchParams, useRouter, useFocusEffect,} from 'expo-router';
import {saveGameProgress} from '../../../../../src/services/gameProgress';
import {useMemo, useRef, useState, useCallback} from 'react';
import {bahasaIsyaratLevels} from '../../../../../src/data/bahasaisyarat';
import {bahasaIsyaratImages} from '../../../../../src/constants/bahasaIsyarat';
import useBahasaIsyarat from '../../../../../src/hooks/useBahasaIsyarat';
import ResultModal from '../../../../../src/components/game/common/resultModal';
import GameLayout from '../../../../../src/components/game/layout/GameLayout';
import { refreshHeart, decrementHeart } from '../../../../../src/services/heartRegen';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../../../src/config/firebase';

export default function BahasaIsyaratLevel() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const levelIndex = Number(id) - 1;
  const level = bahasaIsyaratLevels[levelIndex];

  const {
    selected,
    usedIndexes,
    select,
    reset,
    check,
    isFull,
  } = useBahasaIsyarat(level.word);

  const [heart, setHeart] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [xp, setXp] = useState(0);
  const [coinReward, setCoinReward] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const loadUserStats = async () => {
    try {
      const heartAfterRegen = await refreshHeart(); 
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

  const options = useMemo(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const extra = alphabet
      .filter((l) => !level.letters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [...level.letters, ...extra].sort(() => Math.random() - 0.5);
  }, [level.id]);

  const rows = [];
  for (let i = 0; i < options.length; i += 3) {
    rows.push(options.slice(i, i + 3));
  }

  const playCorrectAnimation = () => {
    setStatus('correct');
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.06,
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
    setStatus('wrong');
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

  const goNextLevel = () => {
    const next = levelIndex + 2;
    if (next <= bahasaIsyaratLevels.length) {
      router.replace(`/siswa/game/bahasaisyarat/level/${next}`);
    } else {
      router.back();
    }
  };

  const onSubmit = () => {
    if (!isFull) return;

    const result = check();

    const finalStars = result ? 3 : 1;
    const earnedXp = result ? 150 : 50;
    const earnedCoin = result ? 8 : 2;

    setEarnedStars(finalStars);
    setXp(earnedXp);
    setCoinReward(earnedCoin);

    if (result) {
      playCorrectAnimation();
    } else {
      playWrongAnimation();

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

    setTimeout(async () => {
      try {
        await saveGameProgress({
          gameId: 'bahasaisyarat',
          levelId: level.id,
          stars: finalStars,
          xp: earnedXp,
          coin: earnedCoin,
        });

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
  };

  return (
    <>
      <GameLayout
        title="Bahasa Isyarat"
        level={level.id}
        heart={heart}
        coin={coinBalance}
        actions={[
          {
            icon: '↺',
            color: '#FF6B6B',
            onPress: reset,
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
        <ScrollView showsVerticalScrollIndicator={false}>
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
            <Text style={styles.questionText}>{level.word}</Text>
          </Animated.View>

          <Text style={styles.subtitle}>Pilih gambar bahasa isyarat</Text>

          <View style={styles.optionsContainer}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((letter, i) => {
                  const index = rowIndex * 3 + i;
                  const isSelected = usedIndexes.includes(index);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.signOption,
                        isSelected && styles.signSelected,
                        status === 'correct' && isSelected && styles.correctOption,
                        status === 'wrong' && isSelected && styles.wrongOption,
                      ]}
                      onPress={() => select(letter, index)}
                      disabled={isSelected}
                    >
                      <Image
                        source={
                          bahasaIsyaratImages[
                            letter.toLowerCase() as keyof typeof bahasaIsyaratImages
                          ]
                        }
                        style={styles.signImage}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </GameLayout>

      <ResultModal
        visible={showResult}
        gameTitle="Bahasa Isyarat"
        stars={earnedStars}
        xp={xp}
        coin={coinReward}
        onRetry={() => {
          setShowResult(false);
          reset();
        }}
        onNext={() => {
          setShowResult(false);
          goNextLevel();
        }}
        onLeaderboard={() => {
          router.push('/siswa/tabs/leaderboard');
        }}
      />

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
    borderRadius: 26,
    paddingVertical: 35,
    marginTop: 35,
    marginBottom: 20,
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
  questionText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#163B65',
    letterSpacing: 5,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 17,
    color: '#6B7280',
    marginBottom: 28,
  },
  optionsContainer: {
    paddingBottom: 120,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 14,
  },
  signOption: {
    width: 92,
    height: 92,
    backgroundColor: '#fff',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  signSelected: {
    borderColor: '#5CBEFA',
    backgroundColor: '#DDF2FF',
  },
  correctOption: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  wrongOption: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  signImage: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
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