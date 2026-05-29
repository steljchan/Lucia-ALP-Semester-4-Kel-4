import * as admin from 'firebase-admin';

export async function cleanupOCRResult() {

  try {

    const bucket =
      admin.storage().bucket();

    // =========================
    // OCR Output Folder
    // =========================

    const prefix =
      'ocr-output/';

    // =========================
    // Get OCR Files
    // =========================

    const [files] =
      await bucket.getFiles({
        prefix
      });

    if (!files.length) {

      console.log(
        'No OCR files to cleanup'
      );

      return;
    }

    console.log(
      `Cleaning ${files.length} OCR files`
    );

    // =========================
    // Delete Every File
    // =========================

    for (const file of files) {

      try {

        await file.delete();

        console.log(
          'Deleted:',
          file.name
        );

      } catch (error) {

        console.error(
          'Failed deleting:',
          file.name,
          error
        );
      }
    }

    console.log(
      'OCR cleanup completed'
    );

  } catch (error) {

    console.error(
      'CLEANUP OCR ERROR:',
      error
    );

    throw error;
  }
}