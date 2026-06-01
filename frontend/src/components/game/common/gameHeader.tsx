import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useRouter,
} from 'expo-router';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  useEffect,
  useState,
} from 'react';

import {
  getNextHeartSeconds,
  refreshHeart,
} from '@/src/services/heartRegen';

type GameHeaderProps = {
  title?: string;

  level?: number;

  heart?: number;

  coin?: number;

  image?: any;
};

const MAX_HEART = 3;

export default function GameHeader({
  title = 'Game',
  level = 1,
  heart = 3,
  coin = 0,
  image,
}: GameHeaderProps) {

  const router =
    useRouter();

  const [
    nextHeartSeconds,
    setNextHeartSeconds,
  ] = useState(0);

  /*
    =========================
    INIT TIMER
    =========================
  */

  useEffect(() => {

    let mounted = true;

    const initTimer =
      async () => {

        if (
          heart >=
          MAX_HEART
        ) {

          setNextHeartSeconds(
            0
          );

          return;
        }

        try {

          // sync heart dulu
          await refreshHeart();

          const seconds =
            await getNextHeartSeconds();

          if (mounted) {

            setNextHeartSeconds(
              seconds
            );
          }

        } catch (error) {

          console.log(
            'INIT HEART TIMER ERROR:',
            error
          );
        }
      };

    initTimer();

    return () => {

      mounted = false;
    };

  }, [heart]);

  /*
    =========================
    LOCAL COUNTDOWN
    =========================
  */

  useEffect(() => {

    if (
      heart >=
      MAX_HEART
    ) {

      return;
    }

    const interval =
      setInterval(
        async () => {

          setNextHeartSeconds(
            (prev) => {

              /*
                TIMER HABIS
              */

              if (
                prev <= 1
              ) {

                return 0;
              }

              return prev - 1;
            }
          );

        },

        1000
      );

    return () => {

      clearInterval(
        interval
      );
    };

  }, [heart]);

  /*
    =========================
    REFRESH SAAT TIMER HABIS
    =========================
  */

  useEffect(() => {

    if (
      heart >=
      MAX_HEART
    ) {

      return;
    }

    if (
      nextHeartSeconds !== 0
    ) {

      return;
    }

    const handleRegen =
      async () => {

        try {

          await refreshHeart();

          const seconds =
            await getNextHeartSeconds();

          setNextHeartSeconds(
            seconds
          );

        } catch (error) {

          console.log(
            'HEART REGEN ERROR:',
            error
          );
        }
      };

    handleRegen();

  }, [
    nextHeartSeconds,
    heart,
  ]);

  /*
    =========================
    FORMAT TIMER
    =========================
  */

  const formatTime = (
    totalSeconds: number
  ) => {

    if (
      totalSeconds <= 0
    ) {

      return '';
    }

    const mins =
      Math.floor(
        totalSeconds / 60
      );

    const secs =
      totalSeconds % 60;

    return `${mins
      .toString()
      .padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={[
        '#FFFFFF',
        '#DDF3FF',
        '#ADDFFD',
      ]}
      locations={[
        0,
        0.4,
        1,
      ]}
      start={{
        x: 0,
        y: 0,
      }}
      end={{
        x: 0,
        y: 1,
      }}
      style={styles.container}
    >

      {/* BACK */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() =>
          router.back()
        }
      >
        <Ionicons
          name="chevron-back"
          size={26}
          color="#1A3B5D"
        />
      </TouchableOpacity>

      {/* GAME CARD */}
      <View style={styles.card}>

        <Image
          source={image}
          style={styles.icon}
        />

        <View
          style={
            styles.textWrapper
          }
        >
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>

          <Text
            style={styles.level}
          >
            Level {level}
          </Text>
        </View>
      </View>

      {/* BALANCE */}
      <View
        style={
          styles.balanceWrapper
        }
      >

        {/* HEART */}
        <View
          style={
            styles.balanceItem
          }
        >
          <Ionicons
            name="heart"
            size={14}
            color="#FF4D4F"
          />

          <Text
            style={
              styles.balanceText
            }
          >
            {heart}
          </Text>

          {heart <
            MAX_HEART &&
            nextHeartSeconds >
              0 && (
              <Text
                style={
                  styles.timerText
                }
              >
                {formatTime(
                  nextHeartSeconds
                )}
              </Text>
            )}
        </View>

        {/* COIN */}
        <View
          style={
            styles.balanceItem
          }
        >
          <Text
            style={
              styles.coinIcon
            }
          >
            🪙
          </Text>

          <Text
            style={
              styles.balanceText
            }
          >
            {coin}
          </Text>
        </View>

      </View>
    </LinearGradient>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flexDirection:
        'row',

      alignItems:
        'center',

      paddingHorizontal: 12,

      paddingTop: 55,

      paddingBottom: 14,

      shadowColor:
        '#5CBEFA',

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.1,

      shadowRadius: 10,

      elevation: 5,
    },

    backBtn: {
      padding: 4,
    },

    card: {
      flex: 1,

      flexDirection:
        'row',

      alignItems:
        'center',

      marginLeft: 6,

      marginRight: 8,

      backgroundColor:
        '#fff',

      paddingHorizontal: 10,

      paddingVertical: 6,

      borderRadius: 14,

      borderWidth: 1,

      borderColor:
        '#5CBEFA',

      elevation: 3,
    },

    icon: {
      width: 28,
      height: 28,

      marginRight: 6,

      borderRadius: 6,
    },

    textWrapper: {
      flex: 1,

      justifyContent:
        'center',
    },

    title: {
      fontSize: 12,

      fontWeight: '600',

      color: '#1A3B5D',
    },

    level: {
      fontSize: 10,

      color: '#666',
    },

    balanceWrapper: {
      flexDirection:
        'row',

      alignItems:
        'center',

      gap: 6,
    },

    balanceItem: {
      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#fff',

      paddingHorizontal: 6,

      paddingVertical: 4,

      borderRadius: 16,

      elevation: 2,
    },

    balanceText: {
      marginLeft: 3,

      fontWeight: '600',

      fontSize: 12,

      color: '#1A3B5D',
    },

    coinIcon: {
      fontSize: 12,
    },

    timerText: {
      marginLeft: 4,

      fontSize: 9,

      fontWeight: '500',

      color: '#F59E0B',

      backgroundColor:
        '#FEF3C7',

      paddingHorizontal: 4,

      paddingVertical: 2,

      borderRadius: 10,

      overflow: 'hidden',
    },
  });