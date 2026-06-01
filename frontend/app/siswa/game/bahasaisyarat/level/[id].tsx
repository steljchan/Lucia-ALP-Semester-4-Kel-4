import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  ScrollView,
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
  doc,
  getDoc,
} from 'firebase/firestore';

import {
  db,
  auth,
} from '../../../../../src/config/firebase';

import {
  bahasaIsyaratLevels,
} from '../../../../../src/data/bahasaisyarat';

import {
  bahasaIsyaratImages,
} from '../../../../../src/constants/bahasaIsyarat';

import useBahasaIsyarat from '../../../../../src/hooks/useBahasaIsyarat';

import ResultModal from '../../../../../src/components/game/common/resultModal';

import GameLayout from '../../../../../src/components/game/layout/GameLayout';

import GameOverModal from '../../../../../src/components/game/common/GameOverModal';

import useGameEnd from '../../../../../src/hooks/useGameEnd';

import {
  refreshHeart,
  decrementHeart,
} from '../../../../../src/services/heartRegen';

import {
  saveGameProgress,
} from '../../../../../src/services/gameProgress';

import {
  calculateGameRewards,
} from '../../../../../utils/calculatedGameReward';

export default function BahasaIsyaratLevel() {

  const { id } =
    useLocalSearchParams();

  const router =
    useRouter();

  const levelIndex =
    Number(id) - 1;

  const level =
    bahasaIsyaratLevels[levelIndex];

  const {

    selected,

    usedIndexes,

    letterResults = [],

    select,

    reset,

    check,

    isFull,

  } = useBahasaIsyarat(
    level.word
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
    isSelecting,
    setIsSelecting,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  // ========================================
  // FIX REPLAY COLOR
  // ========================================

  const [
    hasSubmitted,
    setHasSubmitted,
  ] = useState(false);

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
  // OPTIONS
  // ========================================

  const options =
    useMemo(() => {

      const alphabet =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
          .split('');

      const extra =
        alphabet

          .filter(
            (l) =>
              !level.letters.includes(
                l
              )
          )

          .sort(
            () =>
              Math.random() -
              0.5
          )

          .slice(0, 3);

      return [

        ...level.letters,

        ...extra,

      ].sort(
        () =>
          Math.random() -
          0.5
      );

    }, [level.id]);

  const rows = [];

  for (
    let i = 0;
    i < options.length;
    i += 3
  ) {

    rows.push(
      options.slice(i, i + 3)
    );
  }

  // ========================================
  // ANIMATION
  // ========================================

  const playCorrectAnimation =
    () => {

      Animated.sequence([

        Animated.timing(
          scaleAnim,
          {
            toValue: 1.06,
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

    setHasSubmitted(false);

    reset();

    scaleAnim.setValue(1);

    shakeAnim.setValue(0);

    setIsSubmitting(false);

    setIsSelecting(false);
  };

  // ========================================
  // SELECT
  // ========================================

  const handleSelect = (
    letter: string,
    index: number
  ) => {

    if (isSelecting) return;

    if (isSubmitting) return;

    if (
      usedIndexes.includes(
        index
      )
    ) {
      return;
    }

    if (
      selected.length >=
      level.word.length
    ) {
      return;
    }

    setIsSelecting(true);

    select(letter, index);

    setTimeout(() => {

      setIsSelecting(false);

    }, 100);
  };

  // ========================================
  // NEXT LEVEL
  // ========================================

  const goNextLevel = () => {

    const next =
      levelIndex + 2;

    if (
      next <=
      bahasaIsyaratLevels.length
    ) {

      router.replace(
        `/siswa/game/bahasaisyarat/level/${next}`
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

      if (!isFull) return;

      if (isSubmitting)
        return;

      setIsSubmitting(true);

      setHasSubmitted(true);

      const resultData =
        check();

      const result =
        resultData.isCorrect;

      const rewards =
        calculateGameRewards({

          correctAnswers:
            resultData.correctCount,

          wrongAnswers:
            resultData.wrongCount,

          totalQuestions:
            level.word.length,

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

        } catch (err: any) {

          updatedHeart = 0;
        }
      }

      setTimeout(
        async () => {

          try {

            await saveGameProgress({

              gameId:
                'bahasaisyarat',

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
                !result,
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

            onPress:
              resetGame,
          },

          {
            text:
              isSubmitting
                ? 'Loading...'
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

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
        >

          <Animated.View
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
            ]}
          >
            <View
              style={
                styles.answerContainer
              }
            >

              <Text
                style={
                  styles.questionWord
                }
              >
                {level.word}
              </Text>

            </View>
          </Animated.View>

          <Text
            style={
              styles.subtitle
            }
          >
            Pilih gambar bahasa
            isyarat
          </Text>

          <View
            style={
              styles.optionsContainer
            }
          >
            {rows.map(
              (
                row,
                rowIndex
              ) => (

                <View
                  key={rowIndex}
                  style={
                    styles.row
                  }
                >

                  {row.map(
                    (
                      letter,
                      i
                    ) => {

                      const index =
                        rowIndex *
                          3 +
                        i;

                      const isSelected =
                        usedIndexes.includes(
                          index
                        );

                      const selectedIndex =
                        usedIndexes.findIndex(
                          (
                            used
                          ) =>
                            used ===
                            index
                        );

                      const currentStatus =
                        hasSubmitted &&
                        selectedIndex !== -1
                          ? letterResults[
                              selectedIndex
                            ]
                          : undefined;

                      return (

                        <TouchableOpacity
                          key={index}
                          activeOpacity={
                            0.8
                          }
                          style={[

                            styles.signOption,

                            isSelected &&
                              !hasSubmitted &&
                              styles.signSelected,

                            hasSubmitted &&
                              currentStatus ===
                                'correct' &&
                              styles.correctOption,

                            hasSubmitted &&
                              currentStatus ===
                                'wrong' &&
                              styles.wrongOption,
                          ]}
                          onPress={() =>
                            handleSelect(
                              letter,
                              index
                            )
                          }
                          disabled={
                            isSelected ||
                            isSelecting ||
                            isSubmitting ||
                            selected.length >=
                              level.word.length
                          }
                        >

                          <Image
                            source={
                              bahasaIsyaratImages[
                                letter.toLowerCase() as keyof typeof bahasaIsyaratImages
                              ]
                            }
                            style={
                              styles.signImage
                            }
                          />

                        </TouchableOpacity>
                      );
                    }
                  )}

                </View>
              )
            )}

          </View>

        </ScrollView>

      </GameLayout>

      <ResultModal
        visible={
          endState ===
          'result'
        }
        gameTitle="Bahasa Isyarat"
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

    questionContainer: {
      backgroundColor:
        '#fff',
      borderRadius: 26,
      paddingVertical: 35,
      marginTop: 35,
      marginBottom: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 3,
      minHeight: 120,
      justifyContent:
        'center',
    },

    answerContainer: {
      flexDirection:
        'row',
      flexWrap: 'wrap',
      justifyContent:
        'center',
      gap: 4,
      paddingHorizontal: 10,
    },

    answerLetter: {
      fontSize: 48,
      fontWeight: '800',
      color: '#163B65',
      letterSpacing: 3,
    },

    correctLetter: {
      color: '#22C55E',
    },

    wrongLetter: {
      color: '#EF4444',
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
      backgroundColor:
        '#fff',
      borderRadius: 22,
      justifyContent:
        'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.07,
      shadowRadius: 5,
      elevation: 3,
      borderWidth: 3,
      borderColor:
        'transparent',
    },

    signSelected: {
      borderColor:
        '#5CBEFA',
      backgroundColor:
        '#DDF2FF',
    },

    correctOption: {
      backgroundColor:
        '#DCFCE7',
      borderColor:
        '#22C55E',
    },

    wrongOption: {
      backgroundColor:
        '#FEE2E2',
      borderColor:
        '#EF4444',
    },

    signImage: {
      width: 52,
      height: 52,
      resizeMode:
        'contain',
    },

    questionWord: {
      fontSize: 42,
      fontWeight: '800',
      color: '#163B65',
      letterSpacing: 4,
      textAlign: 'center',
    },
  });