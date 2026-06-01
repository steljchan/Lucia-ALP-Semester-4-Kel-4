import {
  useMemo,
  useState,
} from 'react';

type QuestionResult =
  | 'correct'
  | 'wrong';

export default function useBerapakahAku(
  totalQuestions: number
) {


  const [
    selectedAnswers,
    setSelectedAnswers,
  ] = useState<
    (number | null)[]
  >(
    Array(totalQuestions).fill(
      null
    )
  );

  const [
    results,
    setResults,
  ] = useState<
    QuestionResult[]
  >([]);

  // ========================================
  // SELECT ANSWER
  // ========================================

  const select = (
    questionIndex: number,
    value: number
  ) => {

    setSelectedAnswers(
      (prev) => {

        const updated = [
          ...prev,
        ];

        // toggle selection
        if (
          updated[
            questionIndex
          ] === value
        ) {

          updated[
            questionIndex
          ] = null;

        } else {

          updated[
            questionIndex
          ] = value;
        }

        return updated;
      }
    );
  };

  // ========================================
  // RESET
  // ========================================

  const reset = () => {

    setSelectedAnswers(
      Array(
        totalQuestions
      ).fill(null)
    );

    setResults([]);
  };

  // ========================================
  // CHECK
  // ========================================

  const check = (
    answers: number[]
  ) => {

    const tempResults:
      QuestionResult[] = [];

    let correctCount = 0;

    let wrongCount = 0;

    for (
      let i = 0;
      i < totalQuestions;
      i++
    ) {

      const userAnswer =
        selectedAnswers[i];

      const correctAnswer =
        answers[i];

      if (
        userAnswer !== null &&
        userAnswer ===
          correctAnswer
      ) {

        tempResults.push(
          'correct'
        );

        correctCount++;
      }

      else {

        tempResults.push(
          'wrong'
        );

        wrongCount++;
      }
    }

    setResults(
      tempResults
    );

    return {

      results:
        tempResults,

      correctCount,

      wrongCount,

      isPerfect:
        correctCount ===
        totalQuestions,
    };
  };

  // ========================================
  // ALL FILLED
  // ========================================

  const isFilled =
    useMemo(() => {

      return selectedAnswers.every(
        (
          answer
        ) =>
          answer !== null
      );

    }, [
      selectedAnswers,
    ]);

  // ========================================
  // RETURN
  // ========================================

  return {

    // states
    selectedAnswers,
    results,

    // actions
    select,
    reset,
    check,

    // helper
    isFilled,
  };
}