import {View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions} from 'react-native';
import {useLocalSearchParams, useRouter, useFocusEffect} from 'expo-router';
import {useMemo, useRef, useState, useCallback} from 'react';
import {saveGameProgress} from '../../../../../src/services/gameProgress';
import {siapakahAkuLevels} from '../../../../../src/data/siapakahaku';
import {siapakahAkuImages} from '../../../../../src/constants/siapakahAku';
import useSiapakahAku from '../../../../../src/hooks/usesiapakahaku';
import LetterBox from '../../../../../src/components/game/siapakahAku/LetterBox';
import GameLayout from '../../../../../src/components/game/layout/GameLayout';
import HintModal from '../../../../../src/components/game/common/hintModal';
import ResultModal from '../../../../../src/components/game/common/resultModal';
import GameOverModal from '../../../../../src/components/game/common/GameOverModal';
import useGameEnd from '../../../../../src/hooks/useGameEnd';
import {calculateGameRewards} from '../../../../../utils/calculatedGameReward';
import {refreshHeart, decrementHeart} from '../../../../../src/services/heartRegen';
import {doc, getDoc} from 'firebase/firestore';
import {db, auth} from '../../../../../src/config/firebase';

export default function GamePlay() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const isSmallDevice = width < 360;

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

  const { endState, handleGameEnd, resetEndState } = useGameEnd();

  const [earnedStars, setEarnedStars] = useState(0);
  const [xp, setXp] = useState(0);
  const [rewardCoin, setRewardCoin] = useState(0);
  const [userHeart, setUserHeart] = useState(0);
  const [userCoin, setUserCoin] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintStep, setHintStep] = useState(0);

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

  const answerLetters = question.answer.split('');
  const answerLength = answerLetters.length;
  const isTwoRows = answerLength > 8;
  const splitAnswerIndex = Math.ceil(answerLength / 2);
  const firstRowAnswer = isTwoRows ? answerLetters.slice(0, splitAnswerIndex) : answerLetters;
  const secondRowAnswer = isTwoRows ? answerLetters.slice(splitAnswerIndex) : [];

  const answerBoxScale = answerLength <= 6 ? 1 : answerLength <= 8 ? 0.82 : 0.82;
  const answerSpacing = answerLength <= 6 ? 4 : answerLength <= 8 ? -5 : -4;
  const optionsLength = options.length;

  const maxPerRow = isSmallDevice ? 7 : 5;
  const splitIndex = optionsLength <= maxPerRow ? optionsLength : Math.ceil(optionsLength / 2);
  const topRow = options.slice(0, splitIndex);
  const bottomRow = options.slice(splitIndex);

  const optionButtonSize =
    optionsLength <= 5
      ? isSmallDevice
        ? 50
        : 58
      : optionsLength <= 8
      ? isSmallDevice
        ? 46
        : 52
      : optionsLength <= 12
      ? isSmallDevice
        ? 40
        : 46
      : isSmallDevice
      ? 34
      : 40;

  const optionFontSize =
    optionsLength <= 5
      ? 22
      : optionsLength <= 8
      ? 20
      : optionsLength <= 12
      ? 17
      : 15;

  const optionGap =
    optionsLength <= 5
      ? 12
      : optionsLength <= 8
      ? 10
      : optionsLength <= 12
      ? 8
      : 5;

  const loadUserStats = async () => {
    try {
      const heartAfterRegen = await refreshHeart();
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
        return 'Semangat 😄';
    }
  }, [hintStep, question.answer]);

  const resetGame = () => {
    reset();
    setQuestionIndex(0);
    setTotalCorrect(0);
    setTotalWrong(0);
    setIsSubmitting(false);
    scaleAnim.setValue(1);
  };

  const onSubmit = async () => {
    if (!isFull) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    const resultData = check();
    const result = resultData.isCorrect;
    const newCorrect = totalCorrect + resultData.correctCount;
    const newWrong = totalWrong + resultData.wrongCount;

    setTotalCorrect(newCorrect);
    setTotalWrong(newWrong);

    const rewards = calculateGameRewards({
      correctAnswers: newCorrect,
      wrongAnswers: newWrong,
      totalQuestions: level.totalQuestions,
      difficulty: level.difficulty,
      streak: 0,
    });

    setEarnedStars(rewards.stars);
    setXp(rewards.xp);
    setRewardCoin(rewards.coin);

    let updatedHeart = userHeart;

    if (result) {
      playAnimation(true);
    } else {
      playAnimation(false);
      try {
        updatedHeart = await decrementHeart();
        setUserHeart(updatedHeart);
      } catch {
        updatedHeart = 0;
      }
    }

    const isLastQuestion = questionIndex === level.questions.length - 1;
    const isGameOver = !result && updatedHeart <= 0;

    if (isGameOver) {
      setTimeout(() => {
        handleGameEnd({
          isWrong: true,
          heart: 0,
        });
        setIsSubmitting(false);
      }, 700);
      return;
    }

    if (!isLastQuestion) {
      setTimeout(() => {
        reset();
        setQuestionIndex((prev) => prev + 1);
        setIsSubmitting(false);
      }, 700);
      return;
    }

    setTimeout(async () => {
      try {
        await saveGameProgress({
          gameId: 'siapakahaku',
          levelId: level.id,
          stars: rewards.stars,
          xp: rewards.xp,
          coin: rewards.coin,
        });
        handleGameEnd({
          isWrong: false,
          heart: updatedHeart,
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 700);
  };

  const goNextLevel = () => {
    const next = levelIndex + 2;
    if (next <= siapakahAkuLevels.length) {
      router.replace(`/siswa/game/siapakahaku/level/${next}`);
    } else {
      router.back();
    }
  };

  return (
    <>
      <GameLayout
        title="Siapakah Aku"
        image={require('@/assets/images/games/siapakahAku.png')}
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
            text: isSubmitting
              ? 'Loading...'
              : questionIndex < level.questions.length - 1
              ? 'Next'
              : 'Jawab',
            color: '#5CBEFA',
            onPress: onSubmit,
            disabled: !isFull || isSubmitting,
            flex: 1,
          },
        ]}
      >
        <Text style={styles.title}>Siapakah Aku?</Text>

        <Image
          source={siapakahAkuImages[question.image as keyof typeof siapakahAkuImages]}
          style={[
            styles.image,
            {
              width: isSmallDevice ? 180 : width * 0.55,
              height: isSmallDevice ? 180 : width * 0.55,
            },
          ]}
        />

        <Animated.View
          key={questionIndex}
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >

          <View style={styles.answerRow}>
            {firstRowAnswer.map((_, i) => (
              <TouchableOpacity key={`answer-top-${i}`} activeOpacity={0.7} onPress={() => remove(i)}>
                <View
                  style={{
                    transform: [{ scale: answerBoxScale }],
                    marginHorizontal: answerSpacing,
                  }}
                >
                  <LetterBox letter={selected[i]} status={status} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {isTwoRows && (
            <View style={styles.answerRow}>
              {secondRowAnswer.map((_, idx) => {
                const realIndex = idx + firstRowAnswer.length;
                return (
                  <TouchableOpacity
                    key={`answer-bottom-${realIndex}`}
                    activeOpacity={0.7}
                    onPress={() => remove(realIndex)}
                  >
                    <View
                      style={{
                        transform: [{ scale: answerBoxScale }],
                        marginHorizontal: answerSpacing,
                      }}
                    >
                      <LetterBox letter={selected[realIndex]} status={status} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Animated.View>

        <View style={styles.optionsContainer}>
          <View style={[styles.row, { gap: optionGap }]}>
            {topRow.map((l, i) => {
              const index = i;
              const isUsed = usedIndexes.includes(index);
              return (
                <TouchableOpacity
                  key={`top-${index}-${l}`}
                  activeOpacity={0.7}
                  style={[
                    styles.optionBtn,
                    {
                      width: optionButtonSize,
                      height: optionButtonSize,
                      borderRadius: optionButtonSize / 4,
                    },
                    isUsed && styles.optionDisabled,
                  ]}
                  onPress={() => {
                    if (isUsed) return;
                    select(l, index);
                  }}
                  disabled={isUsed}
                >
                  <Text style={[styles.optionText, { fontSize: optionFontSize }]}>{l}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {bottomRow.length > 0 && (
            <View style={[styles.row, { gap: optionGap }]}>
              {bottomRow.map((l, i) => {
                const index = i + splitIndex;
                const isUsed = usedIndexes.includes(index);
                return (
                  <TouchableOpacity
                    key={`bottom-${index}-${l}`}
                    activeOpacity={0.7}
                    style={[
                      styles.optionBtn,
                      {
                        width: optionButtonSize,
                        height: optionButtonSize,
                        borderRadius: optionButtonSize / 4,
                      },
                      isUsed && styles.optionDisabled,
                    ]}
                    onPress={() => {
                      if (isUsed) return;
                      select(l, index);
                    }}
                    disabled={isUsed}
                  >
                    <Text style={[styles.optionText, { fontSize: optionFontSize }]}>{l}</Text>
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
        visible={endState === 'result'}
        gameTitle="Siapakah Aku?"
        stars={earnedStars}
        xp={xp}
        coin={rewardCoin}
        onRetry={() => {
          resetEndState();
          resetGame();
        }}
        onNext={() => {
          resetEndState();
          resetGame();
          goNextLevel();
        }}
        onLeaderboard={() => {
          resetEndState();
          router.push('/siswa/tabs/leaderboard');
        }}
      />

      <GameOverModal
        visible={endState === 'gameover'}
        onShop={() => {
          resetEndState();
          router.push('/siswa/toko');
        }}
        onBack={() => {
          resetEndState();
          router.back();
        }}
      />
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
    alignSelf: 'center',
    marginVertical: 20,
    resizeMode: 'contain',
    maxWidth: 220,
    maxHeight: 220,
  },

  answerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  
  optionsContainer: {
    marginBottom: 25,
    paddingHorizontal: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'nowrap',
  },

  optionBtn: {
    backgroundColor: '#ADDFFD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionDisabled: {
    backgroundColor: '#E5E7EB',
  },
  
  optionText: {
    fontWeight: '700',
    color: '#1A3B5D',
  },
});