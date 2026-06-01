import {
  Difficulty,
} from '../../utils/calculatedGameReward';

export type Question = {
  answer: string;
  image: string;
};

export type SiapakahAkuLevel = {
  id: number;
  questions: Question[];

  unlocked: boolean;
  stars: number;

  difficulty: Difficulty;
  totalQuestions: number;
};

export const siapakahAkuLevels:
SiapakahAkuLevel[] = [

  // ========================================
  // EASY
  // ========================================

  {
    id: 1,
    unlocked: true,
    stars: 0,
    difficulty: 'easy',
    totalQuestions: 5,

    questions: [
      { answer: 'SAPI', image: 'sapi' },
      { answer: 'KUDA', image: 'kuda' },
      { answer: 'IKAN', image: 'ikan' },
      { answer: 'AYAM', image: 'ayam' },
      { answer: 'BABI', image: 'babi' },
    ],
  },

  {
    id: 2,
    unlocked: false,
    stars: 0,
    difficulty: 'easy',
    totalQuestions: 5,

    questions: [
      { answer: 'ZEBRA', image: 'zebra' },
      { answer: 'PANDA', image: 'panda' },
      { answer: 'KOALA', image: 'koala' },
      { answer: 'KUCING', image: 'kucing' },
      { answer: 'MONYET', image: 'monyet' },
    ],
  },

  {
    id: 3,
    unlocked: false,
    stars: 0,
    difficulty: 'easy',
    totalQuestions: 5,

    questions: [
      { answer: 'GAJAH', image: 'gajah' },
      { answer: 'SINGA', image: 'singa' },
      { answer: 'BURUNG', image: 'burung' },
      { answer: 'KELINCI', image: 'kelinci' },
      { answer: 'KAMBING', image: 'kambing' },
    ],
  },

  {
    id: 4,
    unlocked: false,
    stars: 0,
    difficulty: 'easy',
    totalQuestions: 5,

    questions: [
      { answer: 'HARIMAU', image: 'harimau' },
      { answer: 'KANGURU', image: 'kanguru' },
      { answer: 'BUAYA', image: 'buaya' },
      { answer: 'MERPATI', image: 'merpati' },
      { answer: 'LUMBALUMBA', image: 'lumbalumba' },
    ],
  },

  {
    id: 5,
    unlocked: false,
    stars: 0,
    difficulty: 'easy',
    totalQuestions: 5,

    questions: [
      { answer: 'ORANGUTAN', image: 'orangutan' },
      { answer: 'KUDANIL', image: 'kudanil' },
      { answer: 'UNTA', image: 'unta' },
      { answer: 'BADAK', image: 'badak' },
      { answer: 'KOMODO', image: 'komodo' },
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
    totalQuestions: 5,

    questions: [
      { answer: 'JERAPAH', image: 'jerapah' },
      { answer: 'PENGUIN', image: 'penguin' },
      { answer: 'RUSA', image: 'rusa' },
      { answer: 'SERIGALA', image: 'serigala' },
      { answer: 'BERUANG', image: 'beruang' },
    ],
  },

  {
    id: 7,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 5,

    questions: [
      { answer: 'CHEETAH', image: 'cheetah' },
      { answer: 'FLAMINGO', image: 'flamingo' },
      { answer: 'TUPAI', image: 'tupai' },
      { answer: 'KURAKURA', image: 'kurakura' },
      { answer: 'RUBAH', image: 'rubah' },
    ],
  },

  {
    id: 8,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 5,

    questions: [
      { answer: 'KALAJENGKING', image: 'kalajengking' },
      { answer: 'BUNGLON', image: 'bunglon' },
      { answer: 'LANDAK', image: 'landak' },
      { answer: 'LOBSTER', image: 'lobster' },
      { answer: 'UDANG', image: 'udang' },
    ],
  },

  {
    id: 9,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 5,

    questions: [
      { answer: 'CUMICUMI', image: 'cumicumi' },
      { answer: 'GORILA', image: 'gorila' },
      { answer: 'KUKANG', image: 'kukang' },
      { answer: 'PELIKAN', image: 'pelikan' },
      { answer: 'TAPIR', image: 'tapir' },
    ],
  },

  {
    id: 10,
    unlocked: false,
    stars: 0,
    difficulty: 'medium',
    totalQuestions: 5,

    questions: [
      { answer: 'ARMADILLO', image: 'armadillo' },
      { answer: 'KUDALAUT', image: 'kudalaut' },
      { answer: 'BELALANG', image: 'belalang' },
      { answer: 'KELELAWAR', image: 'kelelawar' },
      { answer: 'BIAWAK', image: 'biawak' },
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
    totalQuestions: 5,

    questions: [
      { answer: 'TRENGGILING', image: 'trenggiling' },
      { answer: 'KAKATUA', image: 'kakatua' },
      { answer: 'ANGSA', image: 'angsa' },
      { answer: 'KEPITING', image: 'kepiting' },
      { answer: 'RAJAWALI', image: 'rajawali' },
    ],
  },

  {
    id: 12,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 5,

    questions: [
      { answer: 'PAUS', image: 'paus' },
      { answer: 'LELE', image: 'lele' },
      { answer: 'KERANG', image: 'kerang' },
      { answer: 'KERBAU', image: 'kerbau' },
      { answer: 'DOMBA', image: 'domba' },
    ],
  },

  {
    id: 13,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 5,

    questions: [
      { answer: 'CAPUNG', image: 'capung' },
      { answer: 'SEMUT', image: 'semut' },
      { answer: 'NYAMUK', image: 'nyamuk' },
      { answer: 'ULAR', image: 'ular' },
      { answer: 'KATAK', image: 'katak' },
    ],
  },

  {
    id: 14,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 5,

    questions: [
      { answer: 'PIRANHA', image: 'piranha' },
      { answer: 'MUSANG', image: 'musang' },
      { answer: 'TIKUS', image: 'tikus' },
      { answer: 'LABALABA', image: 'labalaba' },
      { answer: 'UBURUBUR', image: 'uburubur' },
    ],
  },

  {
    id: 15,
    unlocked: false,
    stars: 0,
    difficulty: 'hard',
    totalQuestions: 5,

    questions: [
      { answer: 'KECOAK', image: 'kecoak' },
      { answer: 'HAMSTER', image: 'hamster' },
      { answer: 'LEBAH', image: 'lebah' },
      { answer: 'ANJING', image: 'anjing' },
      { answer: 'DINOSAURUS', image: 'dinosaurus' },
    ],
  },
];