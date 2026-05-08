import { useEffect, useState } from 'react';

type StatusType = 'idle' | 'correct' | 'wrong';

export default function useSiapakahAku(answer: string) {
  const [selected, setSelected] = useState<string[]>([]);
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
  const [status, setStatus] = useState<StatusType>('idle');
  const [hearts, setHearts] = useState(3);

  /* 🔁 RESET SAAT LEVEL BERUBAH */
  useEffect(() => {
    setSelected([]);
    setUsedIndexes([]);
    setStatus('idle');
  }, [answer]);

  /* ➕ PILIH HURUF */
  const select = (letter: string, index: number) => {
    if (selected.length >= answer.length) return;

    // ❌ sudah dipakai → skip
    if (usedIndexes.includes(index)) return;

    setSelected((prev) => [...prev, letter]);
    setUsedIndexes((prev) => [...prev, index]);
  };

  /* ❌ HAPUS HURUF (BERDASARKAN SLOT) */
  const remove = (removeIndex: number) => {
    setSelected((prev) => {
      const newSelected = [...prev];
      newSelected.splice(removeIndex, 1);
      return newSelected;
    });

    setUsedIndexes((prev) => {
      const newUsed = [...prev];
      newUsed.splice(removeIndex, 1); // 🔥 penting: sinkron
      return newUsed;
    });

    setStatus('idle');
  };

  /* 🔄 RESET */
  const reset = () => {
    setSelected([]);
    setUsedIndexes([]);
    setStatus('idle');
  };

  const removeLast = () => {
    if (selected.length === 0) return;

    setSelected((prev) => prev.slice(0, -1));
    setUsedIndexes((prev) => prev.slice(0, -1));

    setStatus('idle');
  };

  /* ✅ CHECK JAWABAN */
  const check = () => {
    if (selected.length !== answer.length) return false;

    const isMatch = selected.join('') === answer;

    if (isMatch) {
      setStatus('correct');
    } else {
      setStatus('wrong');

      // ❤️ kurang heart
      setHearts((prev) => Math.max(prev - 1, 0));

      // 🔄 reset delay (biar animasi keliatan)
      setTimeout(() => {
        reset();
      }, 600);
    }

    return isMatch;
  };

  const isFull = selected.length === answer.length;
  const isCorrect = selected.join('') === answer;

  
  return {
    selected,
    usedIndexes,
    select,
    remove,
    removeLast,
    reset,
    check,
    isFull,
    isCorrect,
    status,
    hearts,
  };
}