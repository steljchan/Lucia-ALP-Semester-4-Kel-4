import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

import {
  useEffect,
  useRef,
} from 'react';

type StatusType =
  | 'correct'
  | 'wrong'
  | undefined;

type Props = {
  word: string;

  /*
    🔥 START DRAG
  */
  onDragStart: (
    word: string
  ) => void;

  /*
    🔥 POSISI DOT
  */
  setWordPosition: (
    word: string,
    pos: {
      x: number;
      y: number;
    }
  ) => void;

  /*
    🔥 ACTIVE
  */
  active?: boolean;

  disabled?: boolean;

  status?: StatusType;
};

export default function MatchWord({

  word,
  onDragStart,

  setWordPosition,

  active = false,

  disabled = false,

  status,

}: Props) {

  /*
    =========================
    REF
    =========================
  */

  const dotRef =
    useRef<View>(null);

  /*
    =========================
    GET GLOBAL POSITION
    =========================
  */

  useEffect(() => {

    const timeout =
      setTimeout(() => {

        dotRef.current?.measureInWindow(
          (
            x,
            y,
            width,
            height
          ) => {

            /*
              🔥 GLOBAL POSITION
            */

            setWordPosition(
              word,
              {
                x:
                  x +
                  width / 2,

                y:
                  y +
                  height / 2,
              }
            );
          }
        );

      }, 300);

    return () =>
      clearTimeout(
        timeout
      );

  }, []);

  return (

    <View
      style={styles.wrapper}
    >

      {/* 🔵 CARD */}
      <TouchableOpacity

        activeOpacity={0.8}

        disabled={disabled}

        /*
          🔥 START DRAG
        */
        onPressIn={() => {

          if (disabled)
            return;

          onDragStart(
            word
          );
        }}
      >

        <View
          style={[

            styles.card,

            disabled &&
              styles.disabled,

            status ===
              'correct' &&
              styles.correct,

            status ===
              'wrong' &&
              styles.wrong,

            active &&
              styles.activeCard,
          ]}
        >

          <Text style={styles.text}>
            {word}
          </Text>

        </View>

      </TouchableOpacity>

      {/* 🔴 DOT */}
      <View

        ref={dotRef}

        collapsable={false}

        style={[

          styles.dot,

          disabled &&
            styles.dotDisabled,

          status ===
            'correct' &&
            styles.dotCorrect,

          status ===
            'wrong' &&
            styles.dotWrong,

          active &&
            styles.dotActive,
        ]}
      />

    </View>
  );
}

const styles =
  StyleSheet.create({

    /*
      =========================
      WRAPPER
      =========================
    */

    wrapper: {
      position: 'relative',

      marginVertical: 12,

      alignItems: 'center',
    },

    /*
      =========================
      CARD
      =========================
    */

    card: {
      height: 60,

      width: 120,

      justifyContent: 'center',

      alignItems: 'center',

      borderRadius: 14,

      borderWidth: 1.5,

      borderColor: '#5CBEFA',

      backgroundColor: '#FFFFFF',

      shadowColor: '#5CBEFA',

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.15,

      shadowRadius: 6,

      elevation: 3,
    },

    /*
      🔥 ACTIVE CARD
    */

    activeCard: {
      borderColor: '#2563EB',

      borderWidth: 3,

      backgroundColor: '#DBEAFE',

      transform: [
        {
          scale: 1.05,
        },
      ],

      shadowOpacity: 0.35,

      elevation: 6,
    },

    /*
      🔥 DISABLED
    */

    disabled: {
      backgroundColor: '#E5E7EB',

      borderColor: '#CBD5E1',
    },

    /*
      🔥 CORRECT
    */

    correct: {
      backgroundColor: '#C8E6C9',

      borderColor: '#4CAF50',
    },

    /*
      🔥 WRONG
    */

    wrong: {
      backgroundColor: '#FFCDD2',

      borderColor: '#FF4D4F',
    },

    /*
      =========================
      TEXT
      =========================
    */

    text: {
      fontWeight: '700',

      fontSize: 14,

      color: '#1A3B5D',
    },

    /*
      =========================
      DOT
      =========================
    */

    dot: {
      position: 'absolute',

      right: -8,

      top: '50%',

      marginTop: -8,

      width: 16,

      height: 16,

      borderRadius: 999,

      backgroundColor: '#5CBEFA',

      borderWidth: 2,

      borderColor: '#FFFFFF',

      zIndex: 999,

      elevation: 999,
    },

    /*
      🔥 ACTIVE DOT
    */

    dotActive: {
      backgroundColor: '#2563EB',

      transform: [
        {
          scale: 1.35,
        },
      ],
    },

    /*
      🔥 DISABLED DOT
    */

    dotDisabled: {
      backgroundColor: '#CBD5E1',
    },

    /*
      🔥 CORRECT DOT
    */

    dotCorrect: {
      backgroundColor: '#4CAF50',
    },

    /*
      🔥 WRONG DOT
    */

    dotWrong: {
      backgroundColor: '#FF4D4F',
    },
  });