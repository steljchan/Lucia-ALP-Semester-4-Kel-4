import {View, Text, TouchableOpacity, StyleSheet, Image, Animated, Modal} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';

import { siapakahAkuLevels } from '../../../../../src/data/siapakahaku';
import useSiapakahAku from '../../../../../src/hooks/usesiapakahaku';
import LetterBox from '../../../../../src/components/game/letterbox';
import GameHeader from '../../../../../src/components/game/gameHeader';
import HintModal from '../../../../../src/components/game/hintModal';
import ResultModal from '../../../../../src/components/game/resultModal';

export default function GamePlay() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const levelIndex = Number(id) - 1;
  const level = siapakahAkuLevels[levelIndex];

  const {
    selected,
    usedIndexes,
    select,
    remove,
    removeLast, // 🔥 FIX
    reset,
    check,
    isFull,
    status,
  } = useSiapakahAku(level.answer);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  /* 🔥 IMAGE MAP (TIDAK DIUBAH) */
  const imageMap: any = {
    koala: require('../../../../../assets/images/koala.jpeg'),
    sapi: require('../../../../../assets/images/sapi.jpeg'),
    kucing: require('../../../../../assets/images/kucing.jpeg'),
    ayam: require('../../../../../assets/images/ayam.jpeg'),
    gajah: require('../../../../../assets/images/gajah.jpeg'),
    kuda: require('../../../../../assets/images/kuda.jpeg'),
    zebra: require('../../../../../assets/images/zebra.jpeg'),
    panda: require('../../../../../assets/images/panda.jpeg'),
    monyet: require('../../../../../assets/images/monyet.jpeg'),
    burung: require('../../../../../assets/images/burung.jpeg'),
    ikan: require('../../../../../assets/images/ikan.jpeg'),
    harimau: require('../../../../../assets/images/harimau.jpeg'),
    kambing: require('../../../../../assets/images/kambing.jpeg'),
    kelinci: require('../../../../../assets/images/kelinci.jpeg'),
    singa: require('../../../../../assets/images/singa.jpeg'),
  };

  /* 🔥 OPTIONS: JAWABAN + 3 RANDOM */
  const options = useMemo(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const answerLetters = level.answer.split('');

    const extra = alphabet
      .filter((l) => !answerLetters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return [...answerLetters, ...extra].sort(() => Math.random() - 0.5);
  }, [level.id]);

  const topRow = options.length > 6 ? options.slice(0, 4) : options;
  const bottomRow = options.length > 6 ? options.slice(4) : [];

  /* 🔥 ANIMASI */
  /* 🔥 ANIMASI */
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

    // ❌ JANGAN ADA router.replace DI SINI
    // karena sudah ditangani ResultModal
    if (!correct) {
      setTimeout(() => {
        reset();
      }, 900);
    }
  };
  const [showResult, setShowResult] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [xp, setXp] = useState(0);
  const [coin, setCoin] = useState(0);

  const stars = selected.join('') === level.answer ? 3 : 2;

  const onSubmit = () => {
    if (!isFull) return;

    const result = check();

    if (result) {
      const finalStars = stars;

      playAnimation(true);

      setEarnedStars(finalStars);
      setXp(50 + finalStars * 75);
      setCoin(3 + finalStars * 2);

      setTimeout(() => {
        setShowResult(true);
      }, 400);

    } else {
      playAnimation(false);
    }
  };

  const [showHint, setShowHint] = useState(false);
  const [hintStep, setHintStep] = useState(0);
  const hintText = useMemo(() => {
  const answer = level.answer;
    switch (hintStep) {
      case 0:
        return `Huruf pertama: ${answer[0]}`;
      case 1:
        return `Huruf terakhir: ${answer[answer.length - 1]}`;
      case 2:
        return `Jumlah huruf: ${answer.length}`;
      default:
        return `Semangat! Kamu pasti bisa 😄`;
    }
  }, [hintStep, level.answer]);
  const onPressHint = () => {
    setShowHint(true);
  };


  return (
    <View style={styles.container}>

      <GameHeader title="Siapakah Aku" level={level.id} hearts={3} />

      <Text style={styles.title}>Siapakah Aku?</Text>

      {/* IMAGE */}
      <Image source={imageMap[level.image]} style={styles.image} />

      {/* ANSWER */}
      <Animated.View
        style={[
          styles.answerRow,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {level.answer.split('').map((_, i) => (
          <TouchableOpacity key={i} onPress={() => remove(i)}>
            <LetterBox
              letter={selected[i]}
              status={status}
            />
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* OPTIONS (AUTO 2 BARIS) */}
      <View style={styles.optionsContainer}>

        {/* 🔝 BARIS ATAS */}
        <View style={styles.row}>
          {topRow.map((l, i) => {
            const index = i; // 🔥 penting untuk usedIndexes

            const isUsed = usedIndexes.includes(index);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionBtn,
                  isUsed && styles.optionDisabled,
                ]}
                onPress={() => select(l, index)}
                disabled={isUsed}
              >
                <Text style={styles.optionText}>{l}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 🔽 BARIS BAWAH */}
        {bottomRow.length > 0 && (
          <View style={styles.row}>
            {bottomRow.map((l, i) => {
              const index = i + 4; // 🔥 offset dari baris atas

              const isUsed = usedIndexes.includes(index);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionBtn,
                    isUsed && styles.optionDisabled,
                  ]}
                  onPress={() => select(l, index)}
                  disabled={isUsed}
                >
                  <Text style={styles.optionText}>{l}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

      </View>

      {/* ACTION */}
      <View style={styles.actionRow}>

        {/* 💡 HINT */}
        <TouchableOpacity 
          style={styles.hintBtn}
          onPress={() => setShowHint(true)}
        >
          <Text style={styles.hintIcon}>💡</Text>
        </TouchableOpacity>

        {/* 🧹 DELETE */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={removeLast}
        >
          <Text style={styles.deleteText}>⌫</Text>
        </TouchableOpacity>

        {/* ✅ SUBMIT */}
        <TouchableOpacity
          style={[
            styles.submit,
            { opacity: isFull ? 1 : 0.5 },
          ]}
          disabled={!isFull}
          onPress={onSubmit}
        >
          <Text style={styles.submitText}>Jawab</Text>
        </TouchableOpacity>

      </View>
      <HintModal
        visible={showHint}
        hintText={hintText}
        onClose={() => {
          setShowHint(false);

          setHintStep((prev) => {
            if (prev < 2) return prev + 1;
            return prev;
          });
        }}
      />

      <ResultModal
        visible={showResult && !isNavigating}
        gameTitle="Siapakah Aku?"
        stars={earnedStars}
        xp={xp}
        coin={coin}

        onRetry={() => {
          setShowResult(false);

          reset();

          setTimeout(() => {
            setIsNavigating(false);
          }, 100);
        }}

        onNext={() => {
          setIsNavigating(true);
          setShowResult(false);

          requestAnimationFrame(() => {
            const next = levelIndex + 2;

            if (next <= siapakahAkuLevels.length) {
              router.replace(`/siswa/game/siapakahaku/level/${next}`);
            } else {
              router.back();
            }
          });
        }}

        onLeaderboard={() => {
          setIsNavigating(true);
          setShowResult(false);

          requestAnimationFrame(() => {
            router.push('/siswa/tabs/leaderboard');
          });
        }}
      />
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
    fontSize: 24,
    fontWeight: '700',
    marginTop: 60,
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

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 20,
    gap: 10,
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