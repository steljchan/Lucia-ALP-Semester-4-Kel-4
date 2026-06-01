import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
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
  jumlahKamiLevels,
} from '../../../../../src/data/berapakahjumlahkami';

import {
  saveGameProgress,
} from '../../../../../src/services/gameProgress';

import {
  refreshHeart,
  decrementHeart,
} from '../../../../../src/services/heartRegen';

import useBerapakahJumlahKami
from '../../../../../src/hooks/useBerapakahJumlahKami';

import GameLayout
from '../../../../../src/components/game/layout/GameLayout';

import ResultModal
from '../../../../../src/components/game/common/resultModal';

import GameOverModal
from '../../../../../src/components/game/common/GameOverModal';

import useGameEnd
from '../../../../../src/hooks/useGameEnd';

import {
  calculateGameRewards,
} from '../../../../../utils/calculatedGameReward';

export default function JumlahKamiLevel() {

  const { id } =
    useLocalSearchParams();

  const router =
    useRouter();

  const levelIndex =
    Number(id) - 1;

  const level =
    jumlahKamiLevels[levelIndex];

  // ========================================
  // STATES
  // ========================================

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const question =
    level.questions[questionIndex];

  const currentAnswer =
    level.questions[
      questionIndex
    ].answer;

  const {

    answer,

    status,

    addNumber,

    removeNumber,

    reset,

    check,

    isFilled,

  } = useBerapakahJumlahKami(
    currentAnswer
  );

  const {

    endState,

    handleGameEnd,

    resetEndState,

  } = useGameEnd();

  const [heart, setHeart] =
    useState(0);

  const [coinBalance, setCoinBalance] =
    useState(0);

  const [earnedStars, setEarnedStars] =
    useState(0);

  const [xp, setXp] =
    useState(0);

  const [coinReward, setCoinReward] =
    useState(0);

  const [totalCorrect, setTotalCorrect] =
    useState(0);

  const [totalWrong, setTotalWrong] =
    useState(0);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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
          'Gagal load user:',
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
            toValue: 1.08,
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
            duration: 60,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          shakeAnim,
          {
            toValue: -10,
            duration: 60,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          shakeAnim,
          {
            toValue: 10,
            duration: 60,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          shakeAnim,
          {
            toValue: 0,
            duration: 60,
            useNativeDriver: true,
          }
        ),

      ]).start();
    };

  // ========================================
  // RESET GAME
  // ========================================

  const resetGame = () => {

    reset();

    setQuestionIndex(0);

    setTotalCorrect(0);

    setTotalWrong(0);

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
      jumlahKamiLevels.length
    ) {

      router.replace(
        `/siswa/game/berapakahjumlahkami/level/${next}`
      );

    } else {

      router.back();
    }
  };

  // ========================================
  // SUBMIT
  // ========================================

    // ========================================
  // SUBMIT
  // ========================================

  const onSubmit =
    async () => {

      if (!isFilled) return;

      if (isSubmitting)
        return;

      setIsSubmitting(true);

      const resultData =
        check();

      const result =
        resultData.isCorrect;

      // ========================================
      // TRACK SCORE
      // ========================================

      const newCorrect =
        totalCorrect +
        resultData.correctCount;

      const newWrong =
        totalWrong +
        resultData.wrongCount;

      setTotalCorrect(
        newCorrect
      );

      setTotalWrong(
        newWrong
      );

      // ========================================
      // REWARDS
      // ========================================

      const rewards =
        calculateGameRewards({

          correctAnswers:
            newCorrect,

          wrongAnswers:
            newWrong,

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

      // ========================================
      // HEART
      // ========================================

      let updatedHeart =
        heart;

      if (result) {

        playCorrectAnimation();

      } else {

        playWrongAnimation();

        try {

          updatedHeart =
            await decrementHeart();

          setHeart(
            updatedHeart
          );

        } catch {

          updatedHeart = 0;
        }
      }

      // ========================================
      // CHECK CONDITION
      // ========================================

      const isLastQuestion =
        questionIndex ===
        level.questions.length - 1;

      const isGameOver =
        !result &&
        updatedHeart <= 0;

      // ========================================
      // CASE 1:
      // WRONG + HEART HABIS
      // => GAME OVER
      // ========================================

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

      // ========================================
      // CASE 2:
      // BUKAN LAST QUESTION
      // => NEXT QUESTION
      // ========================================

      if (!isLastQuestion) {

        setTimeout(() => {

          reset();

          setQuestionIndex(
            (prev) =>
              prev + 1
          );

          scaleAnim.setValue(1);

          shakeAnim.setValue(0);

          setIsSubmitting(false);

        }, 700);

        return;
      }

      // ========================================
      // CASE 3:
      // LAST QUESTION
      // => RESULT
      // ========================================

      setTimeout(
        async () => {

          try {

            await saveGameProgress({

              gameId:
                'berapakahjumlahkami',

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

              isWrong: false,

              heart:
                updatedHeart,
            });

          } finally {

            setIsSubmitting(
              false
            );
          }

        },

        700
      );
    };

  const keypad = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
  ];

  return (
    <>

      <GameLayout
        title="Berapakah Jumlah Kami"

        image={require(
          '@/assets/images/games/berapakahJumlahKami.png'
        )}

        level={level.id}

        heart={heart}

        coin={coinBalance}

        actions={[

          {
            icon: '⌫',

            color: '#FF6B6B',

            onPress:
              removeNumber,
          },

          {
            text:
              isSubmitting
                ? 'Loading...'
                : questionIndex <
                  level.questions.length - 1
                ? 'Next'
                : 'Jawab',

            color:
              '#5CBEFA',

            onPress:
              onSubmit,

            disabled:
              !isFilled ||
              isSubmitting,

            flex: 1,
          },

        ]}
      >

        {/* QUESTION */}
        <Animated.View
          key={questionIndex}
          style={[

            styles.questionContainer,

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

            status ===
              'correct' &&
              styles.correctContainer,

            status ===
              'wrong' &&
              styles.wrongContainer,
          ]}
        >

          <View
            style={
              styles.itemBox
            }
          >

            <Text
              style={
                styles.emoji
              }
            >
              {question.emoji1}
            </Text>

            <Text
              style={
                styles.count
              }
            >
              × {question.count1}
            </Text>

          </View>

          <Text
            style={
              styles.plus
            }
          >
            +
          </Text>

          <View
            style={
              styles.itemBox
            }
          >

            <Text
              style={
                styles.emoji
              }
            >
              {question.emoji2}
            </Text>

            <Text
              style={
                styles.count
              }
            >
              × {question.count2}
            </Text>

          </View>

        </Animated.View>

        {/* ANSWER */}
        <Animated.View
          key={`answer-${questionIndex}`}
          style={[

            styles.answerBox,

            status ===
              'correct' &&
              styles.correctAnswerBox,

            status ===
              'wrong' &&
              styles.wrongAnswerBox,

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
            style={[

              styles.answerText,

              status ===
                'correct' &&
                styles.correctAnswerText,

              status ===
                'wrong' &&
                styles.wrongAnswerText,
            ]}
          >
            {answer || '?'}
          </Text>

        </Animated.View>

        {/* KEYPAD */}
        <View
          style={
            styles.keypad
          }
        >

          {keypad.map(
            (n) => (

              <TouchableOpacity
                key={n}
                style={
                  styles.keyBtn
                }
                onPress={() =>
                  addNumber(n)
                }
                disabled={
                  isSubmitting
                }
              >

                <Text
                  style={
                    styles.keyText
                  }
                >
                  {n}
                </Text>

              </TouchableOpacity>
            )
          )}

        </View>

      </GameLayout>

      {/* RESULT */}
      <ResultModal
        visible={
          endState ===
          'result'
        }
        gameTitle="Berapakah Jumlah Kami"
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

      {/* GAME OVER */}
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

    questionContainer: {
      backgroundColor:
        '#fff',
      borderRadius: 28,
      paddingVertical: 24,
      paddingHorizontal: 18,
      marginTop: 30,
      flexDirection: 'row',
      justifyContent:
        'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 3,
    },

    correctContainer: {
      backgroundColor:
        '#DCFCE7',
    },

    wrongContainer: {
      backgroundColor:
        '#FEE2E2',
    },

    itemBox: {
      alignItems:
        'center',
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
      backgroundColor:
        '#fff',
      borderRadius: 22,
      marginTop: 22,
      marginBottom: 24,
      justifyContent:
        'center',
      alignItems: 'center',
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 3,
    },

    correctAnswerBox: {
      backgroundColor:
        '#DCFCE7',
      borderWidth: 2,
      borderColor:
        '#22C55E',
    },

    wrongAnswerBox: {
      backgroundColor:
        '#FEE2E2',
      borderWidth: 2,
      borderColor:
        '#EF4444',
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
      justifyContent:
        'center',
      gap: 12,
      paddingBottom: 20,
    },

    keyBtn: {
      width: 72,
      height: 72,
      backgroundColor:
        '#fff',
      borderRadius: 20,
      justifyContent:
        'center',
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
  });