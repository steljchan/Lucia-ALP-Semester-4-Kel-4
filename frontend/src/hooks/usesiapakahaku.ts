import {
  useEffect,
  useMemo,
  useState,
} from 'react';

type LetterResult =
  | 'correct'
  | 'wrong';

type StatusType =
  | 'idle'
  | 'correct'
  | 'wrong';

export default function useSiapakahAku(
  answer: string
) {

  // ========================================
  // STATES
  // ========================================

  const [selected, setSelected] =
    useState<string[]>([]);

  const [usedIndexes, setUsedIndexes] =
    useState<number[]>([]);

  const [status, setStatus] =
    useState<StatusType>(
      'idle'
    );

  const [result, setResult] =
    useState<
      'correct' |
      'wrong' |
      null
    >(null);

  const [letterResults, setLetterResults] =
    useState<
      LetterResult[]
    >([]);

  // ========================================
  // RESET SAAT QUESTION BERUBAH
  // ========================================

  useEffect(() => {

    setSelected([]);

    setUsedIndexes([]);

    setStatus('idle');

    setResult(null);

    setLetterResults([]);

  }, [answer]);

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

    // prevent spam after submit
    if (
      status === 'correct' ||
      status === 'wrong'
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

    setStatus('idle');
  };

  // ========================================
  // REMOVE LETTER
  // ========================================

  const remove = (
    removeIndex: number
  ) => {

    // prevent remove after submit
    if (
      status === 'correct' ||
      status === 'wrong'
    ) {
      return;
    }

    setSelected((prev) => {

      const updated =
        [...prev];

      updated.splice(
        removeIndex,
        1
      );

      return updated;
    });

    setUsedIndexes((prev) => {

      const updated =
        [...prev];

      updated.splice(
        removeIndex,
        1
      );

      return updated;
    });

    setStatus('idle');

    setResult(null);

    setLetterResults([]);
  };

  // ========================================
  // REMOVE LAST
  // ========================================

  const removeLast = () => {

    if (
      selected.length === 0
    ) {
      return;
    }

    // prevent remove after submit
    if (
      status === 'correct' ||
      status === 'wrong'
    ) {
      return;
    }

    setSelected((prev) =>
      prev.slice(0, -1)
    );

    setUsedIndexes((prev) =>
      prev.slice(0, -1)
    );

    setStatus('idle');

    setResult(null);

    setLetterResults([]);
  };

  // ========================================
  // RESET
  // ========================================

  const reset = () => {

    setSelected([]);

    setUsedIndexes([]);

    setStatus('idle');

    setResult(null);

    setLetterResults([]);
  };

  // ========================================
  // CHECK RESULT
  // ========================================

  const check = () => {

    const results:
      LetterResult[] = [];

    const userAnswer =
      selected.join('');

    let correctCount = 0;

    let wrongCount = 0;

    // ========================================
    // CHECK PER LETTER
    // ========================================

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

    // ========================================
    // FINAL RESULT
    // ========================================

    const isCorrect =
      userAnswer === answer;

    const currentResult =
      isCorrect
        ? 'correct'
        : 'wrong';

    setLetterResults(
      results
    );

    setStatus(
      currentResult
    );

    setResult(
      currentResult
    );

    return {

      // final result
      isCorrect,

      // tracking reward
      correctCount:
        isCorrect ? 1 : 0,

      wrongCount:
        isCorrect ? 0 : 1,

      // detail per huruf
      letterCorrect:
        correctCount,

      letterWrong:
        wrongCount,

      // current result
      result:
        currentResult,

      // answer
      userAnswer,

      correctAnswer:
        answer,

      // box result
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
  // IS CORRECT
  // ========================================

  const isCorrect = useMemo(() => {

    return (
      selected.join('') ===
      answer
    );

  }, [
    selected,
    answer,
  ]);

  // ========================================
  // RETURN
  // ========================================

  return {

    // states
    selected,
    usedIndexes,
    status,
    result,
    letterResults,

    // actions
    select,
    remove,
    removeLast,
    reset,
    check,

    // helper
    isFull,
    isCorrect,
  };
}