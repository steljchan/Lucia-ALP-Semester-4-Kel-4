import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';

import {
  useRouter,
  useLocalSearchParams,
} from 'expo-router';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
} from '@/utils/theme';

/*
  ========================================
  FIREBASE
  ========================================
*/

import {
  auth,
  db,
} from '@/src/config/firebase';

import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

/*
  ========================================
  SERVICES
  ========================================
*/

import {
  calculateGameRewards,
} from '../../../utils/calculatedGameReward';

import {
  saveGameProgress,
} from '../../../src/services/gameProgress';

export default function ScoreScreen() {

  const router =
    useRouter();

  const params =
    useLocalSearchParams();

  const {
    score,
    correct,
    wrong,
    skipped,
    total,
    answers,
    gameId,
    levelId,
    difficulty,
    streak,
    materialId,
    subjectId,
    classId,
    name,
  } = params;

  /*
    ========================================
    PARSE DATA
    ========================================
  */

  const correctNum =
    parseInt(
      correct as string
    ) || 0;

  const wrongNum =
    parseInt(
      wrong as string
    ) || 0;

  const skippedNum =
    parseInt(
      skipped as string
    ) || 0;

  const totalNum =
    parseInt(
      total as string
    ) || 1;

  const scoreNum =
    parseInt(
      score as string
    ) || 0;

  const progress =
    totalNum
      ? (correctNum /
          totalNum) *
        100
      : 0;

  /*
    ========================================
    STATE
    ========================================
  */

  const [
    openPembahasan,
    setOpenPembahasan,
  ] = useState<
    Record<number, boolean>
  >({});

  const [
    xpEarned,
    setXpEarned,
  ] = useState(0);

  const [
    coinEarned,
    setCoinEarned,
  ] = useState(0);

  const [
    earnedStars,
    setEarnedStars,
  ] = useState(0);

  const [
    isReplay,
    setIsReplay,
  ] = useState(false);

  const [
    rewardSaved,
    setRewardSaved,
  ] = useState(false);

  const awardingRef =
    useRef(false);

  /*
    ========================================
    TOGGLE PEMBAHASAN
    ========================================
  */

  const togglePembahasan =
    (
      index: number
    ) => {

      setOpenPembahasan(
        (prev) => ({
          ...prev,
          [index]:
            !prev[index],
        })
      );
    };

  /*
    ========================================
    PARSE ANSWERS
    ========================================
  */

  let parsedAnswers:
    any[] = [];

  try {

    parsedAnswers =
      answers
        ? JSON.parse(
            answers as string
          )
        : [];

    if (
      !Array.isArray(
        parsedAnswers
      )
    ) {

      parsedAnswers =
        [];
    }

  } catch (e) {

    parsedAnswers = [];
  }

  /*
    ========================================
    SAVE RESULT
    ========================================
  */

  useEffect(() => {

    const saveResult =
      async () => {

        if (
          rewardSaved ||
          awardingRef.current
        ) {

          return;
        }

        awardingRef.current =
          true;

        const user =
          auth.currentUser;

        if (!user) {

          return;
        }

        try {

          /*
            =========================
            CALCULATE REWARD
            =========================
          */

          const reward =
            calculateGameRewards({

              correctAnswers:
                correctNum,

              wrongAnswers:
                wrongNum,

              totalQuestions:
                totalNum,

              difficulty:
                (difficulty as any) ||
                'easy',

              streak:
                Number(
                  streak
                ) || 0,

              alreadyCompleted:
                false,
            });

          /*
            =========================
            SAVE PROGRESS
            =========================
          */

          const result =
            await saveGameProgress({

              gameId:
                String(
                  gameId
                ),

              levelId:
                Number(
                  levelId
                ),

              stars:
                reward.stars,

              xp:
                reward.xp,

              coin:
                reward.coin,
            });

          /*
            =========================
            UI
            =========================
          */

          setXpEarned(
            result.earnedXp
          );

          setCoinEarned(
            result.earnedCoin
          );

          setEarnedStars(
            result.bestStars
          );

          setIsReplay(
            !result.firstCompletion
          );

          /*
            =========================
            SAVE QUIZ RESULT
            =========================
          */

          await addDoc(
            collection(
              db,
              'quizResults'
            ),
            {
              userId:
                user.uid,

              studentName:
                name ||
                user.displayName ||
                'Siswa',

              classId,

              subjectId,

              materialId,

              score:
                scoreNum,

              correct:
                correctNum,

              wrong:
                wrongNum,

              skipped:
                skippedNum,

              total:
                totalNum,

              stars:
                result.bestStars,

              xp:
                result.earnedXp,

              coin:
                result.earnedCoin,

              replay:
                !result.firstCompletion,

              timestamp:
                serverTimestamp(),
            }
          );

          setRewardSaved(
            true
          );

        } catch (error) {

          console.error(
            'SAVE RESULT ERROR:',
            error
          );

          Alert.alert(
            'Error',
            'Gagal menyimpan progress.'
          );
        }
      };

    saveResult();

  }, []);

  /*
    ========================================
    OPTION COLOR
    ========================================
  */

  const getCircleColor =
    (
      option: string,
      correctAnswer: string,
      userAnswer:
        | string
        | null,
      isSkipped: boolean,
      isCorrectAnswer: boolean
    ) => {

      if (
        isSkipped &&
        isCorrectAnswer
      ) {

        return COLORS.yellow;
      }

      if (
        !isSkipped &&
        userAnswer ===
          option
      ) {

        if (
          option ===
          correctAnswer
        ) {

          return COLORS.success;
        }

        return COLORS.error;
      }

      if (
        option ===
        correctAnswer
      ) {

        return COLORS.success;
      }

      return COLORS.primary;
    };

  return (
    <View style={styles.root}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          COLORS.white
        }
      />

      {/* HEADER */}
      <LinearGradient
        colors={[
          '#FFFFFF',
          '#ADDFFD',
        ]}
        style={
          styles.header
        }
      >

        <View
          style={
            styles.headerRow
          }
        >

          <TouchableOpacity
            onPress={() =>
              router.back()
            }
            style={
              styles.backButton
            }
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={
                COLORS.textMain
              }
            />
          </TouchableOpacity>

          <Text
            style={
              styles.headerTitle
            }
          >
            Score
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push(
                '/siswa/tabs/leaderboard'
              )
            }
            style={
              styles.iconButton
            }
          >
            <Ionicons
              name="podium-outline"
              size={24}
              color={
                COLORS.primary
              }
            />
          </TouchableOpacity>
        </View>

        <Text
          style={
            styles.subtitle
          }
        >
          Hasil Quiz Kamu
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >

        {/* MASCOT */}
        <View
          style={
            styles.mascotWrapper
          }
        >
          <Image
            source={require('@/assets/images/maskot1.png')}
            style={
              styles.mascot
            }
            resizeMode="contain"
          />
        </View>

        {/* SCORE CARD */}
        <View
          style={
            styles.card
          }
        >

          <View
            style={
              styles.cardContent
            }
          >

            <Text
              style={
                styles.title
              }
            >
              CONGRATULATIONS 🎉
            </Text>

            {/* SCORE */}
            <View
              style={
                styles.scoreHero
              }
            >
              <Text
                style={
                  styles.scoreNumber
                }
              >
                {scoreNum}
              </Text>

              <Text
                style={
                  styles.scoreLabel
                }
              >
                Nilai Akhir
              </Text>
            </View>

            {/* PROGRESS */}
            <View
              style={
                styles.progressBar
              }
            >
              <View
                style={[
                  styles.fill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>

            <View
              style={
                styles.divider
              }
            />

            {/* STATS */}
            <View
              style={
                styles.statsRow
              }
            >

              <View
                style={
                  styles.statBox
                }
              >
                <Ionicons
                  name="document-text-outline"
                  size={28}
                  color={
                    COLORS.primary
                  }
                />

                <Text
                  style={
                    styles.statNumber
                  }
                >
                  {totalNum}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  Total Soal
                </Text>
              </View>

              <View
                style={
                  styles.verticalDivider
                }
              />

              <View
                style={
                  styles.statBox
                }
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={28}
                  color={
                    COLORS.success
                  }
                />

                <Text
                  style={[
                    styles.statNumber,
                    {
                      color:
                        COLORS.success,
                    },
                  ]}
                >
                  {correctNum}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  Benar
                </Text>
              </View>

              <View
                style={
                  styles.verticalDivider
                }
              />

              <View
                style={
                  styles.statBox
                }
              >
                <Ionicons
                  name="close-circle-outline"
                  size={28}
                  color={
                    COLORS.error
                  }
                />

                <Text
                  style={[
                    styles.statNumber,
                    {
                      color:
                        COLORS.error,
                    },
                  ]}
                >
                  {wrongNum}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  Salah
                </Text>
              </View>

              <View
                style={
                  styles.verticalDivider
                }
              />

              <View
                style={
                  styles.statBox
                }
              >
                <Ionicons
                  name="hourglass-outline"
                  size={28}
                  color={
                    COLORS.yellow
                  }
                />

                <Text
                  style={[
                    styles.statNumber,
                    {
                      color:
                        COLORS.yellow,
                    },
                  ]}
                >
                  {skippedNum}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  Kosong
                </Text>
              </View>
            </View>

            {/* REWARD */}
            <View
              style={
                styles.xpContainer
              }
            >

              <Text
                style={
                  styles.xpLabel
                }
              >
                {isReplay
                  ? 'Replay Reward'
                  : 'Reward Diperoleh'}
              </Text>

              <View
                style={
                  styles.rewardRow
                }
              >

                {/* XP */}
                <View
                  style={
                    styles.xpBadge
                  }
                >
                  <Ionicons
                    name="flash"
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />

                  <Text
                    style={
                      styles.xpBadgeText
                    }
                  >
                    +{xpEarned} XP
                  </Text>
                </View>

                {/* COIN */}
                <View
                  style={
                    styles.xpBadge
                  }
                >
                  <Text
                    style={{
                      fontSize: 18,
                    }}
                  >
                    🪙
                  </Text>

                  <Text
                    style={
                      styles.xpBadgeText
                    }
                  >
                    +{coinEarned}
                  </Text>
                </View>

                {/* STAR */}
                <View
                  style={
                    styles.xpBadge
                  }
                >
                  <Ionicons
                    name="star"
                    size={18}
                    color="#F59E0B"
                  />

                  <Text
                    style={
                      styles.xpBadgeText
                    }
                  >
                    {earnedStars}
                  </Text>
                </View>

              </View>

              {isReplay && (

                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color:
                      COLORS.textSub,
                  }}
                >
                  Replay level —
                  XP & coin tidak
                  bertambah
                </Text>
              )}
            </View>

          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    header: {
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      marginBottom: 12,
    },

    headerRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },

    backButton: {
      padding: 8,
    },

    iconButton: {
      backgroundColor:
        COLORS.white,
      borderWidth: 1,
      borderColor:
        COLORS.primary,
      padding: 8,
      borderRadius:
        BORDER_RADIUS.s,
      alignItems: 'center',
      justifyContent:
        'center',
      shadowColor:
        COLORS.black,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color:
        COLORS.textMain,
      textAlign: 'center',
    },

    subtitle: {
      fontSize: 16,
      color:
        COLORS.textMain,
      textAlign: 'center',
      fontWeight: '500',
      opacity: 0.8,
    },

    content: {
      padding: SPACING.md,
      paddingTop: 100,
    },

    mascotWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 10,
    },

    mascot: {
      width: 200,
      height: 200,
      transform: [
        {
          scale: 1.05,
        },
      ],
    },

    card: {
      backgroundColor:
        COLORS.white,
      borderRadius:
        BORDER_RADIUS.s,
      padding:
        SPACING.lg,
      alignItems:
        'center',
      marginBottom:
        SPACING.lg,
      elevation: 3,
      borderWidth: 1,
      borderColor:
        COLORS.primary,
    },

    cardContent: {
      marginTop: 100,
      width: '100%',
      alignItems:
        'center',
    },

    title: {
      fontSize: 18,
      fontWeight: '700',
      color:
        COLORS.textMain,
      marginBottom: 6,
    },

    scoreHero: {
      alignItems:
        'center',
      marginVertical: 18,
    },

    scoreNumber: {
      fontSize: 96,
      fontWeight: '800',
      color:
        COLORS.primary,
      lineHeight: 100,
    },

    scoreLabel: {
      fontSize: 16,
      fontWeight: '600',
      color:
        COLORS.textSub,
      marginTop: 4,
    },

    progressBar: {
      width: '100%',
      height: 10,
      backgroundColor:
        COLORS.gray,
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 20,
    },

    fill: {
      height: '100%',
      backgroundColor:
        COLORS.primary,
      borderRadius: 20,
    },

    divider: {
      width: '100%',
      height: 1,
      backgroundColor:
        COLORS.primary,
      marginVertical: 12,
    },

    statsRow: {
      flexDirection: 'row',
      alignItems:
        'center',
      justifyContent:
        'space-around',
      width: '100%',
    },

    verticalDivider: {
      width: 1,
      height: 50,
      backgroundColor:
        COLORS.primary,
      marginHorizontal: 8,
    },

    statBox: {
      flex: 1,
      alignItems:
        'center',
      paddingVertical: 8,
    },

    statNumber: {
      fontSize: 24,
      fontWeight: '700',
      marginTop: 4,
    },

    statLabel: {
      fontSize: 12,
      color:
        COLORS.textSub,
      marginTop: 2,
      textAlign: 'center',
    },

    xpContainer: {
      width: '100%',
      alignItems:
        'center',
      marginTop: 18,
    },

    xpLabel: {
      fontSize: 12,
      color:
        COLORS.textSub,
      marginBottom: 6,
      fontWeight: '500',
    },

    rewardRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 6,
    },

    xpBadge: {
      flexDirection: 'row',
      alignItems:
        'center',
      backgroundColor:
        COLORS.smoothBlue,
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        COLORS.primary,
    },

    xpBadgeText: {
      fontSize: 16,
      fontWeight: '700',
      color:
        COLORS.primary,
      marginLeft: 6,
    },
  });