import * as admin
  from 'firebase-admin';

export async function readOCRResult(
  materialId: string
): Promise<string> {

  // =========================
  // OCR OUTPUT BUCKET
  // =========================

  const bucket =
    admin.storage().bucket(
      'lucia-ocr-output'
    );

  // =========================
  // OCR FOLDER PREFIX
  // =========================

  const prefix =
    `${materialId}/`;

  console.log(
    'Reading OCR files from:',
    prefix
  );

  // =========================
  // GET FILES
  // =========================

  const [files] =
    await bucket.getFiles({
      prefix
    });

  if (
    !files ||
    files.length === 0
  ) {

    throw new Error(
      'No OCR result files found'
    );
  }

  console.log(
    'OCR files found:',
    files.map(f => f.name)
  );

  // =========================
  // FIND JSON FILES
  // =========================

  const jsonFiles =
    files.filter(file =>
      file.name.endsWith('.json')
    );

  if (
    jsonFiles.length === 0
  ) {

    throw new Error(
      'No OCR JSON files found'
    );
  }

  // =========================
  // READ ALL JSON FILES
  // =========================

  let fullText = '';

  for (const file of jsonFiles) {

    console.log(
      'Reading file:',
      file.name
    );

    const [content] =
      await file.download();

    const parsed =
      JSON.parse(
        content.toString()
      );

    const responses =
      parsed.responses || [];

    for (const response of responses) {

      const text =
        response.fullTextAnnotation?.text;

      if (text) {

        fullText +=
          '\n' + text;
      }
    }
  }

  // =========================
  // VALIDATION
  // =========================

  if (
    fullText.trim().length === 0
  ) {

    throw new Error(
      'OCR text empty'
    );
  }

  console.log(
    'OCR text length:',
    fullText.length
  );

  return fullText;
}

