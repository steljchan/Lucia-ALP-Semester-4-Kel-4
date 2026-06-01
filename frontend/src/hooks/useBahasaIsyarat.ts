import { useMemo, useState } from 'react';

type LetterResult =
  | 'correct'
  | 'wrong';

export default function useBahasaIsyarat(
  answer: string
) {

  // ========================================
  // STATES
  // ========================================

  const [selected, setSelected] =
    useState<string[]>([]);

  const [usedIndexes, setUsedIndexes] =
    useState<number[]>([]);

  const [letterResults, setLetterResults] =
    useState<LetterResult[]>([]);

  // ========================================
  // SELECT LETTER
  // ========================================

  const select = (
    letter: string,
    index: number
  ) => {

    // prevent duplicate click
    if (
      usedIndexes.includes(index)
    ) {
      return;
    }

    // prevent overflow
    if (
      selected.length >=
      answer.length
    ) {
      return;
    }

    setSelected((prev) => [
      ...prev,
      letter,
    ]);

    setUsedIndexes((prev) => [
      ...prev,
      index,
    ]);
  };

  // ========================================
  // RESET
  // ========================================

  const reset = () => {

    setSelected([]);

    setUsedIndexes([]);

    setLetterResults([]);
  };

  // ========================================
  // CHECK RESULT
  // ========================================

  const check = () => {

    const results:
      LetterResult[] = [];

    let correctCount = 0;

    let wrongCount = 0;

    for (
      let i = 0;
      i < answer.length;
      i++
    ) {

      const selectedLetter =
        selected[i];

      const answerLetter =
        answer[i];

      // ========================================
      // CORRECT
      // ========================================

      if (
        selectedLetter ===
        answerLetter
      ) {

        results.push(
          'correct'
        );

        correctCount++;
      }

      // ========================================
      // WRONG
      // ========================================

      else {

        results.push(
          'wrong'
        );

        wrongCount++;
      }
    }

    setLetterResults(results);

    return {

      // full correct
      isCorrect:
        correctCount ===
        answer.length,

      // total benar
      correctCount,

      // total salah
      wrongCount,

      // result per huruf
      results,
    };
  };

  // ========================================
  // IS FULL
  // ========================================

  const isFull = useMemo(() => {

    return (
      selected.length ===
      answer.length
    );

  }, [
    selected,
    answer,
  ]);

  // ========================================
  // RETURN
  // ========================================

  return {

    // state
    selected,
    usedIndexes,
    letterResults,

    // actions
    select,
    reset,
    check,

    // helper
    isFull,
  };
}