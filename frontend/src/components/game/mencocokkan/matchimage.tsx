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

interface Props {

  /*
    🔥 KEY WORD
  */
  word: string;

  image: string;

  /*
    🔥 ACTIVE
  */
  active?: boolean;

  /*
    🔥 POSISI DOT
  */
  setImagePosition: (
    word: string,
    pos: {
      x: number;
      y: number;
    }
  ) => void;

  disabled?: boolean;

  status?: StatusType;
}

export default function MatchImage({

  word,
  image,

  active = false,

  setImagePosition,

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
              🔥 SIMPAN POSISI GLOBAL
            */

            setImagePosition(
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

    <View style={styles.wrapper}>

      {/* 🔴 DOT */}
      <View

        ref={dotRef}

        collapsable={false}

        style={[
          styles.dot,

          disabled &&
            styles.dotDisabled,

          status === 'correct' &&
            styles.dotCorrect,

          status === 'wrong' &&
            styles.dotWrong,

          active &&
            styles.dotActive,
        ]}
      />

      {/* 🔵 CARD */}
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={disabled}
      >

        <View
          style={[
            styles.card,

            disabled &&
              styles.disabled,

            status === 'correct' &&
              styles.correct,

            status === 'wrong' &&
              styles.wrong,

            active &&
              styles.activeCard,
          ]}
        >

          <Text style={styles.emoji}>
            {image}
          </Text>

        </View>

      </TouchableOpacity>

    </View>
  );
}

const styles =
  StyleSheet.create({

    wrapper: {
      position: 'relative',

      marginVertical: 12,

      alignItems: 'center',
    },

    /*
      🔴 DOT
    */
    dot: {
      position: 'absolute',

      left: 8,

      top: '50%',

      marginTop: -8,

      width: 16,

      height: 16,

      borderRadius: 999,

      backgroundColor: '#5CBEFA',

      zIndex: 999,

      elevation: 999,

      borderWidth: 2,

      borderColor: '#FFFFFF',
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

    dotDisabled: {
      backgroundColor: '#CBD5E1',
    },

    dotCorrect: {
      backgroundColor: '#4CAF50',
    },

    dotWrong: {
      backgroundColor: '#FF4D4F',
    },

    /*
      🔵 CARD
    */
    card: {
      width: 70,

      height: 70,

      justifyContent: 'center',

      alignItems: 'center',

      borderRadius: 16,

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

    disabled: {
      backgroundColor: '#E5E7EB',

      borderColor: '#CBD5E1',
    },

    correct: {
      backgroundColor: '#C8E6C9',

      borderColor: '#4CAF50',
    },

    wrong: {
      backgroundColor: '#FFCDD2',

      borderColor: '#FF4D4F',
    },

    emoji: {
      fontSize: 36,
    },
  });