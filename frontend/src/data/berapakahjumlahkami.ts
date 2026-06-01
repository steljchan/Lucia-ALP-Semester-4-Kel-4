import {
  Difficulty,
} from '../../utils/calculatedGameReward';

export type JumlahKamiQuestion = {
  id: number;
  emoji1: string;
  count1: number;
  emoji2: string;
  count2: number;
  answer: number;
};

export type JumlahKamiLevel = {
  id: number;
  questions: JumlahKamiQuestion[];

  unlocked: boolean;
  stars: number;

  difficulty: Difficulty;
  totalQuestions: number;
};

export const jumlahKamiLevels:
JumlahKamiLevel[] = [

  // ========================================
  // EASY
  // ========================================

  {
    id: 1,
    unlocked: true,
    stars: 0,
    difficulty: 'easy',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍎',
        count1: 2,
        emoji2: '🍌',
        count2: 3,
        answer: 5,
      },

      {
        id: 2,
        emoji1: '🐱',
        count1: 1,
        emoji2: '🐶',
        count2: 4,
        answer: 5,
      },

      {
        id: 3,
        emoji1: '⭐',
        count1: 2,
        emoji2: '🌙',
        count2: 5,
        answer: 7,
      },
    ],
  },

  {
    id: 2,
    unlocked: false,
    stars: 0,
    difficulty: 'easy',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍇',
        count1: 3,
        emoji2: '🍉',
        count2: 6,
        answer: 9,
      },

      {
        id: 2,
        emoji1: '🐸',
        count1: 2,
        emoji2: '🐵',
        count2: 5,
        answer: 7,
      },

      {
        id: 3,
        emoji1: '⚽',
        count1: 4,
        emoji2: '🏀',
        count2: 4,
        answer: 8,
      },
    ],
  },

  {
    id: 3,
    unlocked: false,
    stars: 0,
    difficulty: 'easy',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍓',
        count1: 7,
        emoji2: '🍒',
        count2: 2,
        answer: 9,
      },

      {
        id: 2,
        emoji1: '🐰',
        count1: 5,
        emoji2: '🐼',
        count2: 6,
        answer: 11,
      },

      {
        id: 3,
        emoji1: '🌟',
        count1: 3,
        emoji2: '☁️',
        count2: 7,
        answer: 10,
      },
    ],
  },

  {
    id: 4,
    unlocked: false,
    stars: 0,
    difficulty: 'easy',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍕',
        count1: 8,
        emoji2: '🍔',
        count2: 5,
        answer: 13,
      },

      {
        id: 2,
        emoji1: '🐯',
        count1: 6,
        emoji2: '🐨',
        count2: 8,
        answer: 14,
      },

      {
        id: 3,
        emoji1: '🚗',
        count1: 4,
        emoji2: '🚌',
        count2: 7,
        answer: 11,
      },
    ],
  },

  {
    id: 5,
    unlocked: false,
    stars: 0,
    difficulty: 'easy',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍍',
        count1: 9,
        emoji2: '🥝',
        count2: 6,
        answer: 15,
      },

      {
        id: 2,
        emoji1: '🐧',
        count1: 7,
        emoji2: '🦁',
        count2: 5,
        answer: 12,
      },

      {
        id: 3,
        emoji1: '🎈',
        count1: 10,
        emoji2: '🎁',
        count2: 4,
        answer: 14,
      },
    ],
  },

  // ========================================
  // MEDIUM
  // ========================================

  {
    id: 6,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍎',
        count1: 11,
        emoji2: '🍌',
        count2: 3,
        answer: 14,
      },

      {
        id: 2,
        emoji1: '🐶',
        count1: 8,
        emoji2: '🐱',
        count2: 9,
        answer: 17,
      },

      {
        id: 3,
        emoji1: '🌈',
        count1: 12,
        emoji2: '⭐',
        count2: 6,
        answer: 18,
      },
    ],
  },

  {
    id: 7,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍇',
        count1: 5,
        emoji2: '🍓',
        count2: 8,
        answer: 13,
      },

      {
        id: 2,
        emoji1: '🐼',
        count1: 10,
        emoji2: '🐸',
        count2: 10,
        answer: 20,
      },

      {
        id: 3,
        emoji1: '🚀',
        count1: 14,
        emoji2: '🛸',
        count2: 5,
        answer: 19,
      },
    ],
  },

  {
    id: 8,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍉',
        count1: 9,
        emoji2: '🍒',
        count2: 8,
        answer: 17,
      },

      {
        id: 2,
        emoji1: '🐨',
        count1: 6,
        emoji2: '🐵',
        count2: 12,
        answer: 18,
      },

      {
        id: 3,
        emoji1: '⚽',
        count1: 11,
        emoji2: '🏀',
        count2: 10,
        answer: 21,
      },
    ],
  },

  {
    id: 9,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍕',
        count1: 15,
        emoji2: '🍔',
        count2: 4,
        answer: 19,
      },

      {
        id: 2,
        emoji1: '🐰',
        count1: 7,
        emoji2: '🦁',
        count2: 14,
        answer: 21,
      },

      {
        id: 3,
        emoji1: '🎈',
        count1: 13,
        emoji2: '🎁',
        count2: 9,
        answer: 22,
      },
    ],
  },

  {
    id: 10,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍍',
        count1: 16,
        emoji2: '🥝',
        count2: 8,
        answer: 24,
      },

      {
        id: 2,
        emoji1: '🐯',
        count1: 9,
        emoji2: '🐧',
        count2: 15,
        answer: 24,
      },

      {
        id: 3,
        emoji1: '🚗',
        count1: 18,
        emoji2: '🚌',
        count2: 5,
        answer: 23,
      },
    ],
  },

  // ========================================
  // HARD
  // ========================================

  {
    id: 11,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍎',
        count1: 20,
        emoji2: '🍌',
        count2: 6,
        answer: 26,
      },

      {
        id: 2,
        emoji1: '🐱',
        count1: 11,
        emoji2: '🐶',
        count2: 16,
        answer: 27,
      },

      {
        id: 3,
        emoji1: '⭐',
        count1: 19,
        emoji2: '🌙',
        count2: 7,
        answer: 26,
      },
    ],
  },

  {
    id: 12,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍇',
        count1: 14,
        emoji2: '🍉',
        count2: 15,
        answer: 29,
      },

      {
        id: 2,
        emoji1: '🐸',
        count1: 12,
        emoji2: '🐵',
        count2: 18,
        answer: 30,
      },

      {
        id: 3,
        emoji1: '⚽',
        count1: 21,
        emoji2: '🏀',
        count2: 6,
        answer: 27,
      },
    ],
  },

  {
    id: 13,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍓',
        count1: 17,
        emoji2: '🍒',
        count2: 14,
        answer: 31,
      },

      {
        id: 2,
        emoji1: '🐰',
        count1: 20,
        emoji2: '🐼',
        count2: 12,
        answer: 32,
      },

      {
        id: 3,
        emoji1: '🌟',
        count1: 22,
        emoji2: '☁️',
        count2: 9,
        answer: 31,
      },
    ],
  },

  {
    id: 14,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍕',
        count1: 18,
        emoji2: '🍔',
        count2: 16,
        answer: 34,
      },

      {
        id: 2,
        emoji1: '🐯',
        count1: 25,
        emoji2: '🐨',
        count2: 8,
        answer: 33,
      },

      {
        id: 3,
        emoji1: '🚗',
        count1: 19,
        emoji2: '🚌',
        count2: 17,
        answer: 36,
      },
    ],
  },

  {
    id: 15,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [
      {
        id: 1,
        emoji1: '🍍',
        count1: 24,
        emoji2: '🥝',
        count2: 15,
        answer: 39,
      },

      {
        id: 2,
        emoji1: '🐧',
        count1: 21,
        emoji2: '🦁',
        count2: 19,
        answer: 40,
      },

      {
        id: 3,
        emoji1: '🎈',
        count1: 26,
        emoji2: '🎁',
        count2: 12,
        answer: 38,
      },
    ],
  },
];