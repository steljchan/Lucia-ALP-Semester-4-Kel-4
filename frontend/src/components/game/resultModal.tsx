import React, { useEffect, useRef } from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, Animated, Easing,} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS} from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResultModal({
  visible,
  gameTitle = 'Mini Game',
  stars = 3,
  xp = 0,
  coin = 0,
  onRetry,
  onNext,
  onLeaderboard,
}: {
  visible: boolean;
  gameTitle?: string;
  stars?: number;
  xp?: number;
  coin?: number;
  onRetry: () => void;
  onNext: () => void;
  onLeaderboard: () => void;
}) {

  const cardScale = useRef(new Animated.Value(0)).current;
  const starScales = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const raysRotation = useRef(new Animated.Value(0)).current;
  const rewardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loopAnim: Animated.CompositeAnimation | null = null;

    if (!visible) {
        cardScale.setValue(0);
        starScales.forEach((s) => s.setValue(0));
        rewardOpacity.setValue(0);
        raysRotation.setValue(0);
        return;
    }

    Animated.spring(cardScale, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
    }).start();

    const starDelays = [300, 500, 400];
    starScales.forEach((scale, i) => {
        Animated.sequence([
        Animated.delay(starDelays[i]),
        Animated.spring(scale, {
            toValue: 1,
            tension: 80,
            friction: 5,
            useNativeDriver: true,
        }),
        ]).start();
    });

    floatingStars.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -8,
            duration: 1200 + i * 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(anim, {
            toValue: 0,
            duration: 1200 + i * 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    loopAnim = Animated.loop(
        Animated.timing(raysRotation, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
        })
    );

    loopAnim.start();

    Animated.sequence([
        Animated.delay(800),
        Animated.timing(rewardOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        }),
    ]).start();

  return () => {
    loopAnim?.stop(); 
  };
}, [visible]);

  const raysRotate = raysRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const starConfig = [
    { size: 44, index: 0, offsetY: 6, offsetX: 6 },
    { size: 58, index: 1, offsetY: 0, offsetX: 0 },
    { size: 44, index: 2, offsetY: 6, offsetX: -6 },
  ];

  const floatingStars = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.cardWrapper, { transform: [{ scale: cardScale }] }]}
        >
          <View style={styles.starsRow}>
            {starConfig.map(({ size, index, offsetY, offsetX }) => (
              <View
                key={index}
                style={[
                  styles.starOuter,
                  { marginBottom: -offsetY, zIndex: index === 1 ? 3 : 1 },
                ]}
              >
                  
                <Animated.Text
                  style={[
                    styles.starEmoji,
                    {
                      fontSize: size,
                      color: index < stars ? '#FFD700' : '#BDBDBD',

                      transform: [
                        { scale: starScales[index] },
                        { translateY: floatingStars[index] },
                      ],
                    },
                  ]}
                >
                  {index < stars ? '⭐' : '☆'}
                </Animated.Text>
              </View>
            ))}
          </View>

          <View style={styles.ribbonContainer}>
            <View style={styles.ribbonMain}>
              <Text style={styles.title}>COMPLETE</Text>
              <Text style={styles.gameTitle}>{gameTitle}</Text>
            </View>
          </View>

          <LinearGradient colors={[COLORS.white, '#f8fbff']} style={styles.body}>
            <Text style={styles.label}>SCORE</Text>
            <Text style={styles.score}>{xp}xp</Text>

            <View style={styles.divider} />

            <Animated.View style={{ opacity: rewardOpacity, width: '100%', alignItems: 'center' }}>
              <Text style={styles.label}>🎁 REWARD</Text>
              <View style={styles.rewardRow}>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>🪙</Text>
                  <Text style={styles.rewardNum}>{coin}</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>🧪</Text>
                  <Text style={styles.rewardNum}>{xp}</Text>
                </View>
              </View>
            </Animated.View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.btnOutline} onPress={onRetry} activeOpacity={0.8}>
                <Ionicons name="refresh" size={18} color={COLORS.primary} />
                <Text style={styles.btnOutlineText}> Ulang</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={styles.btnPrimary} onPress={onNext} activeOpacity={0.8}>
                <Text style={styles.btnPrimaryText}>Lanjut</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.leaderboardBtn} onPress={onLeaderboard} activeOpacity={0.8}>
              <Ionicons name="bar-chart" size={18} color={COLORS.yellow} />
              <Text style={styles.leaderboardText}>Leaderboard</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardWrapper: {
    width: 290,
    alignItems: 'center',
  },

  starsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 10,
    marginBottom: -12,
  },

  starOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  starEmoji: {
    lineHeight: undefined,
  },

  ribbonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: -20,
  },

  ribbonMain: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 20,
    zIndex: 3,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  title: {
    color: 'white',
    fontWeight: '900',
    fontSize: 20,
  },

  gameTitle: {
    color: COLORS.textMain,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  body: {
    backgroundColor: COLORS.white,
    width: '100%',
    borderRadius: BORDER_RADIUS.m,
    padding: 20,
    alignItems: 'center',
    elevation: 12,
    shadowColor: COLORS.yellow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  label: {
    color: COLORS.darkGray,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  score: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 2,
  },

  divider: {
    width: '90%',
    height: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.gray,
    borderWidth: 1,
    marginBottom: 10,
  },

  rewardRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 12,
  },

  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: COLORS.smoothBlue,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  rewardIcon: {
    fontSize: 22,
  },

  rewardNum: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textMain,
  },

  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    marginBottom: 10,
    width: '100%',
  },

  btnOutline: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flexDirection: 'row',        
    justifyContent: 'center',
    gap: 6,           
  },

  btnOutlineText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 14,
  },

  btnPrimary: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',   
    justifyContent: 'center',
    gap: 6,
  },

  btnPrimaryText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  },

  leaderboardBtn: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.yellow,
    backgroundColor: COLORS.white,
    paddingVertical: 9,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  leaderboardText: {
    color: COLORS.yellow,
    fontWeight: '800',
    fontSize: 13,
  },
});