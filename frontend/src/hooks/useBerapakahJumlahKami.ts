import {
  useEffect,
  useMemo,
  useState,
} from 'react';

type AnswerResult =
  | 'correct'
  | 'wrong';

type StatusType =
  | 'idle'
  | 'correct'
  | 'wrong';

export default function useBerapakahJumlahKami(
  correctAnswer: number
) {

  // ========================================
  // STATES
  // ========================================

  const [answer, setAnswer] =
    useState('');

  const [status, setStatus] =
    useState<StatusType>(
      'idle'
    );

  const [result, setResult] =
    useState<AnswerResult | null>(
      null
    );

  // ========================================
  // RESET SAAT QUESTION BERUBAH
  // ========================================

  useEffect(() => {

    setAnswer('');

    setStatus('idle');

    setResult(null);

  }, [correctAnswer]);

  // ========================================
  // ADD NUMBER
  // ========================================

  const addNumber = (
    number: string
  ) => {

    // prevent overflow
    if (answer.length >= 2) {
      return;
    }

    // prevent submit spam
    if (
      status === 'correct' ||
      status === 'wrong'
    ) {
      return;
    }

    setAnswer((prev) =>
      prev + number
    );
  };

  // ========================================
  // REMOVE NUMBER
  // ========================================

  const removeNumber = () => {

    // prevent remove after submit
    if (
      status === 'correct' ||
      status === 'wrong'
    ) {
      return;
    }

    setAnswer((prev) =>
      prev.slice(0, -1)
    );
  };

  // ========================================
  // RESET
  // ========================================

  const reset = () => {

    setAnswer('');

    setStatus('idle');

    setResult(null);
  };

  // ========================================
  // CHECK RESULT
  // ========================================

  const check = () => {

    const parsedAnswer =
      Number(answer);

    const isCorrect =
      parsedAnswer ===
      correctAnswer;

    const currentResult =
      isCorrect
        ? 'correct'
        : 'wrong';

    setStatus(currentResult);

    setResult(currentResult);

    return {

      // final result
      isCorrect,

      // score tracking
      correctCount:
        isCorrect ? 1 : 0,

      wrongCount:
        isCorrect ? 0 : 1,

      // current result
      result:
        currentResult,

      // value
      userAnswer:
        parsedAnswer,

      correctAnswer,
    };
  };

  // ========================================
  // IS FILLED
  // ========================================

  const isFilled = useMemo(() => {

    return answer.length > 0;

  }, [answer]);

  // ========================================
  // IS CORRECT
  // ========================================

  const isCorrect = useMemo(() => {

    return (
      Number(answer) ===
      correctAnswer
    );

  }, [
    answer,
    correctAnswer,
  ]);

  // ========================================
  // RETURN
  // ========================================

  return {

    // states
    answer,
    status,
    result,

    // actions
    addNumber,
    removeNumber,
    reset,
    check,

    // helper
    isFilled,
    isCorrect,
  };
}