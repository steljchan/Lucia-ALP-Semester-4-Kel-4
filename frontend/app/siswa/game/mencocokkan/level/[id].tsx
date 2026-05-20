import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
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

const {
  width,
  height,
} = Dimensions.get(
  'window'
);

export default function MatchingGame() {

  const { id } =
    useLocalSearchParams();

  const router =
    useRouter();

  const levelIndex =
    Number(id) - 1;

  const level =
    mencocokkanLevels[
      levelIndex
    ];

  const {
    wordPositions,
    imagePositions,

    setWordPosition,
    setImagePosition,

    shuffledWords,
    shuffledImages,

    reset,
  } = useMencocokkan(
    level.pairs
  );

  /*
    =========================
    STATES
    =========================
  */

  const [
    connections,
    setConnections,
  ] = useState<any[]>(
    []
  );

  const [
    activeLine,
    setActiveLine,
  ] = useState<any>(
    null
  );

  const [
    submitted,
    setSubmitted,
  ] = useState(
    false
  );

  const [
    showHint,
    setShowHint,
  ] = useState(
    false
  );

  const [
    showResult,
    setShowResult,
  ] = useState(
    false
  );

  const [
    earnedStars,
    setEarnedStars,
  ] = useState(0);

  const [
    xp,
    setXp,
  ] = useState(0);

  const [
    coin,
    setCoin,
  ] = useState(0);

  /*
    =========================
    RESULT MAP
    =========================
  */

  const [
    resultMap,
    setResultMap,
  ] = useState<any>(
    {}
  );

  /*
    =========================
    ANIMATION
    =========================
  */

  const scaleAnim =
    useRef(
      new Animated.Value(
        1
      )
    ).current;

  /*
    =========================
    HINT
    =========================
  */

  const hintText =
    useMemo(() => {

      return 'Tarik garis dari kata ke gambar yang benar ✨';

    }, []);

  /*
    =========================
    START CONNECTION
    =========================
  */

  const startConnection =
    (
      word: string
    ) => {

      const from =
        wordPositions[
          word
        ];

      if (!from)
        return;

      setActiveLine({
        word,

        startX:
          from.x,

        startY:
          from.y,

        endX:
          from.x,

        endY:
          from.y,
      });
    };

  /*
    =========================
    FIND CLOSEST IMAGE
    =========================
  */

  const findClosestImage =
    (
      x: number,
      y: number
    ) => {

      let closest:
        | string
        | null =
        null;

      let minDistance =
        Infinity;

      Object.entries(
        imagePositions
      ).forEach(
        (
          [
            key,
            pos,
          ]: any
        ) => {

          const distance =
            Math.sqrt(
              Math.pow(
                x -
                  pos.x,
                2
              ) +
              Math.pow(
                y -
                  pos.y,
                2
              )
            );

          /*
            SNAP RANGE
          */

          if (
            distance <
              100 &&
            distance <
              minDistance
          ) {

            minDistance =
              distance;

            closest =
              key;
          }
        }
      );

      return closest;
    };

  /*
    =========================
    PAN RESPONDER
    =========================
  */

  const panResponder =
    useRef(
      PanResponder.create({

        onStartShouldSetPanResponder:
          () => true,

        onMoveShouldSetPanResponder:
          () =>
            !!true,

        onMoveShouldSetPanResponderCapture:
          () =>
            !!true,

        /*
          =====================
          MOVE
          =====================
        */

        onPanResponderMove:
          (
            evt
          ) => {

            if (
              !activeLine
            )
              return;

            const moveX =
              evt
                .nativeEvent
                .pageX;

            const moveY =
              evt
                .nativeEvent
                .pageY;

            /*
              SNAP
            */

            const closestImage =
              findClosestImage(
                moveX,
                moveY
              );

            if (
              closestImage
            ) {

              const target =
                imagePositions[
                  closestImage
                ];
              console.log(moveX, moveY);
              setActiveLine(
                (
                  prev: any
                ) => ({
                  ...prev,

                  endX:
                    target.x,

                  endY:
                    target.y,
                })
              );

            } else {

              setActiveLine(
                (
                  prev: any
                ) => ({
                  ...prev,

                  endX:
                    moveX,

                  endY:
                    moveY,
                })
              );
            }
          },

        /*
          =====================
          RELEASE
          =====================
        */

        onPanResponderRelease:
          (
            evt
          ) => {

            if (
              !activeLine
            )
              return;

            const releaseX =
              evt
                .nativeEvent
                .pageX;

            const releaseY =
              evt
                .nativeEvent
                .pageY;

            const matchedImage =
              findClosestImage(
                releaseX,
                releaseY
              );

            /*
              SAVE
            */

            if (
              matchedImage
            ) {

              setConnections(
                (
                  prev
                ) => {

                  /*
                    HAPUS DUPLIKAT
                  */

                  const filtered =
                    prev.filter(
                      (
                        c
                      ) =>
                        c.word !==
                          activeLine.word &&
                        c.image !==
                          matchedImage
                    );

                  return [
                    ...filtered,

                    {
                      word:
                        activeLine.word,

                      image:
                        matchedImage,
                    },
                  ];
                }
              );
            }

            /*
              RESET
            */

            setActiveLine(
              null
            );
          },

        onPanResponderTerminate:
          () => {

            setActiveLine(
              null
            );
          },
      })
    ).current;

  /*
    =========================
    SUBMIT
    =========================
  */

  const onSubmit =
    () => {

      let correct = 0;

      const results:
        any = {};

      connections.forEach(
        (
          c
        ) => {

          /*
            🔥 BENAR
          */

          if (
            c.word ===
            c.image
          ) {

            results[
              c.word
            ] =
              'correct';

            correct++;

          } else {

            results[
              c.word
            ] =
              'wrong';
          }
        }
      );

      setResultMap(
        results
      );

      setSubmitted(
        true
      );

      Animated.sequence([
        Animated.timing(
          scaleAnim,
          {
            toValue:
              1.04,

            duration: 120,

            useNativeDriver:
              true,
          }
        ),

        Animated.timing(
          scaleAnim,
          {
            toValue:
              1,

            duration: 120,

            useNativeDriver:
              true,
          }
        ),
      ]).start();

      const allCorrect =
        correct ===
        level.pairs.length;

      if (
        allCorrect
      ) {

        setEarnedStars(
          3
        );

        setXp(150);

        setCoin(10);

      } else {

        setEarnedStars(
          1
        );

        setXp(50);

        setCoin(2);
      }

      setTimeout(() => {

        setShowResult(
          true
        );

      }, 500);
    };

  /*
    =========================
    NEXT LEVEL
    =========================
  */

  const goNextLevel =
    () => {

      const next =
        levelIndex +
        2;

      if (
        next <=
        mencocokkanLevels.length
      ) {

        router.replace(
          `/siswa/game/mencocokkan/level/${next}`
        );

      } else {

        router.back();
      }
    };

  return (
    <>

      <GameLayout
        title="Mencocokkan"

        level={
          level.id
        }

        actions={[
          {
            icon: '💡',

            color:
              '#FFD700',

            onPress:
              () =>
                setShowHint(
                  true
                ),
          },

          {
            icon: '↺',

            color:
              '#FF6B6B',

            onPress:
              () => {

                reset();

                setConnections(
                  []
                );

                setSubmitted(
                  false
                );

                setResultMap(
                  {}
                );

                setActiveLine(
                  null
                );
              },
          },

          {
            text: 'Jawab',

            color:
              '#5CBEFA',

            onPress:
              onSubmit,

            flex: 1,
          },
        ]}
      >

        {/* TITLE */}
        <Text
          style={
            styles.title
          }
        >
          Pilih Pasangannya
        </Text>

        {/* GAME */}
        <View
          style={
            styles.mapContainer
          }

          {...panResponder.panHandlers}
        >

          {/* SVG */}
          <Svg
            pointerEvents="none"

            width={width}
            height={height}

            style={[
              StyleSheet.absoluteFillObject,

              {
                zIndex:
                  9999,

                elevation:
                  9999,
              },
            ]}
          >

            {/* CONNECTIONS */}
            {connections.map(
              (
                c,
                i
              ) => {

                const from =
                  wordPositions[
                    c.word
                  ];

                const to =
                  imagePositions[
                    c.image
                  ];

                if (
                  !from ||
                  !to
                )
                  return null;

                const status =
                  resultMap[
                    c.word
                  ];

                const color =
                  submitted
                    ? status ===
                      'correct'
                      ? '#22C55E'
                      : '#EF4444'
                    : '#5CBEFA';

                return (

                  <React.Fragment
                    key={i}
                  >

                    {/* GLOW */}
                    <Line
                      x1={
                        from.x
                      }

                      y1={
                        from.y
                      }

                      x2={
                        to.x
                      }

                      y2={
                        to.y
                      }

                      stroke={
                        color
                      }

                      strokeWidth={
                        18
                      }

                      strokeOpacity={
                        0.22
                      }

                      strokeLinecap="round"
                    />

                    {/* MAIN */}
                    <Line
                      x1={
                        from.x
                      }

                      y1={
                        from.y
                      }

                      x2={
                        to.x
                      }

                      y2={
                        to.y
                      }

                      stroke={
                        color
                      }

                      strokeWidth={
                        8
                      }

                      strokeOpacity={
                        1
                      }

                      strokeLinecap="round"

                      strokeLinejoin="round"
                    />

                  </React.Fragment>
                );
              }
            )}

            {/* ACTIVE LINE */}
            {activeLine && (

              <>

                {/* GLOW */}
                <Line
                  x1={
                    activeLine.startX
                  }

                  y1={
                    activeLine.startY
                  }

                  x2={
                    activeLine.endX
                  }

                  y2={
                    activeLine.endY
                  }

                  stroke="#5CBEFA"

                  strokeWidth={
                    22
                  }

                  strokeOpacity={
                    0.25
                  }

                  strokeLinecap="round"
                />

                {/* MAIN */}
                <Line
                  x1={
                    activeLine.startX
                  }

                  y1={
                    activeLine.startY
                  }

                  x2={
                    activeLine.endX
                  }

                  y2={
                    activeLine.endY
                  }

                  stroke="#5CBEFA"

                  strokeWidth={
                    8
                  }

                  strokeOpacity={
                    1
                  }

                  strokeLinecap="round"

                  strokeLinejoin="round"
                />

                {/* DOT */}
                <Circle
                  cx={
                    activeLine.endX
                  }

                  cy={
                    activeLine.endY
                  }

                  r={10}

                  fill="#5CBEFA"
                />

              </>
            )}

          </Svg>

          {/* CONTENT */}
          <Animated.View
            style={[
              styles.row,
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

            {/* WORDS */}
            <View
              style={
                styles.column
              }
            >

              {shuffledWords.map(
                (
                  p: any
                ) => (

                  <MatchWord
                    key={
                      p.word
                    }

                    word={
                      p.word
                    }

                    onDragStart={
                      startConnection
                    }

                    setWordPosition={
                      setWordPosition
                    }

                    active={
                      activeLine?.word ===
                      p.word
                    }

                    status={
                      submitted
                        ? resultMap[
                            p.word
                          ]
                        : undefined
                    }
                  />
                )
              )}

            </View>

            {/* IMAGES */}
            <View
              style={
                styles.column
              }
            >

              {shuffledImages.map(
                (
                  p: any
                ) => (

                  <MatchImage
                    key={
                      p.word
                    }

                    word={
                      p.word
                    }

                    image={
                      p.image
                    }

                    setImagePosition={
                      setImagePosition
                    }

                    active={
                      activeLine?.word ===
                      p.word
                    }

                    status={
                      submitted
                        ? resultMap[
                            p.word
                          ]
                        : undefined
                    }
                  />
                )
              )}

            </View>

          </Animated.View>

        </View>

      </GameLayout>

      {/* HINT */}
      <HintModal
        visible={
          showHint
        }

        hintText={
          hintText
        }

        onClose={() =>
          setShowHint(
            false
          )
        }
      />

      {/* RESULT */}
      <ResultModal
        visible={
          showResult
        }

        gameTitle="Mencocokkan"

        stars={
          earnedStars
        }

        xp={xp}

        coin={coin}

        onRetry={() => {

          setShowResult(
            false
          );

          reset();

          setConnections(
            []
          );

          setSubmitted(
            false
          );

          setResultMap(
            {}
          );

          setActiveLine(
            null
          );
        }}

        onNext={() => {

          setShowResult(
            false
          );

          goNextLevel();
        }}

        onLeaderboard={() => {

          setShowResult(
            false
          );

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

    title: {
      textAlign:
        'center',

      fontSize: 22,

      fontWeight:
        '700',

      color:
        '#1A3B5D',

      marginTop: 8,

      marginBottom: 26,
    },

    mapContainer: {
      flex: 1,

      minHeight: 650,

      justifyContent:
        'flex-start',

      overflow:
        'visible',
    },

    row: {
      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'flex-start',

      gap: 30,
    },

    column: {
      width: 145,
    },
  });