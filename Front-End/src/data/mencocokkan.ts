export type MatchPair = {
  word: string;
  image: string;
};

export type MencocokkanLevel = {
  id: number;
  unlocked: boolean;
  pairs: MatchPair[];
};

/* 🔥 DATA ASLI (SOAL) */
const originalData: Omit<MencocokkanLevel, 'unlocked'>[] = [
  {
    id: 1,
    pairs: [
      { word: 'APPLE', image: '🍎' },
      { word: 'BANANA', image: '🍌' },
      { word: 'ORANGE', image: '🍊' },
      { word: 'GRAPE', image: '🍇' },
      { word: 'MANGO', image: '🥭' },
    ],
  },
  {
    id: 2,
    pairs: [
      { word: 'CAT', image: '🐱' },
      { word: 'DOG', image: '🐶' },
      { word: 'COW', image: '🐮' },
      { word: 'HORSE', image: '🐴' },
      { word: 'SHEEP', image: '🐑' },
    ],
  },
  {
    id: 3,
    pairs: [
      { word: 'CAR', image: '🚗' },
      { word: 'BIKE', image: '🚲' },
      { word: 'BUS', image: '🚌' },
      { word: 'TRAIN', image: '🚆' },
      { word: 'PLANE', image: '✈️' },
    ],
  },
  {
    id: 4,
    pairs: [
      { word: 'DOCTOR', image: '👨‍⚕️' },
      { word: 'TEACHER', image: '👩‍🏫' },
      { word: 'POLICE', image: '👮' },
      { word: 'CHEF', image: '👨‍🍳' },
      { word: 'FARMER', image: '👨‍🌾' },
    ],
  },
  {
    id: 5,
    pairs: [
      { word: 'BOOK', image: '📚' },
      { word: 'PEN', image: '✏️' },
      { word: 'BAG', image: '🎒' },
      { word: 'RULER', image: '📏' },
      { word: 'BOARD', image: '📋' },
    ],
  },
  {
    id: 6,
    pairs: [
      { word: 'SUN', image: '☀️' },
      { word: 'MOON', image: '🌙' },
      { word: 'STAR', image: '⭐' },
      { word: 'CLOUD', image: '☁️' },
      { word: 'RAIN', image: '🌧️' },
    ],
  },
  {
    id: 7,
    pairs: [
      { word: 'RED', image: '🟥' },
      { word: 'BLUE', image: '🟦' },
      { word: 'GREEN', image: '🟩' },
      { word: 'YELLOW', image: '🟨' },
      { word: 'BLACK', image: '⬛' },
    ],
  },
  {
    id: 8,
    pairs: [
      { word: 'FISH', image: '🐟' },
      { word: 'CRAB', image: '🦀' },
      { word: 'SHARK', image: '🦈' },
      { word: 'OCTOPUS', image: '🐙' },
      { word: 'DOLPHIN', image: '🐬' },
    ],
  },
  {
    id: 9,
    pairs: [
      { word: 'BALL', image: '⚽' },
      { word: 'RACKET', image: '🏸' },
      { word: 'GLOVE', image: '🥊' },
      { word: 'NET', image: '🥅' },
      { word: 'SHOE', image: '👟' },
    ],
  },
  {
    id: 10,
    pairs: [
      { word: 'CHAIR', image: '🪑' },
      { word: 'TABLE', image: '🪵' },
      { word: 'BED', image: '🛏️' },
      { word: 'SOFA', image: '🛋️' },
      { word: 'LAMP', image: '💡' },
    ],
  },
  {
    id: 11,
    pairs: [
      { word: 'PHONE', image: '📱' },
      { word: 'TV', image: '📺' },
      { word: 'LAPTOP', image: '💻' },
      { word: 'CAMERA', image: '📷' },
      { word: 'HEADSET', image: '🎧' },
    ],
  },
  {
    id: 12,
    pairs: [
      { word: 'PIZZA', image: '🍕' },
      { word: 'BURGER', image: '🍔' },
      { word: 'FRIES', image: '🍟' },
      { word: 'CAKE', image: '🍰' },
      { word: 'ICECREAM', image: '🍨' },
    ],
  },
  {
    id: 13,
    pairs: [
      { word: 'TREE', image: '🌳' },
      { word: 'FLOWER', image: '🌸' },
      { word: 'GRASS', image: '🌱' },
      { word: 'LEAF', image: '🍃' },
      { word: 'CACTUS', image: '🌵' },
    ],
  },
  {
    id: 14,
    pairs: [
      { word: 'KING', image: '🤴' },
      { word: 'QUEEN', image: '👸' },
      { word: 'KNIGHT', image: '🛡️' },
      { word: 'CROWN', image: '👑' },
      { word: 'CASTLE', image: '🏰' },
    ],
  },
  {
    id: 15,
    pairs: [
      { word: 'ROBOT', image: '🤖' },
      { word: 'ALIEN', image: '👽' },
      { word: 'UFO', image: '🛸' },
      { word: 'ASTRONAUT', image: '👨‍🚀' },
      { word: 'ROCKET', image: '🚀' },
    ],
  },
];

/* 🔥 FINAL DATA (SUDAH ADA UNLOCK SYSTEM) */
export const mencocokkanLevels: MencocokkanLevel[] =
  originalData.map((level, index) => ({
    ...level,
    unlocked: index < 2, // 🔓 hanya 2 level pertama terbuka
  }));