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

  // kalau salah DAN heart habis
  if (isWrong && heart <= 0) {
    return 'gameover';
  }

  // selain itu tampil result
  return 'result';
};