import { useState } from 'react';

export default function useBahasaIsyarat(
  answer: string
) {

  const [selected, setSelected] =
    useState<string[]>([]);

  const [usedIndexes, setUsedIndexes] =
    useState<number[]>([]);

  const select = (
    letter: string,
    index: number
  ) => {

    if (
      usedIndexes.includes(index)
    ) return;

    setSelected((prev) => [
      ...prev,
      letter,
    ]);

    setUsedIndexes((prev) => [
      ...prev,
      index,
    ]);
  };

  const reset = () => {

    setSelected([]);

    setUsedIndexes([]);
  };

  const check = () => {

    return (
      selected.join('') === answer
    );
  };

  const isFull =
    selected.length === answer.length;

  return {
    selected,
    usedIndexes,
    select,
    reset,
    check,
    isFull,
  };
}