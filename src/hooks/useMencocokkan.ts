import { useMemo, useState } from 'react';

type ResultType = 'correct' | 'wrong';

type Pair = {
  word: string;
  image: string;
};

type Position = { x: number; y: number };

export default function useMencocokkan(pairs: Pair[]) {
  /**
   * ==============================
   * 🔹 STATE UTAMA
   * ==============================
   */
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultMap, setResultMap] = useState<Record<string, ResultType>>({});
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  /**
   * ==============================
   * 🔥 STATE POSISI DOT (PENTING)
   * ==============================
   */
  const [wordPositions, setWordPositions] = useState<Record<string, Position>>(
    {}
  );
  const [imagePositions, setImagePositions] = useState<
    Record<string, Position>
  >({});

  /**
   * ==============================
   * 🔀 RANDOM (STABLE)
   * ==============================
   */
  const shuffledWords = useMemo(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  }, [pairs]);

  const shuffledImages = useMemo(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  }, [pairs]);

  /**
   * ==============================
   * 🔵 SELECT WORD
   * ==============================
   */
  const selectWord = (word: string) => {
    setSelectedWord(word);
  };

  /**
   * ==============================
   * 🟡 SELECT IMAGE
   * ==============================
   */
  const selectImage = (imageWord: string) => {
    if (!selectedWord) return;

    setAnswers((prev) => {
      const updated = { ...prev };

      /**
       * 🔥 Hapus image yang sudah dipakai
       */
      Object.keys(updated).forEach((key) => {
        if (updated[key] === imageWord) {
          delete updated[key];
        }
      });

      /**
       * 🔥 Set pairing baru
       */
      updated[selectedWord] = imageWord;

      return updated;
    });

    setSelectedWord(null);
  };

  /**
   * ==============================
   * ❌ REMOVE PAIR
   * ==============================
   */
  const removePair = (word: string) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[word];
      return copy;
    });
  };

  /**
   * ==============================
   * 🔍 CHECK RESULT
   * ==============================
   */
  const checkAll = () => {
    const newResult: Record<string, ResultType> = {};

    pairs.forEach((p) => {
      const userAnswer = answers[p.word];

      if (!userAnswer) return;

      if (userAnswer === p.word) {
        newResult[p.word] = 'correct';
      } else {
        newResult[p.word] = 'wrong';
      }
    });

    setResultMap(newResult);

    const isAllCorrect = pairs.every(
      (p) => answers[p.word] === p.word
    );

    setStatus(isAllCorrect ? 'correct' : 'wrong');

    return isAllCorrect;
  };

  /**
   * ==============================
   * 🔄 RESET GAME
   * ==============================
   */
  const reset = () => {
    setAnswers({});
    setSelectedWord(null);
    setResultMap({});
    setStatus('idle');

    // 🔥 penting reset posisi juga
    setWordPositions({});
    setImagePositions({});
  };

  /**
   * ==============================
   * 📍 SET POSISI DOT
   * ==============================
   */
  const setWordPosition = (word: string, pos: Position) => {
    setWordPositions((prev) => ({
      ...prev,
      [word]: pos,
    }));
  };

  const setImagePosition = (word: string, pos: Position) => {
    setImagePositions((prev) => ({
      ...prev,
      [word]: pos,
    }));
  };

  /**
   * ==============================
   * 📊 HELPER
   * ==============================
   */
  const isImageUsed = (imageWord: string) => {
    return Object.values(answers).includes(imageWord);
  };

  const isPaired = (word: string) => {
    return !!answers[word];
  };

  const isComplete = Object.keys(answers).length === pairs.length;

  /**
   * ==============================
   * 🚀 RETURN
   * ==============================
   */
  return {
    // interaction
    selectedWord,
    selectWord,
    selectImage,
    removePair,

    // data
    answers,
    resultMap,
    status,

    // random
    shuffledWords,
    shuffledImages,

    // posisi dot (🔥 penting buat garis)
    wordPositions,
    imagePositions,
    setWordPosition,
    setImagePosition,

    // helper
    isImageUsed,
    isPaired,
    isComplete,

    // action
    checkAll,
    reset,
  };
}