import { GoogleGenAI } from "@google/genai";

export async function generateQuizFromText(
  text: string
) {

  // =========================
  // API KEY
  // =========================

  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {

    throw new Error(
      "GEMINI_API_KEY is missing"
    );
  }

  // =========================
  // INIT AI
  // =========================

  const ai =
    new GoogleGenAI({
      apiKey
    });

  // =========================
  // PROMPT
  // =========================

  const prompt = `
Buatkan 10 soal pilihan ganda berdasarkan materi berikut.

TARGET PENGGUNA:
- Anak tunarungu SMP/SMA
- Gunakan bahasa sederhana
- Hindari istilah rumit
- Pertanyaan harus jelas
- Jangan ambigu
- Kalimat pendek
- Fokus pada inti materi

ATURAN:
- Bahasa Indonesia
- Setiap soal memiliki 4 pilihan:
  A, B, C, D
- Jawaban benar harus bervariasi
- Jangan gunakan markdown
- Jangan gunakan \`\`\`
- Balas HANYA JSON ARRAY VALID

FORMAT:

[
  {
    "question": "Apa fungsi jantung?",
    "options": [
      "A. Memompa darah",
      "B. Mencerna makanan",
      "C. Mengatur tulang",
      "D. Menghasilkan urin"
    ],
    "answer": "A"
  }
]

MATERI:
${text}
`;

  // =========================
  // GENERATE
  // =========================

  console.log(
    "Generating quiz..."
  );

  const result =
    await ai.models.generateContent({

      model: "gemini-2.5-flash-lite",

      contents:
        prompt
    });

  const response =
    result.text;

  console.log(
    "Quiz generated"
  );

  // =========================
  // CLEAN RESPONSE
  // =========================

  const cleaned =
    response
      ?.replace(/```json/g, '')
      ?.replace(/```/g, '')
      ?.trim();

  // =========================
  // PARSE JSON
  // =========================

  let parsedQuiz;

  try {

    parsedQuiz =
      JSON.parse(cleaned || '');

  } catch (error) {

    console.error(
      "Invalid JSON:",
      cleaned
    );

    throw new Error(
      "Failed parsing Gemini JSON"
    );
  }

  // =========================
  // VALIDATE
  // =========================

  if (
    !Array.isArray(parsedQuiz)
  ) {

    throw new Error(
      "Quiz is not array"
    );
  }

  return JSON.stringify(
    parsedQuiz
  );
}