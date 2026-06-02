import * as admin from 'firebase-admin';
import {extractPdfText} from '../ocr/extractPDFText';
import {cleanupOCRResult} from '../ocr/cleanupOCRResult';
import {generateQuizFromText} from '../ai/generateQuiz';

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

    console.log(
      'Cleaning old OCR files...'
    );

    await cleanupOCRResult();

    console.log(
      'Old OCR cleaned'
    );

    const bucketName =
      'lucia-4b190.firebasestorage.app';

    const gcsUri =
      `gs://${bucketName}/${storagePath}`;

    console.log(
      'GCS URI:',
      gcsUri
    );

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

    const cleanedQuiz =
      rawQuiz
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

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

    if (
      !Array.isArray(quizData)
    ) {

      throw new Error(
        'Quiz result is not an array'
      );
    }

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