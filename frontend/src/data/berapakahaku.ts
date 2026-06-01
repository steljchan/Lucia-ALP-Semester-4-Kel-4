import {
  Difficulty,
} from '../../utils/calculatedGameReward';

// ========================================
// TYPES
// ========================================

export type BerapakahAkuQuestion = {
  id: number;

  item1Emoji: string;
  item1Name: string;
  item1Count: number;
  item1Price: number;

  item2Emoji: string;
  item2Name: string;
  item2Count: number;

  totalPrice: number;

  question: string;

  options: number[];
  answer: number;
};

export type BerapakahAkuLevel = {
  id: number;

  questions: BerapakahAkuQuestion[];

  unlocked: boolean;

  stars: number;

  difficulty: Difficulty;

  totalQuestions: number;
};

/*
  FORMAT RUPIAH
*/
export const formatRupiah = (
  value: number
) => {
  return `Rp${value.toLocaleString(
    'id-ID'
  )}`;
};

/*
  SHUFFLE ARRAY
*/
const shuffleArray = (
  array: number[]
) => {
  return [...array].sort(
    () => Math.random() - 0.5
  );
};

// ========================================
// LEVEL DATA
// ========================================

export const berapakahAkuLevels:
BerapakahAkuLevel[] = [

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

        item1Emoji: '🍎',
        item1Name: 'apel',
        item1Count: 3,
        item1Price: 4000,

        item2Emoji: '🍊',
        item2Name: 'jeruk',
        item2Count: 2,

        totalPrice: 18000,

        question:
          'Berapa harga 1 jeruk?',

        options: shuffleArray([
          2000,
          3000,
          4000,
        ]),

        answer: 3000,
      },

      {
        id: 2,

        item1Emoji: '🍌',
        item1Name: 'pisang',
        item1Count: 2,
        item1Price: 5000,

        item2Emoji: '🍇',
        item2Name: 'anggur',
        item2Count: 3,

        totalPrice: 25000,

        question:
          'Berapa harga 1 anggur?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },

      {
        id: 3,

        item1Emoji: '🍓',
        item1Name: 'stroberi',
        item1Count: 4,
        item1Price: 3000,

        item2Emoji: '🥝',
        item2Name: 'kiwi',
        item2Count: 2,

        totalPrice: 22000,

        question:
          'Berapa harga 1 kiwi?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
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

        item1Emoji: '🍔',
        item1Name: 'burger',
        item1Count: 2,
        item1Price: 8000,

        item2Emoji: '🍟',
        item2Name: 'kentang',
        item2Count: 3,

        totalPrice: 28000,

        question:
          'Berapa harga 1 kentang?',

        options: shuffleArray([
          3000,
          4000,
          5000,
        ]),

        answer: 4000,
      },

      {
        id: 2,

        item1Emoji: '🧃',
        item1Name: 'jus',
        item1Count: 5,
        item1Price: 2000,

        item2Emoji: '🍪',
        item2Name: 'kue',
        item2Count: 2,

        totalPrice: 18000,

        question:
          'Berapa harga 1 kue?',

        options: shuffleArray([
          3000,
          4000,
          5000,
        ]),

        answer: 4000,
      },

      {
        id: 3,

        item1Emoji: '🍕',
        item1Name: 'pizza',
        item1Count: 1,
        item1Price: 12000,

        item2Emoji: '🥤',
        item2Name: 'soda',
        item2Count: 2,

        totalPrice: 20000,

        question:
          'Berapa harga 1 soda?',

        options: shuffleArray([
          3000,
          4000,
          5000,
        ]),

        answer: 4000,
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

        item1Emoji: '🍞',
        item1Name: 'roti',
        item1Count: 4,
        item1Price: 3000,

        item2Emoji: '🧈',
        item2Name: 'selai',
        item2Count: 2,

        totalPrice: 20000,

        question:
          'Berapa harga 1 selai?',

        options: shuffleArray([
          3000,
          4000,
          5000,
        ]),

        answer: 4000,
      },

      {
        id: 2,

        item1Emoji: '🥛',
        item1Name: 'susu',
        item1Count: 3,
        item1Price: 5000,

        item2Emoji: '🍪',
        item2Name: 'biskuit',
        item2Count: 2,

        totalPrice: 23000,

        question:
          'Berapa harga 1 biskuit?',

        options: shuffleArray([
          3000,
          4000,
          5000,
        ]),

        answer: 4000,
      },

      {
        id: 3,

        item1Emoji: '🍿',
        item1Name: 'popcorn',
        item1Count: 2,
        item1Price: 6000,

        item2Emoji: '🥤',
        item2Name: 'cola',
        item2Count: 2,

        totalPrice: 20000,

        question:
          'Berapa harga 1 cola?',

        options: shuffleArray([
          3000,
          4000,
          5000,
        ]),

        answer: 4000,
      },
    ],
  },

  // ========================================
  // MEDIUM
  // ========================================

  {
    id: 4,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 3,

    questions: [

      {
        id: 1,

        item1Emoji: '🍜',
        item1Name: 'mie',
        item1Count: 4,
        item1Price: 7000,

        item2Emoji: '🥚',
        item2Name: 'telur',
        item2Count: 3,

        totalPrice: 43000,

        question:
          'Berapa harga 1 telur?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },

      {
        id: 2,

        item1Emoji: '☕',
        item1Name: 'kopi',
        item1Count: 3,
        item1Price: 6000,

        item2Emoji: '🍩',
        item2Name: 'donat',
        item2Count: 4,

        totalPrice: 38000,

        question:
          'Berapa harga 1 donat?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },

      {
        id: 3,

        item1Emoji: '🍗',
        item1Name: 'ayam',
        item1Count: 2,
        item1Price: 10000,

        item2Emoji: '🍚',
        item2Name: 'nasi',
        item2Count: 5,

        totalPrice: 45000,

        question:
          'Berapa harga 1 nasi?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },
    ],
  },

  {
    id: 5,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 3,

    questions: [

      {
        id: 1,

        item1Emoji: '🎈',
        item1Name: 'balon',
        item1Count: 6,
        item1Price: 2000,

        item2Emoji: '🧸',
        item2Name: 'boneka',
        item2Count: 2,

        totalPrice: 26000,

        question:
          'Berapa harga 1 boneka?',

        options: shuffleArray([
          6000,
          7000,
          8000,
        ]),

        answer: 7000,
      },

      {
        id: 2,

        item1Emoji: '📘',
        item1Name: 'buku',
        item1Count: 3,
        item1Price: 8000,

        item2Emoji: '✏️',
        item2Name: 'pensil',
        item2Count: 4,

        totalPrice: 40000,

        question:
          'Berapa harga 1 pensil?',

        options: shuffleArray([
          3000,
          4000,
          5000,
        ]),

        answer: 4000,
      },

      {
        id: 3,

        item1Emoji: '🧃',
        item1Name: 'susu',
        item1Count: 5,
        item1Price: 5000,

        item2Emoji: '🍫',
        item2Name: 'coklat',
        item2Count: 3,

        totalPrice: 43000,

        question:
          'Berapa harga 1 coklat?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
      },
    ],
  },

  // ========================================
  // HARD
  // ========================================

  {
    id: 6,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [

      {
        id: 1,

        item1Emoji: '📱',
        item1Name: 'hp',
        item1Count: 2,
        item1Price: 25000,

        item2Emoji: '🎧',
        item2Name: 'earphone',
        item2Count: 5,

        totalPrice: 90000,

        question:
          'Berapa harga 1 earphone?',

        options: shuffleArray([
          6000,
          8000,
          10000,
        ]),

        answer: 8000,
      },

      {
        id: 2,

        item1Emoji: '🍿',
        item1Name: 'popcorn',
        item1Count: 4,
        item1Price: 7000,

        item2Emoji: '🥤',
        item2Name: 'cola',
        item2Count: 3,

        totalPrice: 43000,

        question:
          'Berapa harga 1 cola?',

        options: shuffleArray([
          3000,
          5000,
          7000,
        ]),

        answer: 5000,
      },

      {
        id: 3,

        item1Emoji: '🎨',
        item1Name: 'cat',
        item1Count: 3,
        item1Price: 9000,

        item2Emoji: '🖌️',
        item2Name: 'kuas',
        item2Count: 4,

        totalPrice: 47000,

        question:
          'Berapa harga 1 kuas?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },
    ],
  },

  {
    id: 7,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [

      {
        id: 1,

        item1Emoji: '🍔',
        item1Name: 'burger',
        item1Count: 5,
        item1Price: 9000,

        item2Emoji: '🍟',
        item2Name: 'kentang',
        item2Count: 4,

        totalPrice: 69000,

        question:
          'Berapa harga 1 kentang?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
      },

      {
        id: 2,

        item1Emoji: '📚',
        item1Name: 'komik',
        item1Count: 6,
        item1Price: 4000,

        item2Emoji: '✏️',
        item2Name: 'pulpen',
        item2Count: 5,

        totalPrice: 49000,

        question:
          'Berapa harga 1 pulpen?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },

      {
        id: 3,

        item1Emoji: '🧃',
        item1Name: 'susu',
        item1Count: 7,
        item1Price: 5000,

        item2Emoji: '🍪',
        item2Name: 'biskuit',
        item2Count: 3,

        totalPrice: 53000,

        question:
          'Berapa harga 1 biskuit?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
      },
    ],
  },

  {
    id: 8,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [

      {
        id: 1,

        item1Emoji: '⚽',
        item1Name: 'bola',
        item1Count: 4,
        item1Price: 10000,

        item2Emoji: '🥅',
        item2Name: 'gawang',
        item2Count: 2,

        totalPrice: 70000,

        question:
          'Berapa harga 1 gawang?',

        options: shuffleArray([
          12000,
          15000,
          18000,
        ]),

        answer: 15000,
      },

      {
        id: 2,

        item1Emoji: '🍜',
        item1Name: 'mie',
        item1Count: 5,
        item1Price: 6000,

        item2Emoji: '🥚',
        item2Name: 'telur',
        item2Count: 6,

        totalPrice: 60000,

        question:
          'Berapa harga 1 telur?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },

      {
        id: 3,

        item1Emoji: '🕹️',
        item1Name: 'stick',
        item1Count: 3,
        item1Price: 14000,

        item2Emoji: '🎮',
        item2Name: 'console',
        item2Count: 2,

        totalPrice: 82000,

        question:
          'Berapa harga 1 console?',

        options: shuffleArray([
          18000,
          20000,
          22000,
        ]),

        answer: 20000,
      },
    ],
  },

  {
    id: 9,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [

      {
        id: 1,

        item1Emoji: '🧋',
        item1Name: 'thai tea',
        item1Count: 6,
        item1Price: 7000,

        item2Emoji: '🍩',
        item2Name: 'donat',
        item2Count: 4,

        totalPrice: 70000,

        question:
          'Berapa harga 1 donat?',

        options: shuffleArray([
          6000,
          7000,
          8000,
        ]),

        answer: 7000,
      },

      {
        id: 2,

        item1Emoji: '🎒',
        item1Name: 'tas',
        item1Count: 2,
        item1Price: 20000,

        item2Emoji: '📓',
        item2Name: 'buku',
        item2Count: 5,

        totalPrice: 65000,

        question:
          'Berapa harga 1 buku?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },

      {
        id: 3,

        item1Emoji: '🍫',
        item1Name: 'coklat',
        item1Count: 8,
        item1Price: 3000,

        item2Emoji: '🍬',
        item2Name: 'permen',
        item2Count: 6,

        totalPrice: 54000,

        question:
          'Berapa harga 1 permen?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },
    ],
  },

  {
    id: 10,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [

      {
        id: 1,

        item1Emoji: '🚲',
        item1Name: 'sepeda',
        item1Count: 2,
        item1Price: 30000,

        item2Emoji: '🪖',
        item2Name: 'helm',
        item2Count: 4,

        totalPrice: 100000,

        question:
          'Berapa harga 1 helm?',

        options: shuffleArray([
          8000,
          10000,
          12000,
        ]),

        answer: 10000,
      },

      {
        id: 2,

        item1Emoji: '🍞',
        item1Name: 'roti',
        item1Count: 7,
        item1Price: 4000,

        item2Emoji: '🧈',
        item2Name: 'selai',
        item2Count: 3,

        totalPrice: 46000,

        question:
          'Berapa harga 1 selai?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
      },

      {
        id: 3,

        item1Emoji: '🎧',
        item1Name: 'headphone',
        item1Count: 3,
        item1Price: 17000,

        item2Emoji: '🔋',
        item2Name: 'baterai',
        item2Count: 5,

        totalPrice: 76000,

        question:
          'Berapa harga 1 baterai?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },
    ],
  },

  {
    id: 11,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 3,

    questions: [

      {
        id: 1,

        item1Emoji: '🍕',
        item1Name: 'pizza',
        item1Count: 3,
        item1Price: 15000,

        item2Emoji: '🥤',
        item2Name: 'soda',
        item2Count: 4,

        totalPrice: 69000,

        question:
          'Berapa harga 1 soda?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
      },

      {
        id: 2,

        item1Emoji: '📖',
        item1Name: 'novel',
        item1Count: 5,
        item1Price: 8000,

        item2Emoji: '🖊️',
        item2Name: 'pena',
        item2Count: 3,

        totalPrice: 55000,

        question:
          'Berapa harga 1 pena?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },

      {
        id: 3,

        item1Emoji: '🎈',
        item1Name: 'balon',
        item1Count: 6,
        item1Price: 3000,

        item2Emoji: '🎁',
        item2Name: 'kado',
        item2Count: 2,

        totalPrice: 38000,

        question:
          'Berapa harga 1 kado?',

        options: shuffleArray([
          9000,
          10000,
          11000,
        ]),

        answer: 10000,
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

        item1Emoji: '🐟',
        item1Name: 'ikan',
        item1Count: 4,
        item1Price: 12000,

        item2Emoji: '🍚',
        item2Name: 'nasi',
        item2Count: 5,

        totalPrice: 73000,

        question:
          'Berapa harga 1 nasi?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },

      {
        id: 2,

        item1Emoji: '🧸',
        item1Name: 'boneka',
        item1Count: 2,
        item1Price: 18000,

        item2Emoji: '🎀',
        item2Name: 'pita',
        item2Count: 4,

        totalPrice: 56000,

        question:
          'Berapa harga 1 pita?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },

      {
        id: 3,

        item1Emoji: '🍎',
        item1Name: 'apel',
        item1Count: 7,
        item1Price: 4000,

        item2Emoji: '🍇',
        item2Name: 'anggur',
        item2Count: 3,

        totalPrice: 46000,

        question:
          'Berapa harga 1 anggur?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
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

        item1Emoji: '⌚',
        item1Name: 'jam',
        item1Count: 3,
        item1Price: 20000,

        item2Emoji: '🔋',
        item2Name: 'baterai',
        item2Count: 4,

        totalPrice: 84000,

        question:
          'Berapa harga 1 baterai?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
      },

      {
        id: 2,

        item1Emoji: '🍔',
        item1Name: 'burger',
        item1Count: 4,
        item1Price: 10000,

        item2Emoji: '🥤',
        item2Name: 'cola',
        item2Count: 5,

        totalPrice: 70000,

        question:
          'Berapa harga 1 cola?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
      },

      {
        id: 3,

        item1Emoji: '📱',
        item1Name: 'tablet',
        item1Count: 2,
        item1Price: 25000,

        item2Emoji: '🎧',
        item2Name: 'earbud',
        item2Count: 6,

        totalPrice: 86000,

        question:
          'Berapa harga 1 earbud?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
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

        item1Emoji: '🍜',
        item1Name: 'ramen',
        item1Count: 5,
        item1Price: 7000,

        item2Emoji: '🥟',
        item2Name: 'dimsum',
        item2Count: 4,

        totalPrice: 59000,

        question:
          'Berapa harga 1 dimsum?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
      },

      {
        id: 2,

        item1Emoji: '🎮',
        item1Name: 'game',
        item1Count: 3,
        item1Price: 18000,

        item2Emoji: '🕹️',
        item2Name: 'joystick',
        item2Count: 2,

        totalPrice: 94000,

        question:
          'Berapa harga 1 joystick?',

        options: shuffleArray([
          18000,
          20000,
          22000,
        ]),

        answer: 20000,
      },

      {
        id: 3,

        item1Emoji: '🧃',
        item1Name: 'jus',
        item1Count: 6,
        item1Price: 5000,

        item2Emoji: '🍩',
        item2Name: 'donat',
        item2Count: 5,

        totalPrice: 65000,

        question:
          'Berapa harga 1 donat?',

        options: shuffleArray([
          6000,
          7000,
          8000,
        ]),

        answer: 7000,
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

        item1Emoji: '🚗',
        item1Name: 'mobil',
        item1Count: 2,
        item1Price: 40000,

        item2Emoji: '🛞',
        item2Name: 'ban',
        item2Count: 4,

        totalPrice: 120000,

        question:
          'Berapa harga 1 ban?',

        options: shuffleArray([
          8000,
          10000,
          12000,
        ]),

        answer: 10000,
      },

      {
        id: 2,

        item1Emoji: '🍰',
        item1Name: 'cake',
        item1Count: 3,
        item1Price: 15000,

        item2Emoji: '☕',
        item2Name: 'kopi',
        item2Count: 5,

        totalPrice: 75000,

        question:
          'Berapa harga 1 kopi?',

        options: shuffleArray([
          5000,
          6000,
          7000,
        ]),

        answer: 6000,
      },

      {
        id: 3,

        item1Emoji: '📷',
        item1Name: 'kamera',
        item1Count: 2,
        item1Price: 30000,

        item2Emoji: '💾',
        item2Name: 'memory card',
        item2Count: 4,

        totalPrice: 80000,

        question:
          'Berapa harga 1 memory card?',

        options: shuffleArray([
          4000,
          5000,
          6000,
        ]),

        answer: 5000,
      },
    ],
  },
];