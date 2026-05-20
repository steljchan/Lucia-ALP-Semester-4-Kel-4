import { useState } from 'react';

export default function useBerapakahAku(
  correctAnswer: number
) {

  const [selected, setSelected] =
    useState<number | null>(null);

  const [status, setStatus] =
    useState<
      'idle' | 'correct' | 'wrong'
    >('idle');

  const select = (
    value: number
  ) => {

    setSelected(value);
  };

  const reset = () => {

    setSelected(null);

    setStatus('idle');
  };

  const check = () => {

    const result =
      selected === correctAnswer;

    setStatus(
      result
        ? 'correct'
        : 'wrong'
    );

    return result;
  };

  const isFilled =
    selected !== null;

  return {
    selected,
    status,
    select,
    reset,
    check,
    isFilled,
  };
}