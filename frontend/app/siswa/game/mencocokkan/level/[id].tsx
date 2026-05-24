import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
  Alert,
  TouchableOpacity,
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

import Svg, {
  Line,
  Circle,
} from 'react-native-svg';

import {
  mencocokkanLevels,
} from '../../../../../src/data/mencocokkan';

import useMencocokkan
from '../../../../../src/hooks/useMencocokkan';

import MatchWord
from '../../../../../src/components/game/mencocokkan/matchword';

import MatchImage
from '../../../../../src/components/game/mencocokkan/matchimage';

import GameLayout
from '../../../../../src/components/game/layout/GameLayout';

import HintModal
from '../../../../../src/components/game/common/hintModal';

import ResultModal
from '../../../../../src/components/game/common/resultModal';

// Import service regenerasi heart (sudah dibuat)
import { refreshHeart, decrementHeart } from '../../../../../src/services/heartRegen';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../../../src/config/firebase';
import { saveGameProgress } from '../../../../../src/services/gameProgress';

const { width, height } = Dimensions.get('window');

export default function MatchingGame() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const levelIndex = Number(id) - 1;
  const level = mencocokkanLevels[levelIndex];

  const {
    wordPositions,
    imagePositions,
    setWordPosition,
    setImagePosition,
    shuffledWords,
    shuffledImages,
    reset,
  } = useMencocokkan(level.pairs);

  // States
  const [connections, setConnections] = useState<any[]>([]);
  const [activeLine, setActiveLine] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [xp, setXp] = useState(0);
  const [coinReward, setCoinReward] = useState(0);
  const [resultMap, setResultMap] = useState<any>({});
  const [heart, setHeart] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const hintText = useMemo(() => {
    return 'Tarik garis dari kata ke gambar yang benar ✨';
  }, []);

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

  // ==================== Game Logic ====================
  const startConnection = (word: string) => {
    const from = wordPositions[word];
    if (!from) return;
    setActiveLine({
      word,
      startX: from.x,
      startY: from.y,
      endX: from.x,
      endY: from.y,
    });
  };

  const findClosestImage = (x: number, y: number) => {
    let closest: string | null = null;
    let minDistance = Infinity;
    Object.entries(imagePositions).forEach(([key, pos]: any) => {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < 100 && distance < minDistance) {
        minDistance = distance;
        closest = key;
      }
    });
    return closest;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (evt) => {
        if (!activeLine) return;
        const moveX = evt.nativeEvent.pageX;
        const moveY = evt.nativeEvent.pageY;
        const closestImage = findClosestImage(moveX, moveY);
        if (closestImage) {
          const target = imagePositions[closestImage];
          setActiveLine((prev: any) => ({
            ...prev,
            endX: target.x,
            endY: target.y,
          }));
        } else {
          setActiveLine((prev: any) => ({
            ...prev,
            endX: moveX,
            endY: moveY,
          }));
        }
      },
      onPanResponderRelease: (evt) => {
        if (!activeLine) return;
        const releaseX = evt.nativeEvent.pageX;
        const releaseY = evt.nativeEvent.pageY;
        const matchedImage = findClosestImage(releaseX, releaseY);
        if (matchedImage) {
          setConnections((prev) => {
            const filtered = prev.filter(
              (c) => c.word !== activeLine.word && c.image !== matchedImage
            );
            return [...filtered, { word: activeLine.word, image: matchedImage }];
          });
        }
        setActiveLine(null);
      },
      onPanResponderTerminate: () => {
        setActiveLine(null);
      },
    })
  ).current;

  const onSubmit = async () => {
    if (gameOver) {
      Alert.alert('Game Over', 'Heart habis. Beli heart di toko.');
      return;
    }

    let correct = 0;
    const results: any = {};
    connections.forEach((c) => {
      if (c.word === c.image) {
        results[c.word] = 'correct';
        correct++;
      } else {
        results[c.word] = 'wrong';
      }
    });

    setResultMap(results);
    setSubmitted(true);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.04, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    const allCorrect = correct === level.pairs.length;

    // Kurangi heart jika tidak semua jawaban benar (menggunakan service)
    if (!allCorrect) {
      try {
        const newHeart = await decrementHeart(); // sudah handle refreshHeart di dalamnya
        setHeart(newHeart);
        if (newHeart === 0) {
          setGameOver(true);
          return;
        }
      } catch (err: any) {
        if (err.message === 'Heart habis!') {
          setGameOver(true);
        } else {
          Alert.alert('Error', err.message);
        }
        return;
      }
    }

    // Hitung reward
    const finalStars = allCorrect ? 3 : 1;
    const earnedXp = allCorrect ? 150 : 50;
    const earnedCoin = allCorrect ? 10 : 2;

    setEarnedStars(finalStars);
    setXp(earnedXp);
    setCoinReward(earnedCoin);

    // Simpan progres ke Firebase
    try {
      await saveGameProgress({
        gameId: 'mencocokkan',
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
        setHeart(heartAfterRegen);
        setCoinBalance(newCoin);
      }
    } catch (error) {
      console.log('ERROR SAVE GAME:', error);
    }

    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const goNextLevel = () => {
    const next = levelIndex + 2;
    if (next <= mencocokkanLevels.length) {
      router.replace(`/siswa/game/mencocokkan/level/${next}`);
    } else {
      router.back();
    }
  };

  return (
    <>
      <GameLayout
        title="Mencocokkan"
        level={level.id}
        heart={heart}
        coin={coinBalance}
        actions={[
          {
            icon: '💡',
            color: '#FFD700',
            onPress: () => setShowHint(true),
          },
          {
            icon: '↺',
            color: '#FF6B6B',
            onPress: () => {
              reset();
              setConnections([]);
              setSubmitted(false);
              setResultMap({});
              setActiveLine(null);
            },
          },
          {
            text: 'Jawab',
            color: '#5CBEFA',
            onPress: onSubmit,
            flex: 1,
          },
        ]}
      >
        <Text style={styles.title}>Pilih Pasangannya</Text>

        <View style={styles.mapContainer} {...panResponder.panHandlers}>
          <Svg
            pointerEvents="none"
            width={width}
            height={height}
            style={[StyleSheet.absoluteFillObject, { zIndex: 9999, elevation: 9999 }]}
          >
            {/* Connections */}
            {connections.map((c, i) => {
              const from = wordPositions[c.word];
              const to = imagePositions[c.image];
              if (!from || !to) return null;
              const status = resultMap[c.word];
              const color = submitted
                ? status === 'correct'
                  ? '#22C55E'
                  : '#EF4444'
                : '#5CBEFA';
              return (
                <React.Fragment key={i}>
                  <Line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={color}
                    strokeWidth={18}
                    strokeOpacity={0.22}
                    strokeLinecap="round"
                  />
                  <Line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={color}
                    strokeWidth={8}
                    strokeOpacity={1}
                    strokeLinecap="round"
                  />
                </React.Fragment>
              );
            })}
            {/* Active line */}
            {activeLine && (
              <>
                <Line
                  x1={activeLine.startX}
                  y1={activeLine.startY}
                  x2={activeLine.endX}
                  y2={activeLine.endY}
                  stroke="#5CBEFA"
                  strokeWidth={22}
                  strokeOpacity={0.25}
                  strokeLinecap="round"
                />
                <Line
                  x1={activeLine.startX}
                  y1={activeLine.startY}
                  x2={activeLine.endX}
                  y2={activeLine.endY}
                  stroke="#5CBEFA"
                  strokeWidth={8}
                  strokeOpacity={1}
                  strokeLinecap="round"
                />
                <Circle cx={activeLine.endX} cy={activeLine.endY} r={10} fill="#5CBEFA" />
              </>
            )}
          </Svg>

          <Animated.View style={[styles.row, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.column}>
              {shuffledWords.map((p: any) => (
                <MatchWord
                  key={p.word}
                  word={p.word}
                  onDragStart={startConnection}
                  setWordPosition={setWordPosition}
                  active={activeLine?.word === p.word}
                  status={submitted ? resultMap[p.word] : undefined}
                />
              ))}
            </View>
            <View style={styles.column}>
              {shuffledImages.map((p: any) => (
                <MatchImage
                  key={p.word}
                  word={p.word}
                  image={p.image}
                  setImagePosition={setImagePosition}
                  active={activeLine?.word === p.word}
                  status={submitted ? resultMap[p.word] : undefined}
                />
              ))}
            </View>
          </Animated.View>
        </View>
      </GameLayout>

      <HintModal visible={showHint} hintText={hintText} onClose={() => setShowHint(false)} />

      <ResultModal
        visible={showResult}
        gameTitle="Mencocokkan"
        stars={earnedStars}
        xp={xp}
        coin={coinReward}
        onRetry={() => {
          setShowResult(false);
          reset();
          setConnections([]);
          setSubmitted(false);
          setResultMap({});
          setActiveLine(null);
        }}
        onNext={() => {
          setShowResult(false);
          goNextLevel();
        }}
        onLeaderboard={() => {
          setShowResult(false);
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
    fontSize: 22,
    fontWeight: '700',
    color: '#1A3B5D',
    marginTop: 8,
    marginBottom: 26,
  },
  mapContainer: {
    flex: 1,
    minHeight: 650,
    justifyContent: 'flex-start',
    overflow: 'visible',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 30,
  },
  column: {
    width: 145,
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