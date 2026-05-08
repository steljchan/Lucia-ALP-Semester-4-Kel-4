export type SiapakahAkuLevel = {
  id: number;
  answer: string;
  image: string;
  unlocked: boolean;
  stars: number; // ⭐ tambahan
};

/* 🔥 DATA ASLI */
const originalData: Omit<SiapakahAkuLevel, 'unlocked' | 'stars'>[] = [
  { id: 1, answer: "KOALA", image: "koala" },
  { id: 2, answer: "SAPI", image: "sapi" },
  { id: 3, answer: "KUCING", image: "kucing" },
  { id: 4, answer: "AYAM", image: "ayam" },
  { id: 5, answer: "GAJAH", image: "gajah" },
  { id: 6, answer: "KUDA", image: "kuda" },
  { id: 7, answer: "ZEBRA", image: "zebra" },
  { id: 8, answer: "PANDA", image: "panda" },
  { id: 9, answer: "MONYET", image: "monyet" },
  { id: 10, answer: "BURUNG", image: "burung" },
  { id: 11, answer: "IKAN", image: "ikan" },
  { id: 12, answer: "HARIMAU", image: "harimau" },
  { id: 13, answer: "KAMBING", image: "kambing" },
  { id: 14, answer: "KELINCI", image: "kelinci" },
  { id: 15, answer: "SINGA", image: "singa" },
];

/* 🔥 GENERATE LEVEL */
export const siapakahAkuLevels: SiapakahAkuLevel[] = originalData.map(
  (level, index) => ({
    ...level,
    unlocked: index < 3, 
    stars: 0,
  })
);