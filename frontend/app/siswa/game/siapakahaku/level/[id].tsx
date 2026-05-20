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
} from 'expo-router';

import {
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  saveGameProgress,
}
from '../../../../../src/services/gameProgress';

import { siapakahAkuLevels } from '../../../../../src/data/siapakahaku';

import { siapakahAkuImages } from '../../../../../src/constants/siapakahAku';

import useSiapakahAku from '../../../../../src/hooks/usesiapakahaku';

import LetterBox from '../../../../../src/components/game/siapakahAku/LetterBox';

import GameLayout from '../../../../../src/components/game/layout/GameLayout';

import HintModal from '../../../../../src/components/game/common/hintModal';

import ResultModal from '../../../../../src/components/game/common/resultModal';

export default function GamePlay() {

  const { id } = useLocalSearchParams();

  const router = useRouter();

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

  const scaleAnim = useRef(
    new Animated.Value(1)
  ).current;

  const options = useMemo(() => {

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const answerLetters = question.answer.split('');

    const extra = alphabet
      .filter((l) => !answerLetters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return [...answerLetters, ...extra]
      .sort(() => Math.random() - 0.5);

  }, [question]);

  const splitIndex =
  options.length <= 5
    ? options.length
    : Math.floor(options.length / 2);

  const topRow = options.slice(0, splitIndex);

  const bottomRow = options.slice(splitIndex);

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

  const [showHint, setShowHint] = useState(false);

  const [hintStep, setHintStep] = useState(0);

  const [showResult, setShowResult] = useState(false);

  const [earnedStars, setEarnedStars] = useState(0);

  const [xp, setXp] = useState(0);

  const [coin, setCoin] = useState(0);

  const stars =
    selected.join('') === question.answer
      ? 3
      : 2;

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
        return `Semangat 😄`;
    }

  }, [hintStep, question.answer]);

  const onSubmit = () => {

  /*
    =========================
    VALIDATION
    =========================
  */

  if (!isFull)
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

    playAnimation(true);

  } else {

    playAnimation(false);
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

    const finalStars =
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
      finalStars
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
            'siapakahaku',

          /*
            LEVEL
          */

          levelId:
            level.id,

          /*
            REWARD
          */

          stars:
            finalStars,

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

  return (
    <>
      <GameLayout
        title="Siapakah Aku"
        level={level.id}
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
            text: 'Jawab',
            color: '#5CBEFA',
            onPress: onSubmit,
            disabled: !isFull,
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

        <Animated.View
          style={[
            styles.answerRow,
            {
              transform: [
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {question.answer
            .split('')
            .map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => remove(i)}
              >
                <LetterBox
                  letter={selected[i]}
                  status={status}
                />
              </TouchableOpacity>
            ))}
        </Animated.View>

        <View style={styles.optionsContainer}>

          <View style={styles.row}>
            {topRow.map((l, i) => {

              const index = i;

              const isUsed =
                usedIndexes.includes(index);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionBtn,
                    isUsed &&
                      styles.optionDisabled,
                  ]}
                  onPress={() =>
                    select(l, index)
                  }
                  disabled={isUsed}
                >
                  <Text style={styles.optionText}>
                    {l}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {bottomRow.length > 0 && (
            <View style={styles.row}>
              {bottomRow.map((l, i) => {

                const index = i + 4;

                const isUsed =
                  usedIndexes.includes(index);

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionBtn,
                      isUsed &&
                        styles.optionDisabled,
                    ]}
                    onPress={() =>
                      select(l, index)
                    }
                    disabled={isUsed}
                  >
                    <Text style={styles.optionText}>
                      {l}
                    </Text>
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

          setHintStep((prev) => {

            if (prev < 2) {
              return prev + 1;
            }

            return prev;
          });
        }}
      />

      <ResultModal
        visible={showResult}
        gameTitle="Siapakah Aku?"
        stars={earnedStars}
        xp={xp}
        coin={coin}

        onRetry={() => {

          setShowResult(false);

          reset();

          setQuestionIndex(0);
        }}

        onNext={() => {

          const next = levelIndex + 2;

          if (
            next <= siapakahAkuLevels.length
          ) {

            router.replace(
              `/siswa/game/siapakahaku/level/${next}`
            );

          } else {

            router.back();

          }
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

const styles = StyleSheet.create({

  title: {
    textAlign: 'center',

    fontSize: 24,

    fontWeight: '700',

    marginTop: 40,

    color: '#1A3B5D',
  },

  image: {
    width: 220,

    height: 220,

    alignSelf: 'center',

    marginVertical: 20,

    resizeMode: 'contain',
  },

  answerRow: {
    flexDirection: 'row',

    justifyContent: 'center',

    marginBottom: 25,
  },

  optionsContainer: {
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',

    justifyContent: 'center',

    gap: 10,

    marginBottom: 10,
  },

  optionBtn: {
    width: 55,

    height: 55,

    backgroundColor: '#ADDFFD',

    borderRadius: 12,

    justifyContent: 'center',

    alignItems: 'center',
  },

  optionDisabled: {
    backgroundColor: '#E5E7EB',
  },

  optionText: {
    fontSize: 20,

    fontWeight: '700',

    color: '#1A3B5D',
  },
});