export type EndState =
  | 'none'
  | 'result'
  | 'gameover';

type DetermineEndStateParams = {
  isWrong: boolean;
  heart: number;
};

export const determineEndState = ({
  isWrong,
  heart,
}: DetermineEndStateParams): EndState => {
  if (isWrong && heart <= 0) {
    return 'gameover';
  }
  return 'result';
};