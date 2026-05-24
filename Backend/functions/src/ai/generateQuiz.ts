import { GoogleGenerativeAI } from "@google/generative-ai";

// Jangan inisialisasi genAI di sini secara global!

export async function generateQuizFromText(text: string) {
  // 1. Ambil API Key di dalam scope fungsi
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  // 2. Inisialisasi SDK di dalam fungsi
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
Buatkan 10 soal pilihan ganda berdasarkan materi berikut.

TARGET PENGGUNA:
- Anak tunarungu SMP/SMA
- Gunakan bahasa sederhana
- Hindari kalimat terlalu panjang
- Hindari istilah rumit
- Fokus pada pemahaman visual dan konsep inti
- Pertanyaan harus jelas dan mudah dipahami
- Jangan ambigu
- Jangan menggunakan majas atau kalimat abstrak

ATURAN:
- Bahasa Indonesia
- Setiap soal harus memiliki 4 pilihan:
  A, B, C, D
- Jawaban benar HARUS bervariasi
- Jangan jadikan semua jawaban "A"
- Acak jawaban benar antara A-D
- Soal harus sesuai materi
- Jangan terlalu sulit
- Jangan beri penjelasan tambahan
- Jangan gunakan markdown
- Jangan gunakan \`\`\`
- Balas HANYA JSON ARRAY VALID

Format:

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

Materi:
${text}
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // =========================
  // CLEAN RESPONSE
  // =========================
  const cleaned = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  // =========================
  // PARSE JSON
  // =========================
  let parsedQuiz;
  try {
    parsedQuiz = JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed parsing Gemini JSON:', cleaned);
    throw new Error('Invalid JSON from Gemini');
  }

  // =========================
  // VALIDATE QUIZ
  // =========================
  const validAnswers = ['A', 'B', 'C', 'D'];
  const validatedQuiz = parsedQuiz.map((item: any) => {
    return {
      question: typeof item.question === 'string' ? item.question : '',
      options: Array.isArray(item.options) ? item.options.slice(0, 4) : [],
      answer: validAnswers.includes(item.answer) ? item.answer : 'A'
    };
  });

  // =========================
  // DISTRIBUTION CHECK
  // =========================
  const answerCounts = { A: 0, B: 0, C: 0, D: 0 };
  validatedQuiz.forEach((quiz: any) => {
    answerCounts[quiz.answer as keyof typeof answerCounts]++;
  });

  console.log('Answer Distribution:', answerCounts);

  return JSON.stringify(validatedQuiz);
}