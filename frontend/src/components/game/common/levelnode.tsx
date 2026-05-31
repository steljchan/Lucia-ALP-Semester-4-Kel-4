import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

type Props = {
  level: number;

  unlocked: boolean;

  disabled?: boolean;

  current?: boolean;

  played?: boolean;

  stars?: number;

  onPress: () => void;
};

export default function LevelNode({
  level,

  unlocked,

  disabled = false,

  current = false,

  played = false,

  stars = 0,

  onPress,
}: Props) {

  /*
    =========================
    STARS
    =========================
  */

  const renderStars = () => {

    /*
      LOCKED LEVEL
    */

    if (!unlocked)
      return null;

    return (
      <View style={styles.starRow}>

        {[1, 2, 3].map(
          (i) => {

            const earned =
              i <= stars;

            return (
              <Text
                key={i}
                style={
                  earned
                    ? styles.starFilled
                    : styles.starEmpty
                }
              >
                {earned
                  ? '⭐'
                  : '☆'}
              </Text>
            );
          }
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}

      disabled={!unlocked}

      activeOpacity={0.85}

      style={[
        styles.circle,

        unlocked
          ? styles.unlocked
          : styles.locked,

        current &&
          styles.currentNode,

        disabled &&
          styles.disabledNode,
      ]}
    >

      {/* CURRENT BADGE */}
      {current && (
        <View
          style={
            styles.currentIcon
          }
        >
          <Ionicons
            name="flash"
            size={12}
            color="#fff"
          />
        </View>
      )}

      {/* CONTENT */}
      <View
        style={[
          styles.content,

          !unlocked &&
            styles.lockedContent,
        ]}
      >

        {/* LEVEL */}
        <Text
          style={[
            styles.level,

            !unlocked &&
              styles.levelLocked,

            played &&
              styles.levelPlayed,

            disabled &&
              styles.levelDisabled,
          ]}
        >
          {level}
        </Text>

        {/* STARS */}
        {renderStars()}
      </View>

      {/* LOCK ICON */}
      {!unlocked && (
        <Ionicons
          name="lock-closed"
          size={14}
          color="#8C8C8C"
          style={
            styles.lockIcon
          }
        />
      )}

      {/* HEART EMPTY OVERLAY */}
      {disabled &&
        unlocked && (
          <View
            style={
              styles.heartOverlay
            }
          >
            <Ionicons
              name="heart-dislike"
              size={18}
              color="#fff"
            />
          </View>
        )}
    </TouchableOpacity>
  );
}

const styles =
  StyleSheet.create({
    circle: {
      width: 80,
      height: 80,

      borderRadius: 40,

      justifyContent:
        'center',

      alignItems: 'center',

      elevation: 6,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.15,

      shadowRadius: 5,

      position: 'relative',
    },

    unlocked: {
      backgroundColor:
        '#FFFFFF',

      borderWidth: 3,

      borderColor:
        '#5CBEFA',
    },

    locked: {
      backgroundColor:
        '#DADADA',

      borderWidth: 3,

      borderColor:
        '#C5C5C5',

      opacity: 0.85,
    },

    disabledNode: {
      backgroundColor: '#E2E2E2',
      borderColor: '#BDBDBD',
    },

    currentNode: {
      shadowColor:
        '#5CBEFA',

      shadowOpacity: 0.45,

      shadowRadius: 15,

      elevation: 12,

      transform: [
        {
          scale: 1.06,
        },
      ],
    },

    content: {
      alignItems: 'center',

      justifyContent:
        'center',

      marginTop: 2,
    },

    lockedContent: {
      transform: [
        {
          translateY: -6,
        },
      ],
    },

    level: {
      fontSize: 24,

      fontWeight: '800',

      color: '#1A3B5D',

      lineHeight: 28,
    },

    levelPlayed: {
      color: '#0B5CAD',
    },

    levelLocked: {
      color: '#8C8C8C',
    },

    levelDisabled: {
      color: '#9A9A9A',
    },

    starRow: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'center',

      marginTop: 1,
    },

    starFilled: {
      fontSize: 11,

      marginHorizontal: 1,

      color: '#FFD700',

      lineHeight: 14,
    },

    starEmpty: {
      fontSize: 14,

      marginHorizontal: 0.5,

      color: '#D6D6D6',

      lineHeight: 14,

      fontWeight: '600',
    },

    lockIcon: {
      position: 'absolute',

      bottom: 12,
    },

    currentIcon: {
      position: 'absolute',

      top: -8,

      backgroundColor:
        '#5CBEFA',

      width: 22,
      height: 22,

      borderRadius: 11,

      justifyContent:
        'center',

      alignItems: 'center',

      borderWidth: 2,

      borderColor: '#fff',
    },

    heartOverlay: {
      position: 'absolute',

      top: -6,
      right: -4,

      width: 24,
      height: 24,

      borderRadius: 12,

      backgroundColor:
        '#FF5A5F',

      justifyContent:
        'center',

      alignItems: 'center',

      borderWidth: 2,

      borderColor: '#fff',

      elevation: 5,
    },
  });