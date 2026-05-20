import { useState } from 'react';

export default function useBerapakahJumlahKami(
  correctAnswer: number
) {

  const [answer, setAnswer] =
    useState('');

  const [status, setStatus] =
    useState<
      'idle' | 'correct' | 'wrong'
    >('idle');

  const addNumber = (
    number: string
  ) => {

    if (answer.length >= 2)
      return;

    setAnswer((prev) =>
      prev + number
    );
  };

  const removeNumber = () => {

    setAnswer((prev) =>
      prev.slice(0, -1)
    );
  };

  const reset = () => {

    setAnswer('');

    setStatus('idle');
  };

  const check = () => {

    const result =
      Number(answer) ===
      correctAnswer;

    setStatus(
      result
        ? 'correct'
        : 'wrong'
    );

    return result;
  };

  const isFilled =
    answer.length > 0;

  return {
    answer,
    status,
    addNumber,
    removeNumber,
    reset,
    check,
    isFilled,
  };
}