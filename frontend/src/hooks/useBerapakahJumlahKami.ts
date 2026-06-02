import {useEffect, useMemo, useState} from 'react';

type AnswerResult = 'correct' | 'wrong';
type StatusType = 'idle' | 'correct' | 'wrong';

export default function useBerapakahJumlahKami(correctAnswer: number) {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<StatusType>('idle');
  const [result, setResult] = useState<AnswerResult | null>(null);

  useEffect(() => {
    setAnswer('');
    setStatus('idle');
    setResult(null);
  }, [correctAnswer]);

  const addNumber = (number: string) => {
    if (answer.length >= 2) {
      return;
    }

    if (status === 'correct' || status === 'wrong') {
      return;
    }

    setAnswer((prev) => prev + number);
  };

  const removeNumber = () => {
    if (status === 'correct' || status === 'wrong') {
      return;
    }

    setAnswer((prev) => prev.slice(0, -1));
  };

  const reset = () => {
    setAnswer('');
    setStatus('idle');
    setResult(null);
  };

  const check = () => {
    const parsedAnswer = Number(answer);
    const isCorrect = parsedAnswer === correctAnswer;
    const currentResult = isCorrect ? 'correct' : 'wrong';

    setStatus(currentResult);
    setResult(currentResult);

    return {
      isCorrect,
      correctCount: isCorrect ? 1 : 0,
      wrongCount: isCorrect ? 0 : 1,
      result: currentResult,
      userAnswer: parsedAnswer,
      correctAnswer,
    };
  };

  const isFilled = useMemo(() => {
    return answer.length > 0;
  }, [answer]);

  const isCorrect = useMemo(() => {
    return Number(answer) === correctAnswer;
  }, [answer, correctAnswer]);

  return {
    answer,
    status,
    result,
    addNumber,
    removeNumber,
    reset,
    check,
    isFilled,
    isCorrect,
  };
}