export type BahasaIsyaratLevel = {
  id: number;
  word: string;
  letters: string[];
  unlocked: boolean;
  stars: number;
};

export const bahasaIsyaratLevels: BahasaIsyaratLevel[] = [
  {
    id: 1,
    word: 'BAJU',
    letters: ['B', 'A', 'J', 'U'],
    unlocked: true,
    stars: 0,
  },

  {
    id: 2,
    word: 'MEJA',
    letters: ['M', 'E', 'J', 'A'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 3,
    word: 'PENSIL',
    letters: ['P', 'E', 'N', 'S', 'I', 'L'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 4,
    word: 'LAPTOP',
    letters: ['L', 'A', 'P', 'T', 'O', 'P'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 5,
    word: 'KAMERA',
    letters: ['K', 'A', 'M', 'E', 'R', 'A'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 6,
    word: 'JENDELA',
    letters: ['J', 'E', 'N', 'D', 'E', 'L', 'A'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 7,
    word: 'SEPATU',
    letters: ['S', 'E', 'P', 'A', 'T', 'U'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 8,
    word: 'GELAS',
    letters: ['G', 'E', 'L', 'A', 'S'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 9,
    word: 'KOMPUTER',
    letters: ['K', 'O', 'M', 'P', 'U', 'T', 'E', 'R'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 10,
    word: 'TELEVISI',
    letters: ['T', 'E', 'L', 'E', 'V', 'I', 'S', 'I'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 11,
    word: 'HANDPHONE',
    letters: ['H', 'A', 'N', 'D', 'P', 'H', 'O', 'N', 'E'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 12,
    word: 'KALKULATOR',
    letters: ['K', 'A', 'L', 'K', 'U', 'L', 'A', 'T', 'O', 'R'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 13,
    word: 'PERPUSTAKAAN',
    letters: ['P', 'E', 'R', 'P', 'U', 'S', 'T', 'A', 'K', 'A', 'A', 'N'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 14,
    word: 'MIKROSKOP',
    letters: ['M', 'I', 'K', 'R', 'O', 'S', 'K', 'O', 'P'],
    unlocked: false,
    stars: 0,
  },

  {
    id: 15,
    word: 'UNIVERSITAS',
    letters: ['U', 'N', 'I', 'V', 'E', 'R', 'S', 'I', 'T', 'A', 'S'],
    unlocked: false,
    stars: 0,
  },
];