import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import Svg, { Line } from 'react-native-svg';

import { mencocokkanLevels } from '../../../../../src/data/mencocokkan';
import useMencocokkan from '../../../../../src/hooks/useMencocokkan';

import MatchWord from '../../../../../src/components/game/matchword';
import MatchImage from '../../../../../src/components/game/matchimage';
import GameHeader from '../../../../../src/components/game/gameHeader';

export default function MatchingGame() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const levelIndex = Number(id) - 1;
  const level = mencocokkanLevels[levelIndex];

  const {
    selectedWord,
    selectWord,
    selectImage,
    resultMap,
    reset,
    checkAll,
    wordPositions,
    imagePositions,
    setWordPosition,
    setImagePosition,
    shuffledWords,
    shuffledImages,
  } = useMencocokkan(level.pairs);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [connections, setConnections] = useState<
    { word: string; image: string }[]
  >([]);

  const [submitted, setSubmitted] = useState(false);

  /* =========================
     🔥 CONNECT LOGIC
  ========================= */
  const handleSelectImage = (imageWord: string) => {
    if (!selectedWord) return;

    setConnections((prev) => {
      const filtered = prev.filter(
        (c) => c.word !== selectedWord && c.image !== imageWord
      );

      return [...filtered, { word: selectedWord, image: imageWord }];
    });

    selectImage(imageWord);
  };

  /* =========================
     🔥 ANIMATION
  ========================= */
  const playAnimation = (correct: boolean) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (correct) {
      setTimeout(() => {
        const next = levelIndex + 2;
        if (next <= mencocokkanLevels.length) {
          router.replace(`/siswa/game/mencocokkan/level/${next}`);
        }
      }, 800);
    } else {
      setTimeout(() => {
        reset();
        setConnections([]);
        setSubmitted(false);
      }, 800);
    }
  };

  const onSubmit = () => {
    const result = checkAll();
    setSubmitted(true);
    playAnimation(result);
  };

  return (
    <View style={styles.container}>
      <GameHeader title="Mencocokkan" level={level.id} hearts={3} />

      <Text style={styles.title}>Pilih Pasangannya</Text>

      <View style={styles.mapContainer}>
        {/* 🔥 GARIS */}
        <Svg style={StyleSheet.absoluteFill}>
          {connections.map((c, i) => {
            const from = wordPositions[c.word];
            const to = imagePositions[c.image];

            if (!from || !to) return null;

            const status = resultMap[c.word];

            return (
              <Line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={
                  submitted
                    ? status === 'correct'
                      ? '#4CAF50'
                      : '#FF4D4F'
                    : '#5CBEFA'
                }
                strokeWidth={4}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>

        {/* 🔥 CARD */}
        <Animated.View
          style={[
            styles.row,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* WORD */}
          <View style={styles.column}>
            {shuffledWords.map((p: any) => (
              <MatchWord
                key={p.word}
                word={p.word}
                onPress={selectWord}
                setWordPosition={setWordPosition}
                status={submitted ? resultMap[p.word] : undefined}
              />
            ))}
          </View>

          {/* IMAGE */}
          <View style={[styles.column, { marginTop: -12 }]}>
            {shuffledImages.map((p: any) => (
              <MatchImage
                key={p.word}
                item={p}
                onPress={handleSelectImage}
                setImagePosition={setImagePosition}
                status={submitted ? resultMap[p.word] : undefined}
              />
            ))}
          </View>
        </Animated.View>
      </View>

      {/* BUTTON */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.hintBtn}>
          <Text style={styles.hintIcon}>💡</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => {
            reset();
            setConnections([]);
            setSubmitted(false);
          }}
        >
          <Text style={styles.deleteText}>↺</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submit} onPress={onSubmit}>
          <Text style={styles.submitText}>Jawab</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF6FF',
  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 40,
    marginBottom: 20,
    color: '#1A3B5D',
  },

  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  correct: {
    textAlign: 'center',
    color: '#4CAF50',
    marginTop: 15,
    fontWeight: '700',
  },

  wrong: {
    textAlign: 'center',
    color: '#FF4D4F',
    marginTop: 15,
    fontWeight: '700',
  },

  mapContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10, // 🔥 naikkan semua
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 10,
  },

  column: {
    width: 140,
    gap: 5, // 🔥 lebih rapih
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 40, // 🔥 naik dari bawah
  },

  hintBtn: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },

  hintIcon: {
    fontSize: 22,
    color: '#fff',
  },

  deleteBtn: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  submit: {
    flex: 1,
    backgroundColor: '#5CBEFA',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
},

  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
