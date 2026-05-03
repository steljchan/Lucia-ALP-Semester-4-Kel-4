import { useState } from 'react';

export default function useSiapakahAku(answer: string) {
  const [selected, setSelected] = useState<string[]>([]);

  const select = (letter: string) => {
    if (selected.length >= answer.length) return;
    setSelected([...selected, letter]);
  };

  const isCorrect = selected.join('') === answer;

  return { selected, select, isCorrect };
}