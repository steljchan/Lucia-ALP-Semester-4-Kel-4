import * as admin from 'firebase-admin';

import {
  pdfToImages
} from '../ocr/pdfToImages';

import {
  extractTextFromImage
} from '../ocr/extractText';

import {
  generateQuizFromText
} from '../ai/generateQuiz';

export async function processMaterial(
  materialId: string,
  fileUrl: string
) {

  try {

    console.log(
      'Starting OCR process...'
    );

    // =========================
    // 1. Convert PDF to images
    // =========================

    const imagePaths =
      await pdfToImages(fileUrl);

    console.log(
      `Converted ${imagePaths.length} pages`
    );

    // =========================
    // 2. OCR every page
    // =========================

    let fullText = '';

    for (const imagePath of imagePaths) {

      console.log(
        'OCR page:',
        imagePath
      );

      const text =
        await extractTextFromImage(
          imagePath
        );

      fullText += '\n' + text;
    }

    // =========================
    // 3. Save OCR text
    // =========================

    await admin
      .firestore()
      .collection('material')
      .doc(materialId)
      .update({
        extractedText: fullText
      });

    console.log(
      'OCR completed'
    );

    // =========================
    // 4. Generate Quiz with Gemini
    // =========================

    console.log(
      'Generating quiz...'
    );

    const rawQuiz =
      await generateQuizFromText(
        fullText
      );

    // =========================
    // 5. Clean Gemini response
    // =========================

    const cleanedQuiz =
      rawQuiz
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    // =========================
    // 6. Parse JSON
    // =========================

    let quizData;

    try {

      quizData =
        JSON.parse(cleanedQuiz);

    } catch (error) {

      console.error(
        'JSON Parse Error:',
        cleanedQuiz
      );

      throw new Error(
        'Failed to parse quiz JSON'
      );
    }

    // =========================
    // 7. Save quiz
    // =========================

    await admin
      .firestore()
      .collection('material')
      .doc(materialId)
      .update({
        quiz: quizData,
        quizGeneratedAt:
          admin.firestore.FieldValue.serverTimestamp()
      });

    console.log(
      'Quiz generated successfully'
    );

  } catch (error) {

    console.error(
      'PROCESS MATERIAL ERROR:',
      error
    );

    throw error;
  }
}