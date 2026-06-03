import {useMemo, useState} from 'react';

type QuestionResult = 'correct' | 'wrong';

export default function useBerapakahAku(totalQuestions: number) {
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(totalQuestions).fill(null)
  );

  const [results, setResults] = useState<QuestionResult[]>([]);

  const select = (questionIndex: number, value: number) => {
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      if (updated[questionIndex] === value) {
        updated[questionIndex] = null;
      } else {
        updated[questionIndex] = value;
      }
      return updated;
    });
  };

  const reset = () => {
    setSelectedAnswers(Array(totalQuestions).fill(null));
    setResults([]);
  };

  const check = (answers: number[]) => {
    const tempResults: QuestionResult[] = [];
    let correctCount = 0;
    let wrongCount = 0;

    for (let i = 0; i < totalQuestions; i++) {
      const userAnswer = selectedAnswers[i];
      const correctAnswer = answers[i];

      if (userAnswer !== null && userAnswer === correctAnswer) {
        tempResults.push('correct');
        correctCount++;
      } else {
        tempResults.push('wrong');
        wrongCount++;
      }
    }
    setResults(tempResults);

    return {
      results: tempResults,
      correctCount,
      wrongCount,
      isPerfect: correctCount === totalQuestions,
    };
  };

  const isFilled = useMemo(() => {
    return selectedAnswers.every((answer) => answer !== null);
  }, [selectedAnswers]);

  return {
    selectedAnswers,
    results,
    select,
    reset,
    check,
    isFilled,
  };
}