import * as admin from 'firebase-admin';

export async function readOCRResult(
  materialId: string
): Promise<string> {

  try {

    const bucket =
      admin.storage().bucket();

    // =========================
    // OCR output folder
    // =========================

    const prefix =
      `ocr-output/`;

    // =========================
    // Get OCR JSON files
    // =========================

    const [files] =
      await bucket.getFiles({
        prefix
      });

    if (!files.length) {

      throw new Error(
        'No OCR result files found'
      );
    }

    console.log(
      `Found ${files.length} OCR files`
    );

    let fullText = '';

    // =========================
    // Read every OCR JSON file
    // =========================

    for (const file of files) {

      // only JSON
      if (
        !file.name.endsWith('.json')
      ) {
        continue;
      }

      console.log(
        'Reading OCR file:',
        file.name
      );

      // download JSON
      const [contents] =
        await file.download();

      // parse JSON
      const jsonData =
        JSON.parse(
          contents.toString()
        );

      // =========================
      // Extract OCR text
      // =========================

      if (
        jsonData.responses
      ) {

        for (
          const response
          of jsonData.responses
        ) {

          const text =
            response
              ?.fullTextAnnotation
              ?.text;

          if (text) {

            fullText +=
              '\n' + text;
          }
        }
      }
    }

    // =========================
    // Cleanup OCR text
    // =========================

    fullText =
      fullText
        .replace(/\s+/g, ' ')
        .trim();

    console.log(
      'OCR text length:',
      fullText.length
    );

    // =========================
    // Save extracted text
    // =========================

    await admin
      .firestore()
      .collection('material')
      .doc(materialId)
      .update({
        extractedText:
          fullText
      });

    return fullText;

  } catch (error) {

    console.error(
      'READ OCR RESULT ERROR:',
      error
    );

    throw error;
  }
}