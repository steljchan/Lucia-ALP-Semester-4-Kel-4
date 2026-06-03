import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';

import { COLORS } from '@/utils/theme';

const { width, height } =
  Dimensions.get('window');

const STATUSBAR =
  Platform.OS === 'android'
    ? StatusBar.currentHeight || 0
    : 44;

const mascots = {
  halo: require('../../../../../assets/images/ViboHalo.png'),

  tunjuk: require('../../../../../assets/images/ViboTunjuk.png'),

  buku: require('../../../../../assets/images/ViboBuku.png'),
};

export default function HomeTourGuide() {
  const [stepIndex, setStepIndex] =
    useState(0);

  // =========================
  // TOUR STEPS
  // =========================
  const steps = [
    // INTRO
    {
      type: 'intro',

      text:
        'Halo! Aku Vibo 👋\nAku akan menemanimu belajar di Lucia.',

      mascot: mascots.halo,

      highlight: null,
    },

    // SEARCH
    {
      type: 'search',

      text:
        'Cari pelajaran favoritmu lewat kolom pencarian ini 🔍',

      mascot: mascots.tunjuk,

      highlight: {
        x: 24,

        y: STATUSBAR + 95,

        width:
          width - 42,

        height: 52,
      },
    },

    // LAST SEEN
    {
      type: 'lastSeen',

      text:
        'Bagian ini menampilkan materi terakhir yang kamu buka 📖',

      mascot: mascots.tunjuk,

      highlight: {
        x: 22,

        y: STATUSBAR + 245,

        width:
          width - 42,

        height: 105,
      },
    },

    // SUBJECT
    {
      type: 'subject',

      text:
        'Tekan mata pelajaran untuk mulai belajar 📚',

      mascot: mascots.buku,

      highlight: {
        x: 24,

        y: STATUSBAR + 390,

        width:
          width / 2 - 36,

        height: 150,
      },
    },

    // NAVBAR INTRO
    {
      type: 'navbarIntro',

      text:
        'Di bagian bawah terdapat menu navigasi utama Lucia ✨',

      mascot: mascots.halo,

      highlight: null,
    },
  ];

  const currentStep =
    steps[stepIndex];

  if (
    !currentStep ||
    stepIndex === -1
  )
    return null;

  const nextStep = () => {
    if (
      stepIndex <
      steps.length - 1
    ) {
      setStepIndex(
        prev => prev + 1,
      );
    } else {
      setStepIndex(-1);
    }
  };

  const highlight =
    currentStep?.highlight ||
    null;

  const isIntro =
    currentStep.type ===
      'intro' ||
    currentStep.type ===
      'navbarIntro';

  // =========================
  // DIALOG POSITION
  // =========================
  let dialogStyle: any = {};

  if (isIntro) {
    dialogStyle = {
      top: height * 0.5,

      left: 20,

      right: 20,
    };
  }

  else if (
    currentStep.type ===
      'search' ||
    currentStep.type ===
      'lastSeen'
  ) {
    dialogStyle = {
      top:
        (highlight?.y || 0) +
        (highlight?.height || 0) +
        20,

      left: 20,

      right: 20,
    };
  }

  else if (
    currentStep.type ===
    'subject'
  ) {
    dialogStyle = {
      bottom:
        height -
        (highlight?.y || 0) +
        25,

      left: 20,

      right: 20,
    };
  }

  return (
    <View style={styles.overlay}>
      {/* BLOCK TOUCH */}
      <View
        style={styles.blockLayer}
      />

      {/* DARK LAYER */}
      <View
        style={styles.darkLayer}
      />

      {/* SKIP */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() =>
          setStepIndex(-1)
        }
      >
        <Text style={styles.skipText}>
          Lewati
        </Text>
      </TouchableOpacity>

      {/* HIGHLIGHT */}
      {highlight && (
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            {
              top:
                highlight.y,

              left:
                highlight.x,

              width:
                highlight.width,

              height:
                highlight.height,
            },
          ]}
        />
      )}

      {/* DIALOG */}
      <View
        style={[
          styles.dialog,
          dialogStyle,
        ]}
      >
        {/* MASCOT */}
        <Image
          source={
            currentStep.mascot
          }
          style={[
            styles.mascot,

            isIntro &&
              styles.mascotIntro,
          ]}
        />

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Lucia Guide
          </Text>

          <Text style={styles.text}>
            {currentStep.text}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={nextStep}
          >
            <Text
              style={
                styles.buttonText
              }
            >
              {stepIndex ===
              steps.length - 1
                ? 'Mulai'
                : 'Lanjut'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    // =====================
    // OVERLAY
    // =====================
    overlay: {
      ...StyleSheet.absoluteFillObject,

      zIndex: 999999999,
      elevation: 999999999,

      justifyContent:
        'flex-start',
    },

    // =====================
    // BLOCK TOUCH
    // =====================
    blockLayer: {
      ...StyleSheet.absoluteFillObject,

      zIndex: 5,
      elevation: 5,
    },

    // =====================
    // DARK BACKGROUND
    // =====================
    darkLayer: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        'rgba(0,0,0,0.45)',

      zIndex: 6,
    },

    // =====================
    // HIGHLIGHT
    // =====================
    highlight: {
      position: 'absolute',

      zIndex: 999999,

      borderWidth: 4,

      borderColor:
        '#FFE082',

      borderRadius: 24,

      backgroundColor:
        'rgba(255,224,130,0.18)',

      shadowColor:
        '#FFE082',

      shadowOpacity: 1,

      shadowRadius: 20,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 999999,
    },

    // =====================
    // DIALOG
    // =====================
    dialog: {
      position: 'absolute',

      zIndex: 9999999999,
      elevation: 9999999999,

      backgroundColor:
        '#FFFFFF',

      borderRadius: 28,

      paddingTop: 52,

      paddingBottom: 22,

      paddingHorizontal: 22,

      shadowColor: '#000',

      shadowOpacity: 0.15,

      shadowRadius: 16,

      shadowOffset: {
        width: 0,
        height: 5,
      },
    },

    // =====================
    // MASCOT
    // =====================
    mascot: {
      width: 95,
      height: 95,

      resizeMode:
        'contain',

      position: 'absolute',

      top: -38,

      alignSelf: 'center',

      zIndex: 9999999999,
    },

    mascotIntro: {
      width: 105,
      height: 105,

      top: -42,
    },

    // =====================
    // CONTENT
    // =====================
    content: {
      alignItems: 'center',
    },

    title: {
      fontSize: 18,

      fontWeight: '800',

      color: '#1E293B',

      marginBottom: 10,
    },

    text: {
      fontSize: 15,

      lineHeight: 24,

      textAlign: 'center',

      color: '#475569',

      fontWeight: '600',

      marginBottom: 20,
    },

    // =====================
    // BUTTON
    // =====================
    button: {
      backgroundColor:
        COLORS.primary,

      paddingHorizontal: 32,

      paddingVertical: 12,

      borderRadius: 999,

      minWidth: 130,

      alignItems: 'center',

      zIndex: 99999999999,
      elevation: 99999999999,
    },

    buttonText: {
      color: 'white',

      fontSize: 15,

      fontWeight: '700',
    },

    // =====================
    // SKIP
    // =====================
    skipButton: {
      position: 'absolute',

      top: STATUSBAR + 12,

      right: 18,

      backgroundColor:
        'rgba(255,255,255,0.96)',

      paddingHorizontal: 18,

      paddingVertical: 10,

      borderRadius: 999,

      zIndex: 99999999999,
      elevation: 99999999999,
    },

    skipText: {
      color:
        COLORS.primary,

      fontWeight: '700',

      fontSize: 14,
    },
  });