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
  jumlahKamiLevels,
} from '../../../../../src/data/berapakahjumlahkami';

import {
  saveGameProgress,
}
from '../../../../../src/services/gameProgress';

import useBerapakahJumlahKami
from '../../../../../src/hooks/useBerapakahJumlahKami';

import GameLayout
from '../../../../../src/components/game/layout/GameLayout';

import ResultModal
from '../../../../../src/components/game/common/resultModal';

export default function JumlahKamiLevel() {

  const { id } =
    useLocalSearchParams();

  const router =
    useRouter();

  const levelIndex =
    Number(id) - 1;

  const level =
    jumlahKamiLevels[levelIndex];

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

  const question =
    level.questions[questionIndex];

  const {
    answer,
    status,
    addNumber,
    removeNumber,
    reset,
    check,
    isFilled,
  } = useBerapakahJumlahKami(
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

  /*
    =========================
    SUBMIT
    =========================
  */

  const onSubmit = () => {

  /*
    =========================
    VALIDATION
    =========================
  */

  if (!isFilled)
    return;

  /*
    =========================
    CHECK ANSWER
    =========================
  */

  const result =
    check();

  /*
    =========================
    ANIMATION
    =========================
  */

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

  }

  /*
    =========================
    FINISH LEVEL
    =========================
  */

  else {

    /*
      =========================
      REWARD
      =========================
    */

    const stars =
      result ? 3 : 1;

    const earnedXp =
      result ? 150 : 50;

    const earnedCoin =
      result ? 8 : 2;

    /*
      =========================
      SAVE STATE
      =========================
    */

    setEarnedStars(
      stars
    );

    setXp(
      earnedXp
    );

    setCoin(
      earnedCoin
    );

    /*
      =========================
      SAVE FIREBASE
      =========================
    */

    setTimeout(async () => {

      try {

        await saveGameProgress({

          /*
            GAME ID
          */

          gameId:
            'berapakahjumlahkami',

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
      jumlahKamiLevels.length
    ) {

      router.replace(
        `/siswa/game/berapakahjumlahkami/level/${next}`
      );

    } else {

      router.back();
    }
  };

  const keypad = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '0',
  ];

  return (
    <>
      <GameLayout
        title="Berapakah Jumlah Kami"
        level={level.id}

        actions={[
          {
            icon: '⌫',
            color: '#FF6B6B',
            onPress: removeNumber,
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
            styles.questionContainer,

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
              styles.correctContainer,

            status ===
              'wrong' &&
              styles.wrongContainer,
          ]}
        >

          {/* ITEM 1 */}
          <View style={styles.itemBox}>

            <Text style={styles.emoji}>
              {question.emoji1}
            </Text>

            <Text style={styles.count}>
              × {question.count1}
            </Text>

          </View>

          {/* PLUS */}
          <Text style={styles.plus}>
            +
          </Text>

          {/* ITEM 2 */}
          <View style={styles.itemBox}>

            <Text style={styles.emoji}>
              {question.emoji2}
            </Text>

            <Text style={styles.count}>
              × {question.count2}
            </Text>

          </View>

        </Animated.View>

        {/* ANSWER */}
        <Animated.View
          style={[
            styles.answerBox,

            status === 'correct' &&
              styles.correctAnswerBox,

            status === 'wrong' &&
              styles.wrongAnswerBox,

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
          ]}
        >

          <Text
            style={[
              styles.answerText,

              status === 'correct' &&
                styles.correctAnswerText,

              status === 'wrong' &&
                styles.wrongAnswerText,
            ]}
          >
            {answer || '?'}
          </Text>

        </Animated.View>

        {/* KEYPAD */}
        <View style={styles.keypad}>

          {keypad.map((n) => (

            <TouchableOpacity
              key={n}
              style={styles.keyBtn}
              onPress={() =>
                addNumber(n)
              }
            >

              <Text style={styles.keyText}>
                {n}
              </Text>

            </TouchableOpacity>
          ))}

        </View>

      </GameLayout>

      <ResultModal
        visible={showResult}
        gameTitle="Berapakah Jumlah Kami"
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

    questionContainer: {
      backgroundColor: '#fff',

      borderRadius: 28,

      paddingVertical: 24,

      paddingHorizontal: 18,

      marginTop: 30,

      flexDirection: 'row',

      justifyContent: 'center',

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

    /*
      =========================
      QUESTION ITEM
      =========================
    */

    itemBox: {
      alignItems: 'center',

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

    /*
      =========================
      ANSWER
      =========================
    */

    answerBox: {
        height: 70,

        backgroundColor: '#fff',

        borderRadius: 22,

        marginTop: 22,

        marginBottom: 24,

        justifyContent: 'center',

        alignItems: 'center',

        overflow: 'hidden',

        elevation: 2,

        shadowColor: '#000',

        shadowOpacity: 0.04,

        shadowRadius: 3,
        },

    correctAnswerBox: {
      backgroundColor: '#DCFCE7',

      borderWidth: 2,

      borderColor: '#22C55E',
    },

    wrongAnswerBox: {
      backgroundColor: '#FEE2E2',

      borderWidth: 2,

      borderColor: '#EF4444',
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

    /*
      =========================
      KEYPAD
      =========================
    */

    keypad: {
      flexDirection: 'row',

      flexWrap: 'wrap',

      justifyContent: 'center',

      gap: 12,

      paddingBottom: 20,
    },

    keyBtn: {
      width: 72,

      height: 72,

      backgroundColor: '#fff',

      borderRadius: 20,

      justifyContent: 'center',

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