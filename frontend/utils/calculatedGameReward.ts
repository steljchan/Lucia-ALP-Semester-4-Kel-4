// ========================================
// DIFFICULTY
// ========================================

export type Difficulty =
  | 'easy'
  | 'medium'
  | 'hard';

// ========================================
// PARAMS
// ========================================

type CalculateGameRewardsParams = {

  // jumlah jawaban benar
  correctAnswers: number;

  // jumlah jawaban salah
  wrongAnswers: number;

  // total soal
  totalQuestions: number;

  // difficulty level
  difficulty?: Difficulty;

  // combo / streak
  streak?: number;

  // apakah level sudah pernah selesai
  alreadyCompleted?: boolean;
};

// ========================================
// RESULT TYPE
// ========================================

type RewardResult = {

  // total star
  stars: number;

  // total xp
  xp: number;

  // total coin
  coin: number;

  // akurasi %
  accuracy: number;

  // apakah perfect
  perfect: boolean;

  // apakah replay
  replayed: boolean;
};

// ========================================
// CALCULATE GAME REWARDS
// ========================================

export const calculateGameRewards = ({
  correctAnswers,
  wrongAnswers,
  totalQuestions,
  difficulty = 'easy',
  streak = 0,
  alreadyCompleted = false,
}: CalculateGameRewardsParams):
RewardResult => {

  /*
    ========================================
    SAFETY
    ========================================
  */

  const safeCorrect =
    Math.max(
      0,
      correctAnswers
    );

  const safeWrong =
    Math.max(
      0,
      wrongAnswers
    );

  const safeTotal =
    Math.max(
      1,
      totalQuestions
    );

  /*
    ========================================
    ACCURACY
    ========================================
  */

  const accuracy =
    Math.round(
      (safeCorrect /
        safeTotal) *
      100
    );

  /*
    ========================================
    STAR
    ========================================
  */

  let stars = 1;

  if (
    accuracy >= 90
  ) {

    stars = 3;
  }

  else if (
    accuracy >= 60
  ) {

    stars = 2;
  }

  /*
    ========================================
    PERFECT
    ========================================
  */

  const perfect =
    safeCorrect ===
    safeTotal;

  /*
    ========================================
    REPLAY
    ========================================
  */

  const replayed =
    alreadyCompleted;

  /*
    ========================================
    REPLAY = NO REWARD
    ========================================
  */

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

  /*
    ========================================
    XP
    ========================================
  */

  let xp =
    safeCorrect * 50;

  xp -=
    safeWrong * 10;

  /*
    minimum xp
  */

  xp = Math.max(
    10,
    xp
  );

  /*
    ========================================
    DIFFICULTY BONUS
    ========================================
  */

  switch (
    difficulty
  ) {

    case 'medium':

      xp += 50;
      break;

    case 'hard':

      xp += 100;
      break;
  }

  /*
    ========================================
    PERFECT BONUS
    ========================================
  */

  if (perfect) {

    xp += 100;
  }

  /*
    ========================================
    STREAK BONUS
    ========================================
  */

  if (
    streak >= 5
  ) {

    xp += 50;
  }

  if (
    streak >= 10
  ) {

    xp += 100;
  }

  /*
    ========================================
    COIN
    ========================================
  */

  let coin =
    safeCorrect * 2;

  /*
    difficulty bonus
  */

  switch (
    difficulty
  ) {

    case 'medium':

      coin += 5;
      break;

    case 'hard':

      coin += 10;
      break;
  }

  /*
    perfect bonus
  */

  if (perfect) {

    coin += 10;
  }

  /*
    minimum coin
  */

  coin = Math.max(
    1,
    coin
  );

  /*
    ========================================
    RETURN
    ========================================
  */

  return {

    stars,

    xp,

    coin,

    accuracy,

    perfect,

    replayed: false,
  };
};

export const getStarLabel = (
  stars: number,
) => {

  switch (stars) {

    case 3:
      return 'Perfect';

    case 2:
      return 'Good';

    default:
      return 'Keep Trying';
  }
};

/**
 * Ambil warna berdasarkan difficulty
 */
export const getDifficultyColor = (
  difficulty: Difficulty,
) => {

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

/**
 * Ambil text reward replay
 */
export const getReplayMessage = (
  replayed: boolean,
) => {

  if (replayed) {

    return (
      'Replay level - XP & coin tidak bertambah'
    );
  }

  return (
    'First clear reward claimed'
  );
};