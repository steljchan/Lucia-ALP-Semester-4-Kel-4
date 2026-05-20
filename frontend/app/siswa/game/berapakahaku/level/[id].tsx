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
} from 'expo-router';

import {
  useRef,
  useState,
} from 'react';

import {
  berapakahAkuLevels,
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

const formatRupiah = (
  value: number
) => {
  return `Rp${value.toLocaleString(
    'id-ID'
  )}`;
};

export default function BerapakahAkuLevel() {

  const { id } =
    useLocalSearchParams();

  const router =
    useRouter();

  const levelIndex =
    Number(id) - 1;

  const level =
    berapakahAkuLevels[levelIndex];

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

  const question =
    level.questions[questionIndex];

  const {
    selected,
    status,
    select,
    reset,
    check,
    isFilled,
  } = useBerapakahAku(
    question.answer
  );

  /*
    =========================
    RESULT
    =========================
  */

  const [
    showResult,
    setShowResult,
  ] = useState(false);

  const [
    earnedStars,
    setEarnedStars,
  ] = useState(0);

  const [xp, setXp] =
    useState(0);

  const [coin, setCoin] =
    useState(0);

  /*
    =========================
    ANIMATION
    =========================
  */

  const scaleAnim =
    useRef(
      new Animated.Value(1)
    ).current;

  const shakeAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const playCorrectAnimation =
    () => {

      Animated.sequence([
        Animated.timing(
          scaleAnim,
          {
            toValue: 1.04,
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

  /*
    =========================
    SUBMIT
    =========================
  */

  const onSubmit = () => {

    if (!isFilled)
      return;

    const result =
      check();

    if (result) {

      playCorrectAnimation();

    } else {

      playWrongAnimation();
    }

    /*
      =========================
      NEXT QUESTION
      =========================
    */

    if (
      questionIndex <
      level.questions.length - 1
    ) {

      setTimeout(() => {

        setQuestionIndex(
          (prev) => prev + 1
        );

        reset();

      }, 700);

    } else {

      /*
        =========================
        FINAL RESULT
        =========================
      */

      const stars =
        result ? 3 : 1;

      const earnedXp =
        result ? 150 : 50;

      const earnedCoin =
        result ? 8 : 2;

      setEarnedStars(stars);

      setXp(earnedXp);

      setCoin(earnedCoin);

      /*
        =========================
        SAVE FIREBASE
        =========================
      */

      setTimeout(async () => {

        try {

          await saveGameProgress({

            /*
              ID GAME
            */

            gameId:
              'berapakahaku',

            /*
              LEVEL
            */

            levelId:
              level.id,

            /*
              REWARD
            */

            stars:
              stars,

            xp:
              earnedXp,

            coin:
              earnedCoin,
          });

          /*
            SHOW RESULT
          */

          setShowResult(true);

        } catch (error) {

          console.log(
            'ERROR SAVE GAME:',
            error
          );
        }

      }, 700);
    }
  };

  /*
    =========================
    NEXT LEVEL
    =========================
  */

  const goNextLevel = () => {

    const next =
      levelIndex + 2;

    if (
      next <=
      berapakahAkuLevels.length
    ) {

      router.replace(
        `/siswa/game/berapakahaku/level/${next}`
      );

    } else {

      router.back();
    }
  };

  return (
    <>
      <GameLayout
        title="Berapakah Aku"
        level={level.id}

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
            disabled: !isFilled,
            flex: 1,
          },
        ]}
      >

        {/* QUESTION */}
        <Animated.View
          style={[
            styles.questionBox,

            {
              transform: [
                {
                  scale: scaleAnim,
                },

                {
                  translateX:
                    shakeAnim,
                },
              ],
            },

            status ===
              'correct' &&
              styles.correctBox,

            status ===
              'wrong' &&
              styles.wrongBox,
          ]}
        >

          <Text style={styles.questionMini}>
            🧮 Tebak Harga
          </Text>

          <Text style={styles.questionText}>
            {question.question}
          </Text>

        </Animated.View>

        {/* MAIN CARD */}
        <Animated.View
          style={[
            styles.mainCard,

            status ===
              'correct' &&
              styles.correctBox,

            status ===
              'wrong' &&
              styles.wrongBox,
          ]}
        >

          {/* ITEM 1 */}
          <View style={styles.itemCard}>

            <Text style={styles.emoji}>
              {question.item1Emoji}
            </Text>

            <Text style={styles.itemText}>
              {question.item1Count}{' '}
              {question.item1Name}
            </Text>

            <View style={styles.priceTag}>

              <Text
                style={styles.priceText}
              >
                {formatRupiah(
                  question.item1Price *
                    question.item1Count
                )}
              </Text>

            </View>

          </View>

          {/* PLUS */}
          <View style={styles.plusCircle}>

            <Text style={styles.plusText}>
              +
            </Text>

          </View>

          {/* ITEM 2 */}
          <View
            style={[
              styles.itemCard,
              styles.itemCardOrange,
            ]}
          >

            <Text style={styles.emoji}>
              {question.item2Emoji}
            </Text>

            <Text style={styles.itemText}>
              {question.item2Count}{' '}
              {question.item2Name}
            </Text>

            <View
              style={[
                styles.priceTag,
                styles.questionTag,
              ]}
            >

              <Text
                style={styles.questionMark}
              >
                ?
              </Text>

            </View>

          </View>

        </Animated.View>

        {/* TOTAL */}
        <View style={styles.totalCard}>

          <Text style={styles.totalLabel}>
            🛒 TOTAL BELANJA
          </Text>

          <Text style={styles.totalText}>
            {formatRupiah(
              question.totalPrice
            )}
          </Text>

        </View>

        {/* OPTIONS */}
        <View
          style={styles.optionsContainer}
        >

          {question.options.map(
            (option, index) => {

              const isSelected =
                selected === option;

              const labels = [
                'A',
                'B',
                'C',
              ];

              return (

                <TouchableOpacity
                  key={option}
                  activeOpacity={0.85}
                  style={[
                    styles.optionCard,

                    isSelected &&
                      styles.selectedCard,

                    status ===
                      'correct' &&
                      isSelected &&
                      styles.correctCard,

                    status ===
                      'wrong' &&
                      isSelected &&
                      styles.wrongCard,
                  ]}
                  onPress={() =>
                    select(option)
                  }
                >

                  <View
                    style={[
                      styles.optionBadge,

                      status ===
                        'correct' &&
                        isSelected &&
                        styles.correctBadgeOption,

                      status ===
                        'wrong' &&
                        isSelected &&
                        styles.wrongBadgeOption,
                    ]}
                  >

                    <Text
                      style={
                        styles.optionBadgeText
                      }
                    >
                      {labels[index]}
                    </Text>

                  </View>

                  <Text
                    style={[
                      styles.optionText,

                      status ===
                        'correct' &&
                        isSelected &&
                        styles.correctOptionText,

                      status ===
                        'wrong' &&
                        isSelected &&
                        styles.wrongOptionText,
                    ]}
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

      </GameLayout>

      <ResultModal
        visible={showResult}
        gameTitle="Berapakah Aku"
        stars={earnedStars}
        xp={xp}
        coin={coin}

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

          router.push(
            '/siswa/tabs/leaderboard'
          );
        }}
      />
    </>
  );
}

const styles =
  StyleSheet.create({

    /*
      =========================
      QUESTION
      =========================
    */

    questionBox: {
      backgroundColor: '#FFFFFF',

      borderRadius: 22,

      paddingVertical: 14,

      paddingHorizontal: 16,

      marginTop: 10,

      alignItems: 'center',

      borderWidth: 2,

      borderColor: '#BFE3FF',

      shadowColor: '#5CBEFA',

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

    questionText: {
      fontSize: 18,

      fontWeight: '900',

      color: '#163B65',

      textAlign: 'center',
    },

    /*
      =========================
      MAIN CARD
      =========================
    */

    mainCard: {
      backgroundColor: '#FFFFFF',

      borderRadius: 24,

      marginTop: 14,

      padding: 14,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'space-between',

      borderWidth: 2,

      borderColor: '#BFE3FF',

      shadowColor: '#5CBEFA',

      shadowOpacity: 0.08,

      shadowRadius: 8,

      elevation: 3,
    },

    itemCard: {
      flex: 1,

      backgroundColor: '#EAF6FF',

      borderRadius: 20,

      paddingVertical: 14,

      paddingHorizontal: 8,

      alignItems: 'center',
    },

    /*
      ITEM YANG DICARI
    */

    itemCardOrange: {
      backgroundColor: '#FFF1E6',
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
      backgroundColor: '#CFEAFF',

      borderRadius: 12,

      paddingHorizontal: 10,

      paddingVertical: 5,

      marginTop: 8,
    },

    questionTag: {
      backgroundColor: '#FFD8B4',
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

    /*
      =========================
      PLUS
      =========================
    */

    plusCircle: {
      width: 44,

      height: 44,

      borderRadius: 999,

      backgroundColor: '#DDF2FF',

      justifyContent: 'center',

      alignItems: 'center',

      marginHorizontal: 8,
    },

    plusText: {
      fontSize: 24,

      fontWeight: '900',

      color: '#5CBEFA',
    },

    /*
      =========================
      TOTAL
      =========================
    */

    totalCard: {
      backgroundColor: '#FFFFFF',

      borderRadius: 22,

      marginTop: 14,

      paddingVertical: 14,

      alignItems: 'center',

      borderWidth: 2,

      borderColor: '#5CBEFA',

      shadowColor: '#5CBEFA',

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

    /*
      =========================
      OPTIONS
      =========================
    */

    optionsContainer: {
      flexDirection: 'row',

      gap: 8,

      marginTop: 16,

      marginBottom: 6,
    },

    optionCard: {
      flex: 1,

      backgroundColor: '#FFFFFF',

      borderRadius: 18,

      paddingVertical: 16,

      alignItems: 'center',

      justifyContent: 'center',

      shadowColor: '#5CBEFA',

      shadowOpacity: 0.06,

      shadowRadius: 4,

      elevation: 2,
    },

    optionBadge: {
      width: 34,

      height: 34,

      borderRadius: 999,

      backgroundColor: '#5CBEFA',

      justifyContent: 'center',

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

    /*
      =========================
      SELECTED
      =========================
    */

    selectedCard: {
      backgroundColor: '#DDF2FF',
    },

    /*
      =========================
      CORRECT
      =========================
    */

    correctCard: {
      backgroundColor: '#DCFCE7',

      transform: [
        {
          scale: 1.03,
        },
      ],

      shadowColor: '#22C55E',

      shadowOpacity: 0.15,

      shadowRadius: 8,

      elevation: 5,
    },

    correctBadgeOption: {
      backgroundColor: '#22C55E',
    },

    correctOptionText: {
      color: '#15803D',
    },

    correctBox: {
      backgroundColor: '#DCFCE7',

      borderColor: '#22C55E',
    },

    /*
      =========================
      WRONG
      =========================
    */

    wrongCard: {
      backgroundColor: '#FEE2E2',

      transform: [
        {
          scale: 1.03,
        },
      ],

      shadowColor: '#EF4444',

      shadowOpacity: 0.15,

      shadowRadius: 8,

      elevation: 5,
    },

    wrongBadgeOption: {
      backgroundColor: '#EF4444',
    },

    wrongOptionText: {
      color: '#B91C1C',
    },

    wrongBox: {
      backgroundColor: '#FEE2E2',

      borderColor: '#EF4444',
    },
  });