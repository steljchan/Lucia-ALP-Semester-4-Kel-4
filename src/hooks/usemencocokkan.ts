import { useState } from 'react';

export default function useMencocokkan(pairs: any[]) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);

  const selectWord = (word: string) => {
    setSelectedWord(word);
  };

  const selectImage = (word: string) => {
    if (selectedWord === word) {
      setMatched((prev) => [...prev, word]);
    }
    setSelectedWord(null);
  };

  const isComplete = matched.length === pairs.length;

  return {
    selectedWord,
    selectWord,
    selectImage,
    matched,
    isComplete,
  };
}