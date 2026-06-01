import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
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
  doc,
  getDoc,
} from 'firebase/firestore';

import {
  db,
  auth,
} from '../../../../../src/config/firebase';

import {
  berapakahAkuLevels,
  formatRupiah,
} from '../../../../../src/data/berapakahaku';

import {
  saveGameProgress,
} from '../../../../../src/services/gameProgress';

import useBerapakahAku
from '../../../../../src/hooks/useBerapakahAku';

import GameLayout
from '../../../../../src/components/game/layout/GameLayout';

import ResultModal
from '../../../../../src/components/game/common/resultModal';

import GameOverModal
from '../../../../../src/components/game/common/GameOverModal';

import useGameEnd
from '../../../../../src/hooks/useGameEnd';

import {
  refreshHeart,
  decrementHeart,
} from '../../../../../src/services/heartRegen';

import {
  calculateGameRewards,
} from '../../../../../utils/calculatedGameReward';

export default function BerapakahAkuLevel() {

  const { id } =
    useLocalSearchParams();

  const router =
    useRouter();

  const levelIndex =
    Number(id) - 1;

  const level =
    berapakahAkuLevels[
      levelIndex
    ];

  // ========================================
  // QUESTION STATE
  // ========================================

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const question =
    level.questions[
      currentQuestionIndex
    ];

  // ========================================
  // HOOK
  // ========================================

  const {

    selectedAnswers,

    select,

    reset,

    check,

  } = useBerapakahAku(
    level.questions.length
  );

  const {

    endState,

    handleGameEnd,

    resetEndState,

  } = useGameEnd();

  // ========================================
  // STATES
  // ========================================

  const [heart, setHeart] =
    useState(0);

  const [
    coinBalance,
    setCoinBalance,
  ] = useState(0);

  const [
    earnedStars,
    setEarnedStars,
  ] = useState(0);

  const [xp, setXp] =
    useState(0);

  const [
    coinReward,
    setCoinReward,
  ] = useState(0);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    answerStatus,
    setAnswerStatus,
  ] = useState<
    'correct' |
    'wrong' |
    null
  >(null);

  const [
    showAnswerResult,
    setShowAnswerResult,
  ] = useState(false);

  const isAnswered =
    Boolean(
      selectedAnswers[
        currentQuestionIndex
      ]
    );

  // ========================================
  // ANIMATION
  // ========================================

  const scaleAnim =
    useRef(
      new Animated.Value(1)
    ).current;

  const shakeAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  // ========================================
  // LOAD USER
  // ========================================

  const loadUserStats =
    async () => {

      try {

        const heartAfterRegen =
          await refreshHeart();

        const uid =
          auth.currentUser?.uid;

        if (uid) {

          const userSnap =
            await getDoc(
              doc(
                db,
                'users',
                uid
              )
            );

          const coin =
            userSnap.data()
              ?.coin ?? 0;

          setHeart(
            heartAfterRegen
          );

          setCoinBalance(
            coin
          );
        }

      } catch (error) {

        console.log(
          'Gagal load heart/coin:',
          error
        );
      }
    };

  useFocusEffect(
    useCallback(() => {

      loadUserStats();

    }, [])
  );

  // ========================================
  // ANIMATION
  // ========================================

  const playCorrectAnimation =
    () => {

      Animated.sequence([

        Animated.timing(
          scaleAnim,
          {
            toValue: 1.05,
            duration: 120,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          scaleAnim,
          {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }
        ),

      ]).start();
    };

  const playWrongAnimation =
    () => {

      Animated.sequence([

        Animated.timing(
          shakeAnim,
          {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          shakeAnim,
          {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          shakeAnim,
          {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          shakeAnim,
          {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }
        ),

      ]).start();
    };

  // ========================================
  // HANDLE ANSWER
  // ========================================

  const handleAnswer =
    (option: number) => {

      if (isSubmitting)
        return;

      select(
        currentQuestionIndex,
        option
      );
    };

  // ========================================
  // RESET
  // ========================================

  const resetGame = () => {

    reset();

    setCurrentQuestionIndex(0);

    setAnswerStatus(null);

    scaleAnim.setValue(1);

    shakeAnim.setValue(0);

    setIsSubmitting(false);
  };

  // ========================================
  // NEXT LEVEL
  // ========================================

  const goNextLevel = () => {

    const next =
      levelIndex + 2;

    if (
      next <=
      berapakahAkuLevels.length
    ) {

      router.push(
        `/siswa/game/berapakahaku/level/${next}`
      );

    } else {

      router.back();
    }
  };

  // ========================================
  // SUBMIT
  // ========================================

  const onSubmit =
    async () => {

      if (!isAnswered)
        return;

      if (isSubmitting)
        return;

      const selectedAnswer =
        selectedAnswers[
          currentQuestionIndex
        ];

      const isCorrect =
        selectedAnswer ===
        question.answer;

      setShowAnswerResult(true);

      setAnswerStatus(
        isCorrect
          ? 'correct'
          : 'wrong'
      );

      if (isCorrect) {

        playCorrectAnimation();

      } else {

        playWrongAnimation();
      }

      // ========================================
      // NEXT QUESTION
      // ========================================

      if (
        currentQuestionIndex <
        level.questions.length - 1
      ) {

        setTimeout(() => {

          setCurrentQuestionIndex(
            (prev) => prev + 1
          );

          setAnswerStatus(null);

          setShowAnswerResult(false);

        }, 700);

        return;
  
      }

      // ========================================
      // FINAL SUBMIT
      // ========================================

      setIsSubmitting(true);

      const answers =
        level.questions.map(
          (q) => q.answer
        );

      const resultData =
        check(answers);

      const rewards =
        calculateGameRewards({

          correctAnswers:
            resultData.correctCount,

          wrongAnswers:
            resultData.wrongCount,

          totalQuestions:
            level.totalQuestions,

          difficulty:
            level.difficulty,

          streak: 0,
        });

      setEarnedStars(
        rewards.stars
      );

      setXp(
        rewards.xp
      );

      setCoinReward(
        rewards.coin
      );

      let updatedHeart =
        heart;

      if (
        resultData.wrongCount >
        0
      ) {

        try {

          updatedHeart =
            await decrementHeart();

          setHeart(
            updatedHeart
          );

        } catch (error) {

          updatedHeart = 0;
        }
      }

      setTimeout(
        async () => {

          try {

            await saveGameProgress({

              gameId:
                'berapakahaku',

              levelId:
                level.id,

              stars:
                rewards.stars,

              xp:
                rewards.xp,

              coin:
                rewards.coin,
            });

            handleGameEnd({

              isWrong:
                updatedHeart <= 0,

              heart:
                updatedHeart,
            });

          } catch (error) {

            console.log(
              'ERROR SAVE:',
              error
            );

          } finally {

            setIsSubmitting(
              false
            );
          }

        },

        700
      );
    };

  return (
    <>

      <GameLayout
        title="Berapakah Aku"

        image={require(
          '@/assets/images/games/berapakahAku.png'
        )}

        level={level.id}

        heart={heart}

        coin={coinBalance}

        actions={[

          {
            icon: '↺',

            color: '#FF6B6B',

            onPress:
              resetGame,
          },

          {
            text:
              isSubmitting
                ? 'Loading...'
                : currentQuestionIndex ===
                  level.questions.length - 1
                  ? 'Selesai'
                  : 'Next',

            color:
              '#5CBEFA',

            onPress:
              onSubmit,

            disabled:
              !isAnswered ||
              isSubmitting,

            flex: 1,
          },

        ]}
      >

        <View style={styles.content}>

          {/* QUESTION */}
          <Animated.View
            style={[

              styles.questionBox,

              {
                transform: [

                  {
                    scale:
                      scaleAnim,
                  },

                  {
                    translateX:
                      shakeAnim,
                  },
                ],
              },
            ]}
          >

            <Text
              style={
                styles.questionMini
              }
            >
              🧮 Hitung Harga
            </Text>

            <Text
              style={
                styles.questionIndicator
              }
            >
              Soal {
                currentQuestionIndex + 1
              } / {
                level.questions.length
              }
            </Text>

            <Text
              style={
                styles.questionText
              }
            >
              {question.question}
            </Text>

          </Animated.View>

          {/* MAIN CARD */}
          <View
            style={
              styles.mainCard
            }
          >

            <View
              style={
                styles.itemCard
              }
            >

              <Text
                style={
                  styles.emoji
                }
              >
                {
                  question.item1Emoji
                }
              </Text>

              <Text
                style={
                  styles.itemText
                }
              >
                {
                  question.item1Count
                }{' '}
                {
                  question.item1Name
                }
              </Text>

              <View
                style={
                  styles.priceTag
                }
              >

                <Text
                  style={
                    styles.priceText
                  }
                >
                  {formatRupiah(
                    question.item1Price *
                      question.item1Count
                  )}
                </Text>

              </View>

            </View>

            <View
              style={
                styles.plusCircle
              }
            >

              <Text
                style={
                  styles.plusText
                }
              >
                +
              </Text>

            </View>

            <View
              style={[

                styles.itemCard,

                styles.itemCardOrange,
              ]}
            >

              <Text
                style={
                  styles.emoji
                }
              >
                {
                  question.item2Emoji
                }
              </Text>

              <Text
                style={
                  styles.itemText
                }
              >
                {
                  question.item2Count
                }{' '}
                {
                  question.item2Name
                }
              </Text>

              <View
                style={[

                  styles.priceTag,

                  styles.questionTag,
                ]}
              >

                <Text
                  style={
                    styles.questionMark
                  }
                >
                  ?
                </Text>

              </View>

            </View>

          </View>

          {/* TOTAL */}
          <View
            style={
              styles.totalCard
            }
          >

            <Text
              style={
                styles.totalLabel
              }
            >
              🛒 TOTAL BELANJA
            </Text>

            <Text
              style={
                styles.totalText
              }
            >
              {formatRupiah(
                question.totalPrice
              )}
            </Text>

          </View>

          {/* OPTIONS */}
          <View
            style={
              styles.optionsWrapper
            }
          >

            <View
              style={
                styles.optionsContainer
              }
            >

              {question.options.map(
                (
                  option,
                  index
                ) => {

                  const labels = [
                    'A',
                    'B',
                    'C',
                  ];

                  const isSelected =
                    selectedAnswers[
                      currentQuestionIndex
                    ] === option;

                  return (

                    <TouchableOpacity
                      key={`${option}-${index}`}
                      activeOpacity={
                        0.85
                      }
                      style={[

                        styles.optionCard,

                        isSelected &&
                          styles.selectedCard,

                        showAnswerResult &&
                          isSelected &&
                          answerStatus ===
                            'correct' &&
                          styles.correctCard,

                        showAnswerResult &&
                          isSelected &&
                          answerStatus ===
                            'wrong' &&
                          styles.wrongCard,
                      ]}
                      onPress={() =>
                        handleAnswer(
                          option
                        )
                      }
                    >

                      <View
                        style={
                          styles.optionBadge
                        }
                      >

                        <Text
                          style={
                            styles.optionBadgeText
                          }
                        >
                          {
                            labels[
                              index
                            ]
                          }
                        </Text>

                      </View>

                      <Text
                        style={
                          styles.optionText
                        }
                      >
                        {formatRupiah(
                          option
                        )}
                      </Text>

                    </TouchableOpacity>
                  );
                }
              )}

            </View>

          </View>

        </View>

      </GameLayout>

      <ResultModal
        visible={
          endState ===
          'result'
        }
        gameTitle="Berapakah Aku"
        stars={earnedStars}
        xp={xp}
        coin={coinReward}
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

          router.push(
            '/siswa/tabs/leaderboard'
          );
        }}
      />

      <GameOverModal
        visible={
          endState ===
          'gameover'
        }
        onShop={() => {

          resetEndState();

          router.push(
            '/siswa/toko'
          );
        }}
        onBack={() => {

          resetEndState();

          router.back();
        }}
      />

    </>
  );
}

const styles =
  StyleSheet.create({

    content: {
      flex: 1,
      paddingBottom: 170,
    },

    questionBox: {
      backgroundColor:
        '#FFFFFF',
      borderRadius: 22,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginTop: 10,
      alignItems: 'center',
      borderWidth: 2,
      borderColor:
        '#BFE3FF',
      shadowColor:
        '#5CBEFA',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },

    questionMini: {
      fontSize: 13,
      fontWeight: '800',
      color: '#5CBEFA',
      marginBottom: 4,
    },

    questionIndicator: {
      fontSize: 14,
      fontWeight: '800',
      color: '#0284C7',
      marginBottom: 10,
    },

    questionText: {
      fontSize: 18,
      fontWeight: '900',
      color: '#163B65',
      textAlign: 'center',
    },

    mainCard: {
      backgroundColor:
        '#FFFFFF',
      borderRadius: 24,
      marginTop: 14,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      borderWidth: 2,
      borderColor:
        '#BFE3FF',
      shadowColor:
        '#5CBEFA',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },

    itemCard: {
      flex: 1,
      backgroundColor:
        '#EAF6FF',
      borderRadius: 20,
      paddingVertical: 14,
      paddingHorizontal: 8,
      alignItems: 'center',
    },

    itemCardOrange: {
      backgroundColor:
        '#FFF1E6',
    },

    emoji: {
      fontSize: 42,
    },

    itemText: {
      fontSize: 14,
      fontWeight: '800',
      color: '#163B65',
      marginTop: 6,
      textAlign: 'center',
    },

    priceTag: {
      backgroundColor:
        '#CFEAFF',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginTop: 8,
    },

    questionTag: {
      backgroundColor:
        '#FFD8B4',
    },

    priceText: {
      fontSize: 13,
      fontWeight: '900',
      color: '#0284C7',
    },

    questionMark: {
      fontSize: 18,
      fontWeight: '900',
      color: '#EA580C',
    },

    plusCircle: {
      width: 44,
      height: 44,
      borderRadius: 999,
      backgroundColor:
        '#DDF2FF',
      justifyContent:
        'center',
      alignItems: 'center',
      marginHorizontal: 8,
    },

    plusText: {
      fontSize: 24,
      fontWeight: '900',
      color: '#5CBEFA',
    },

    totalCard: {
      backgroundColor:
        '#FFFFFF',
      borderRadius: 22,
      marginTop: 14,
      paddingVertical: 14,
      alignItems: 'center',
      borderWidth: 2,
      borderColor:
        '#5CBEFA',
      shadowColor:
        '#5CBEFA',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },

    totalLabel: {
      fontSize: 12,
      fontWeight: '800',
      color: '#5CBEFA',
    },

    totalText: {
      fontSize: 30,
      fontWeight: '900',
      color: '#163B65',
      marginTop: 4,
    },

    optionsWrapper: {
      marginTop: 20,
    },

    optionsContainer: {
      flexDirection: 'row',
      gap: 8,
    },

    optionCard: {
      flex: 1,
      backgroundColor:
        '#FFFFFF',
      borderRadius: 18,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent:
        'center',
      shadowColor:
        '#5CBEFA',
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },

    optionBadge: {
      width: 34,
      height: 34,
      borderRadius: 999,
      backgroundColor:
        '#5CBEFA',
      justifyContent:
        'center',
      alignItems: 'center',
      marginBottom: 10,
    },

    optionBadgeText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '900',
    },

    optionText: {
      fontSize: 15,
      fontWeight: '900',
      color: '#163B65',
    },

    selectedCard: {
      backgroundColor:
        '#DDF2FF',
      borderWidth: 2,
      borderColor:
        '#5CBEFA',
    },

    correctCard: {
      backgroundColor:
        '#DCFCE7',
      borderWidth: 2,
      borderColor:
        '#22C55E',
    },

    wrongCard: {
      backgroundColor:
        '#FEE2E2',
      borderWidth: 2,
      borderColor:
        '#EF4444',
    },
  });