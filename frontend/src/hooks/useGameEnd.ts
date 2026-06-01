import { useState } from 'react';

import {
  determineEndState,
  EndState,
} from '../../utils/determindeEndStates';

type HandleGameEndParams = {
  isWrong: boolean;
  heart: number;
};

export default function useGameEnd() {

  const [endState, setEndState] =
    useState<EndState>('none');

  const handleGameEnd = ({
    isWrong,
    heart,
  }: HandleGameEndParams) => {

    const state =
      determineEndState({
        isWrong,
        heart,
      });

    setEndState(state);
  };

  const resetEndState = () => {
    setEndState('none');
  };

  return {
    endState,
    setEndState,
    handleGameEnd,
    resetEndState,
  };
}