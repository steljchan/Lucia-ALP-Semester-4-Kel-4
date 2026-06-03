export type Difficulty = 'easy' | 'medium' | 'hard';

type CalculateGameRewardsParams = {
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  difficulty?: Difficulty;
  streak?: number;
  alreadyCompleted?: boolean;
};

type RewardResult = {
  stars: number;
  xp: number;
  coin: number;
  accuracy: number;
  perfect: boolean;
  replayed: boolean;
};

export const calculateGameRewards = ({
  correctAnswers,
  wrongAnswers,
  totalQuestions,
  difficulty = 'easy',
  streak = 0,
  alreadyCompleted = false,
}: CalculateGameRewardsParams): RewardResult => {
  const safeCorrect = Math.max(0, correctAnswers);
  const safeWrong = Math.max(0, wrongAnswers);
  const safeTotal = Math.max(1, totalQuestions);

  const accuracy = Math.round((safeCorrect / safeTotal) * 100);

  let stars = 1;
  if (accuracy >= 90) {
    stars = 3;
  } else if (accuracy >= 60) {
    stars = 2;
  }

  const perfect = safeCorrect === safeTotal;
  const replayed = alreadyCompleted;

  if (replayed) {
    return {
      stars,
      xp: 0,
      coin: 0,
      accuracy,
      perfect: false,
      replayed: true,
    };
  }

  let xp = safeCorrect * 50;
  xp -= safeWrong * 10;
  xp = Math.max(10, xp);

  switch (difficulty) {
    case 'medium':
      xp += 50;
      break;
    case 'hard':
      xp += 100;
      break;
  }

  if (perfect) {
    xp += 100;
  }
  if (streak >= 5) {
    xp += 50;
  }
  if (streak >= 10) {
    xp += 100;
  }

  let coin = safeCorrect * 2;
  switch (difficulty) {
    case 'medium':
      coin += 5;
      break;
    case 'hard':
      coin += 10;
      break;
  }

  if (perfect) {
    coin += 10;
  }
  coin = Math.max(1, coin);

  return {
    stars,
    xp,
    coin,
    accuracy,
    perfect,
    replayed: false,
  };
};

export const getStarLabel = (stars: number) => {
  switch (stars) {
    case 3:
      return 'Perfect';
    case 2:
      return 'Good';
    default:
      return 'Keep Trying';
  }
};

export const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy':
      return '#22C55E';
    case 'medium':
      return '#F59E0B';
    case 'hard':
      return '#EF4444';
    default:
      return '#22C55E';
  }
};

export const getReplayMessage = (replayed: boolean) => {
  if (replayed) {
    return 'Replay level - XP & coin tidak bertambah';
  }
  return 'First clear reward claimed';
};