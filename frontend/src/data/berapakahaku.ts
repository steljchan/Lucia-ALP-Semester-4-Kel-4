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
};

/*
  FORMAT RUPIAH
*/
export const formatRupiah = (value: number) => {
  return `Rp${value.toLocaleString('id-ID')}`;
};

export const berapakahAkuLevels: BerapakahAkuLevel[] = [
  {
    id: 1,
    unlocked: true,
    stars: 0,
    questions: [
      {
        id: 1,
        item1Emoji: '🍎',
        item1Name: 'apel',
        item1Count: 2,
        item1Price: 4000,

        item2Emoji: '🍊',
        item2Name: 'jeruk',
        item2Count: 1,

        totalPrice: 11000,

        question: 'Berapa harga 1 jeruk?',

        options: [2000, 3000, 4000],
        answer: 3000,
      },

      {
        id: 2,
        item1Emoji: '🍌',
        item1Name: 'pisang',
        item1Count: 3,
        item1Price: 2000,

        item2Emoji: '🍇',
        item2Name: 'anggur',
        item2Count: 1,

        totalPrice: 10000,

        question: 'Berapa harga 1 anggur?',

        options: [3000, 4000, 5000],
        answer: 4000,
      },

      {
        id: 3,
        item1Emoji: '🍓',
        item1Name: 'stroberi',
        item1Count: 2,
        item1Price: 5000,

        item2Emoji: '🥝',
        item2Name: 'kiwi',
        item2Count: 1,

        totalPrice: 16000,

        question: 'Berapa harga 1 kiwi?',

        options: [4000, 5000, 6000],
        answer: 6000,
      },
    ],
  },

  // LEVEL SELANJUTNYA
  ...Array.from({ length: 14 }, (_, index) => {
    const base = (index + 1) * 1000;

    return {
      id: index + 2,
      unlocked: false,
      stars: 0,

      questions: [
        {
          id: 1,

          item1Emoji: '🍔',
          item1Name: 'burger',

          item1Count: 2 + index,
          item1Price: 6000 + base,

          item2Emoji: '🍟',
          item2Name: 'kentang',
          item2Count: 1,

          totalPrice:
            (2 + index) * (6000 + base) +
            (5000 + base),

          question: 'Berapa harga 1 kentang?',

          options: [
            4000 + base,
            5000 + base,
            6000 + base,
          ],

          answer: 5000 + base,
        },

        {
          id: 2,

          item1Emoji: '🧃',
          item1Name: 'jus',

          item1Count: 3 + index,
          item1Price: 3000 + base,

          item2Emoji: '🍪',
          item2Name: 'kue',
          item2Count: 1,

          totalPrice:
            (3 + index) * (3000 + base) +
            (4000 + base),

          question: 'Berapa harga 1 kue?',

          options: [
            3000 + base,
            4000 + base,
            5000 + base,
          ],

          answer: 4000 + base,
        },

        {
          id: 3,

          item1Emoji: '🍇',
          item1Name: 'anggur',

          item1Count: 2 + index,
          item1Price: 5000 + base,

          item2Emoji: '🍉',
          item2Name: 'semangka',
          item2Count: 1,

          totalPrice:
            (2 + index) * (5000 + base) +
            (6000 + base),

          question: 'Berapa harga 1 semangka?',

          options: [
            5000 + base,
            6000 + base,
            7000 + base,
          ],

          answer: 6000 + base,
        },
      ],
    };
  }),
];