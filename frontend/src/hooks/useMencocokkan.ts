import { useMemo, useState } from 'react';

type ResultType = 'correct' | 'wrong';

type Pair = {
  word: string;
  image: string;
};

type Position = { x: number; y: number };

export default function useMencocokkan(pairs: Pair[]) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultMap, setResultMap] = useState<Record<string, ResultType>>({});
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [wordPositions, setWordPositions] = useState<Record<string, Position>>(
    {}
  );
  const [imagePositions, setImagePositions] = useState<
    Record<string, Position>
  >({});

  const shuffledWords = useMemo(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  }, [pairs]);

  const shuffledImages = useMemo(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  }, [pairs]);

  const selectWord = (word: string) => {
    setSelectedWord(word);
  };

  const selectImage = (imageWord: string) => {
    if (!selectedWord) return;

    setAnswers((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((key) => {
        if (updated[key] === imageWord) {
          delete updated[key];
        }
      });

      updated[selectedWord] = imageWord;
      return updated;
    });
    setSelectedWord(null);
  };

  const removePair = (word: string) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[word];
      return copy;
    });
  };

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

  const reset = () => {
    setAnswers({});
    setSelectedWord(null);
    setResultMap({});
    setStatus('idle');
    setWordPositions({});
    setImagePositions({});
  };

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

  const isImageUsed = (imageWord: string) => {
    return Object.values(answers).includes(imageWord);
  };

  const isPaired = (word: string) => {
    return !!answers[word];
  };

  const isComplete = Object.keys(answers).length === pairs.length;

  return {
    selectedWord,
    selectWord,
    selectImage,
    removePair,
    answers,
    resultMap,
    status,
    shuffledWords,
    shuffledImages,
    wordPositions,
    imagePositions,
    setWordPosition,
    setImagePosition,
    isImageUsed,
    isPaired,
    isComplete,
    checkAll,
    reset,
  };
}