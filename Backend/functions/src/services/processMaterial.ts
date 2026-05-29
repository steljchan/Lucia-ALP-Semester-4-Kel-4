import * as admin from 'firebase-admin';

import {
  extractPdfText
} from '../ocr/extractPDFText';

import {
  cleanupOCRResult
} from '../ocr/cleanupOCRResult';

import {
  generateQuizFromText
} from '../ai/generateQuiz';

export async function processMaterial(
  materialId: string,
  storagePath: string
) {

  try {

    console.log(
      '================================='
    );

    console.log(
      'STARTING MATERIAL PROCESS'
    );

    console.log(
      'Material ID:',
      materialId
    );

    // =========================
    // 1. CLEAN OLD OCR FILES
    // =========================

    console.log(
      'Cleaning old OCR files...'
    );

    await cleanupOCRResult();

    console.log(
      'Old OCR cleaned'
    );

    // =========================
    // 2. CONVERT STORAGE PATH
    //    TO GCS URI
    // =========================

    const bucketName =
      'lucia-4b190.appspot.com';

    const gcsUri =
      `gs://${bucketName}/${storagePath}`;

    console.log(
      'GCS URI:',
      gcsUri
    );

    // =========================
    // 3. START OCR PROCESS
    // =========================

    await admin
      .firestore()
      .collection('material')
      .doc(materialId)
      .update({
        aiStatus: 'ocr-processing'
      });

    console.log(
      'Starting Vision OCR...'
    );

    const fullText =
      await extractPdfText(
        materialId,
        gcsUri
      );

    console.log(
      'OCR completed'
    );

    console.log(
      'Extracted text length:',
      fullText.length
    );

    // =========================
    // 4. SAVE OCR RESULT
    // =========================

    await admin
      .firestore()
      .collection('material')
      .doc(materialId)
      .update({

        extractedText:
          fullText,

        ocrCompletedAt:
          admin.firestore.FieldValue.serverTimestamp(),

        aiStatus:
          'ocr-completed'
      });

    // =========================
    // 5. GENERATE QUIZ
    // =========================

    console.log(
      'Generating quiz with Gemini...'
    );

    await admin
      .firestore()
      .collection('material')
      .doc(materialId)
      .update({
        aiStatus:
          'generating-quiz'
      });

    const rawQuiz =
      await generateQuizFromText(
        fullText
      );

    // =========================
    // 6. CLEAN GEMINI RESPONSE
    // =========================

    const cleanedQuiz =
      rawQuiz
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    // =========================
    // 7. PARSE QUIZ JSON
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
    // 8. VALIDATE QUIZ ARRAY
    // =========================

    if (
      !Array.isArray(quizData)
    ) {

      throw new Error(
        'Quiz result is not an array'
      );
    }

    // =========================
    // 9. SAVE QUIZ
    // =========================

    await admin
      .firestore()
      .collection('material')
      .doc(materialId)
      .update({

        quiz: quizData,

        aiStatus:
          'completed',

        quizGeneratedAt:
          admin.firestore.FieldValue.serverTimestamp()
      });

    console.log(
      'Quiz generated successfully'
    );

    console.log(
      '================================='
    );

  } catch (error) {

    console.error(
      'PROCESS MATERIAL ERROR:',
      error
    );

    await admin
      .firestore()
      .collection('material')
      .doc(materialId)
      .update({

        aiStatus:
          'failed',

        aiError:
          error instanceof Error
            ? error.message
            : 'Unknown error',

        failedAt:
          admin.firestore.FieldValue.serverTimestamp()
      });

    throw error;
  }
}