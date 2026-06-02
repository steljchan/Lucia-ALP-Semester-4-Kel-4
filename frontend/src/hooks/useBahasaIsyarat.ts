import {useMemo, useState} from 'react';

type LetterResult = 'correct' | 'wrong';

export default function useBahasaIsyarat(answer: string) {
  const [selected, setSelected] = useState<string[]>([]);
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
  const [letterResults, setLetterResults] = useState<LetterResult[]>([]);

  const select = (letter: string, index: number) => {
    if (usedIndexes.includes(index)) {
      return;
    }

    if (selected.length >= answer.length) {
      return;
    }

    setSelected((prev) => [...prev, letter]);
    setUsedIndexes((prev) => [...prev, index]);
  };

  const reset = () => {
    setSelected([]);
    setUsedIndexes([]);
    setLetterResults([]);
  };

  const check = () => {
    const results: LetterResult[] = [];
    let correctCount = 0;
    let wrongCount = 0;

    for (let i = 0; i < answer.length; i++) {
      const selectedLetter = selected[i];
      const answerLetter = answer[i];

      if (selectedLetter === answerLetter) {
        results.push('correct');
        correctCount++;
      }
      else {
        results.push('wrong');
        wrongCount++;
      }
    }

    setLetterResults(results);

    return {
      isCorrect: correctCount === answer.length,
      correctCount,
      wrongCount,
      results,
    };
  };

  const isFull = useMemo(() => {
    return selected.length === answer.length;
  }, [selected, answer]);

  return {
    selected,
    usedIndexes,
    letterResults,
    select,
    reset,
    check,
    isFull,
  };
}