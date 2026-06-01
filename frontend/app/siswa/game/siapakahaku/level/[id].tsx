import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
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

import {
  siapakahAkuLevels,
} from '../../../../../src/data/siapakahaku';

import {
  siapakahAkuImages,
} from '../../../../../src/constants/siapakahAku';

import useSiapakahAku
from '../../../../../src/hooks/usesiapakahaku';

import LetterBox
from '../../../../../src/components/game/siapakahAku/LetterBox';

import GameLayout
from '../../../../../src/components/game/layout/GameLayout';

import HintModal
from '../../../../../src/components/game/common/hintModal';

import ResultModal
from '../../../../../src/components/game/common/resultModal';

import GameOverModal
from '../../../../../src/components/game/common/GameOverModal';

import useGameEnd
from '../../../../../src/hooks/useGameEnd';

import {
  calculateGameRewards,
} from '../../../../../utils/calculatedGameReward';

import {
  refreshHeart,
  decrementHeart,
} from '../../../../../src/services/heartRegen';

import {
  doc,
  getDoc,
} from 'firebase/firestore';

import {
  db,
  auth,
} from '../../../../../src/config/firebase';

export default function GamePlay() {

  const { id } =
    useLocalSearchParams();

  const router =
    useRouter();

  const levelIndex =
    Number(id) - 1;

  const level =
    siapakahAkuLevels[levelIndex];

  // ========================================
  // STATES
  // ========================================

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const question =
    level.questions[questionIndex];

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

  } = useSiapakahAku(
    question.answer
  );

  const {

    endState,

    handleGameEnd,

    resetEndState,

  } = useGameEnd();

  const [earnedStars, setEarnedStars] =
    useState(0);

  const [xp, setXp] =
    useState(0);

  const [rewardCoin, setRewardCoin] =
    useState(0);

  const [userHeart, setUserHeart] =
    useState(0);

  const [userCoin, setUserCoin] =
    useState(0);

  const [totalCorrect, setTotalCorrect] =
    useState(0);

  const [totalWrong, setTotalWrong] =
    useState(0);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showHint, setShowHint] =
    useState(false);

  const [hintStep, setHintStep] =
    useState(0);

  // ========================================
  // ANIMATION
  // ========================================

  const scaleAnim =
    useRef(
      new Animated.Value(1)
    ).current;

  // ========================================
  // OPTIONS
  // ========================================

  const options = useMemo(() => {

    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        .split('');

    const answerLetters =
      question.answer.split('');

    const extra =
      alphabet
        .filter(
          (l) =>
            !answerLetters.includes(l)
        )
        .sort(
          () =>
            Math.random() - 0.5
        )
        .slice(0, 3);

    return [
      ...answerLetters,
      ...extra,
    ].sort(
      () =>
        Math.random() - 0.5
    );

  }, [question]);

  // ========================================
  // RESPONSIVE ANSWER BOX
  // ========================================

  const answerLetters =
    question.answer.split('');

  const answerLength =
    answerLetters.length;

  // >= 12 otomatis 2 row
  const isTwoRows =
    answerLength >= 12;

  const splitAnswerIndex =
    Math.ceil(answerLength / 2);

  const firstRowAnswer =
    isTwoRows
      ? answerLetters.slice(
          0,
          splitAnswerIndex
        )
      : answerLetters;

  const secondRowAnswer =
    isTwoRows
      ? answerLetters.slice(
          splitAnswerIndex
        )
      : [];

  // ========================================
  // SCALE JAWABAN
  // ========================================

  // >6 mulai mengecil
  // >=12 balik normal karena sudah 2 row

  const answerBoxScale =
    answerLength >= 12
      ? 1
      : answerLength >= 10
      ? 0.72
      : answerLength >= 8
      ? 0.82
      : answerLength > 6
      ? 0.9
      : 1;

  // spacing menyesuaikan ukuran
  const answerSpacing =
    answerLength >= 12
      ? 2
      : answerLength >= 10
      ? -10
      : answerLength >= 8
      ? -6
      : answerLength > 6
      ? -2
      : 2;

  // ========================================
  // RESPONSIVE OPTION BUTTON
  // ========================================

  const optionsLength =
    options.length;

  // >12 jauh lebih kecil
  const optionButtonSize =
    optionsLength > 12
      ? 38
      : optionsLength >= 11
      ? 48
      : 55;

  const optionFontSize =
    optionsLength > 12
      ? 15
      : optionsLength >= 11
      ? 18
      : 20;

  // spacing dibedakan jelas
  const optionGap =
    optionsLength > 12
      ? 4
      : optionsLength >= 11
      ? 8
      : 10;

  // max 2 row
  const splitIndex =
    options.length <= 6
      ? options.length
      : Math.ceil(
          options.length / 2
        );

  const topRow =
    options.slice(
      0,
      splitIndex
    );

  const bottomRow =
    options.slice(splitIndex);

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

          setUserHeart(
            heartAfterRegen
          );

          setUserCoin(
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

  const playAnimation = (
    correct: boolean
  ) => {

    Animated.sequence([

      Animated.timing(
        scaleAnim,
        {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        scaleAnim,
        {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }
      ),

    ]).start();

    if (!correct) {

      setTimeout(() => {

        reset();

      }, 900);
    }
  };

  // ========================================
  // HINT
  // ========================================

  const hintText =
    useMemo(() => {

      const answer =
        question.answer;

      switch (hintStep) {

        case 0:

          return `Huruf pertama: ${answer[0]}`;

        case 1:

          return `Huruf terakhir: ${
            answer[
              answer.length - 1
            ]
          }`;

        case 2:

          return `Jumlah huruf: ${answer.length}`;

        default:

          return 'Semangat 😄';
      }

    }, [
      hintStep,
      question.answer,
    ]);

  // ========================================
  // RESET GAME
  // ========================================

  const resetGame = () => {

    reset();

    setQuestionIndex(0);

    setTotalCorrect(0);

    setTotalWrong(0);

    setIsSubmitting(false);

    scaleAnim.setValue(1);
  };

  // ========================================
  // SUBMIT
  // ========================================

  const onSubmit =
    async () => {

      if (!isFull) return;

      if (isSubmitting)
        return;

      setIsSubmitting(true);

      const resultData =
        check();

      const result =
        resultData.isCorrect;

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

      setRewardCoin(
        rewards.coin
      );

      let updatedHeart =
        userHeart;

      if (result) {

        playAnimation(true);

      } else {

        playAnimation(false);

        try {

          updatedHeart =
            await decrementHeart();

          setUserHeart(
            updatedHeart
          );

        } catch {

          updatedHeart = 0;
        }
      }

      const isLastQuestion =
        questionIndex ===
        level.questions.length - 1;

      const isGameOver =
        !result &&
        updatedHeart <= 0;

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

          setQuestionIndex(
            (prev) =>
              prev + 1
          );

          setIsSubmitting(false);

        }, 700);

        return;
      }

      setTimeout(
        async () => {

          try {

            await saveGameProgress({

              gameId:
                'siapakahaku',

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

  // ========================================
  // NEXT LEVEL
  // ========================================

  const goNextLevel =
    () => {

      const next =
        levelIndex + 2;

      if (
        next <=
        siapakahAkuLevels.length
      ) {

        router.replace(
          `/siswa/game/siapakahaku/level/${next}`
        );

      } else {

        router.back();
      }
    };

  return (
    <>

      <GameLayout
        title="Siapakah Aku"
        image={require(
          '@/assets/images/games/siapakahAku.png'
        )}
        level={level.id}
        heart={userHeart}
        coin={userCoin}
        actions={[

          {
            icon: '💡',
            color: '#FFD700',
            onPress: () =>
              setShowHint(true),
          },

          {
            icon: '⌫',
            color: '#FF6B6B',
            onPress:
              removeLast,
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
              !isFull ||
              isSubmitting,

            flex: 1,
          },

        ]}
      >

        <Text style={styles.title}>
          Siapakah Aku?
        </Text>

        <Image
          source={
            siapakahAkuImages[
              question.image as keyof typeof siapakahAkuImages
            ]
          }
          style={styles.image}
        />

        {/* ANSWER */}

        <Animated.View
          key={questionIndex}
          style={[
            {
              transform: [
                {
                  scale:
                    scaleAnim,
                },
              ],
            },
          ]}
        >

          {/* ROW 1 */}
          <View style={styles.answerRow}>
            {firstRowAnswer.map(
              (_, i) => (
                <TouchableOpacity
                  key={`answer-top-${i}`}
                  activeOpacity={0.7}
                  onPress={() =>
                    remove(i)
                  }
                >
                  <View
                    style={{
                      transform: [
                        {
                          scale:
                            answerBoxScale,
                        },
                      ],
                      marginHorizontal:
                        answerSpacing,
                    }}
                  >
                    <LetterBox
                      letter={
                        selected[i]
                      }
                      status={status}
                    />
                  </View>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* ROW 2 */}
          {isTwoRows && (
            <View style={styles.answerRow}>
              {secondRowAnswer.map(
                (_, idx) => {

                  const realIndex =
                    idx +
                    firstRowAnswer.length;

                  return (
                    <TouchableOpacity
                      key={`answer-bottom-${realIndex}`}
                      activeOpacity={0.7}
                      onPress={() =>
                        remove(
                          realIndex
                        )
                      }
                    >
                      <View
                        style={{
                          transform: [
                            {
                              scale:
                                answerBoxScale,
                            },
                          ],
                          marginHorizontal:
                            answerSpacing,
                        }}
                      >
                        <LetterBox
                          letter={
                            selected[
                              realIndex
                            ]
                          }
                          status={
                            status
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          )}

        </Animated.View>

        {/* OPTIONS */}

        <View
          style={
            styles.optionsContainer
          }
        >

          <View
            style={[
              styles.row,
              {
                gap: optionGap,
              },
            ]}
          >

            {topRow.map(
              (l, i) => {

                const index =
                  i;

                const isUsed =
                  usedIndexes.includes(
                    index
                  );

                return (

                  <TouchableOpacity
                    key={`top-${index}-${l}`}
                    activeOpacity={0.7}
                    style={[

                      styles.optionBtn,

                      {
                        width:
                          optionButtonSize,

                        height:
                          optionButtonSize,

                        borderRadius:
                          optionButtonSize / 4,
                      },

                      isUsed &&
                        styles.optionDisabled,
                    ]}

                    onPress={() => {

                      if (
                        isUsed
                      ) return;

                      select(
                        l,
                        index
                      );
                    }}

                    disabled={
                      isUsed
                    }
                  >

                    <Text
                      style={[

                        styles.optionText,

                        {
                          fontSize:
                            optionFontSize,
                        },
                      ]}
                    >
                      {l}
                    </Text>

                  </TouchableOpacity>
                );
              }
            )}
          </View>

          {bottomRow.length >
            0 && (

            <View
              style={[
                styles.row,
                {
                  gap: optionGap,
                },
              ]}
            >

              {bottomRow.map(
                (
                  l,
                  i
                ) => {

                  const index =
                    i + splitIndex;

                  const isUsed =
                    usedIndexes.includes(
                      index
                    );

                  return (

                    <TouchableOpacity
                      key={`bottom-${index}-${l}`}
                      activeOpacity={0.7}
                      style={[

                        styles.optionBtn,

                        {
                          width:
                            optionButtonSize,

                          height:
                            optionButtonSize,

                          borderRadius:
                            optionButtonSize / 4,
                        },

                        isUsed &&
                          styles.optionDisabled,
                      ]}

                      onPress={() => {

                        if (
                          isUsed
                        ) return;

                        select(
                          l,
                          index
                        );
                      }}

                      disabled={
                        isUsed
                      }
                    >

                      <Text
                        style={[

                          styles.optionText,

                          {
                            fontSize:
                              optionFontSize,
                          },
                        ]}
                      >
                        {l}
                      </Text>

                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          )}
        </View>

      </GameLayout>

      <HintModal
        visible={showHint}
        hintText={hintText}
        onClose={() => {

          setShowHint(false);

          setHintStep(
            (prev) =>
              prev < 2
                ? prev + 1
                : prev
          );
        }}
      />

      <ResultModal
        visible={
          endState ===
          'result'
        }
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

    title: {
      textAlign:
        'center',
      fontSize: 24,
      fontWeight: '700',
      marginTop: 40,
      color: '#1A3B5D',
    },

    image: {
      width: 220,
      height: 220,
      alignSelf:
        'center',
      marginVertical: 20,
      resizeMode:
        'contain',
    },

    answerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      flexWrap: 'nowrap',
    },

    optionsContainer: {
      marginBottom: 20,
    },

    row: {
      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 10,
    },

    optionBtn: {
      backgroundColor:
        '#ADDFFD',

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    optionDisabled: {
      backgroundColor:
        '#E5E7EB',
    },

    optionText: {
      fontWeight: '700',
      color: '#1A3B5D',
    },
  });