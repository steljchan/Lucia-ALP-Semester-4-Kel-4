import {useEffect, useMemo, useState} from 'react';

type LetterResult = 'correct' | 'wrong';
type StatusType = 'idle' | 'correct' | 'wrong';

export default function useSiapakahAku(answer: string) {
  const [selected, setSelected] = useState<string[]>([]);
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
  const [status, setStatus] = useState<StatusType>('idle');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [letterResults, setLetterResults] = useState<LetterResult[]>([]);

  useEffect(() => {
    setSelected([]);
    setUsedIndexes([]);
    setStatus('idle');
    setResult(null);
    setLetterResults([]);
  }, [answer]);

  const select = (letter: string, index: number) => {
    if (usedIndexes.includes(index)) {
      return;
    }

    if (selected.length >= answer.length) {
      return;
    }

    if (status === 'correct' || status === 'wrong') {
      return;
    }

    setSelected((prev) => [...prev, letter]);
    setUsedIndexes((prev) => [...prev, index]);
    setStatus('idle');
  };

  const remove = (removeIndex: number) => {
    if (status === 'correct' || status === 'wrong') {
      return;
    }

    setSelected((prev) => {
      const updated = [...prev];
      updated.splice(removeIndex, 1);
      return updated;
    });

    setUsedIndexes((prev) => {
      const updated = [...prev];
      updated.splice(removeIndex, 1);
      return updated;
    });

    setStatus('idle');
    setResult(null);
    setLetterResults([]);
  };

  const removeLast = () => {
    if (selected.length === 0) {
      return;
    }

    if (status === 'correct' || status === 'wrong') {
      return;
    }

    setSelected((prev) => prev.slice(0, -1));
    setUsedIndexes((prev) => prev.slice(0, -1));
    setStatus('idle');
    setResult(null);
    setLetterResults([]);
  };

  const reset = () => {
    setSelected([]);
    setUsedIndexes([]);
    setStatus('idle');
    setResult(null);
    setLetterResults([]);
  };

  const check = () => {
    const results: LetterResult[] = [];
    const userAnswer = selected.join('');
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

    const isCorrect = userAnswer === answer;
    const currentResult = isCorrect ? 'correct' : 'wrong';

    setLetterResults(results);
    setStatus(currentResult);
    setResult(currentResult);

    return {
      isCorrect,
      correctCount: isCorrect ? 1 : 0,
      wrongCount: isCorrect ? 0 : 1,
      letterCorrect: correctCount,
      letterWrong: wrongCount,
      result: currentResult,
      userAnswer,
      correctAnswer: answer,
      results,
    };
  };

  const isFull = useMemo(() => {
    return selected.length === answer.length;
  }, [selected, answer]);

  const isCorrect = useMemo(() => {
    return selected.join('') === answer;
  }, [selected, answer]);

  return {
    selected,
    usedIndexes,
    status,
    result,
    letterResults,
    select,
    remove,
    removeLast,
    reset,
    check,
    isFull,
    isCorrect,
  };
}