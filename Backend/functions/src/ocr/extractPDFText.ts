import vision
  from '@google-cloud/vision';

import {
  readOCRResult
} from './readOCRResult';

// =========================
// GLOBAL CLIENT
// =========================

let client: any = null;

function getVisionClient() {

  if (!client) {

    client =
      new vision.ImageAnnotatorClient();
  }

  return client;
}

export async function extractPdfText(
  materialId: string,
  gcsSourceUri: string
): Promise<string> {

  // =========================
  // GET CLIENT
  // =========================

  const visionClient =
    getVisionClient();

  // =========================
  // OCR OUTPUT BUCKET
  // =========================

  const outputUri =
    `gs://lucia-ocr-output/${materialId}/`;

  // =========================
  // OCR REQUEST
  // =========================

  const request = {

    requests: [
      {

        inputConfig: {

          mimeType:
            'application/pdf',

          gcsSource: {

            uri:
              gcsSourceUri
          }
        },

        features: [
          {
            type:
              'DOCUMENT_TEXT_DETECTION'
          }
        ],

        outputConfig: {

          gcsDestination: {

            uri:
              outputUri
          },

          batchSize: 1
        }
      }
    ]
  };

  console.log(
    '================================='
  );

  console.log(
    'STARTING OCR PROCESS'
  );

  console.log(
    'Material ID:',
    materialId
  );

  console.log(
    'Source URI:',
    gcsSourceUri
  );

  console.log(
    'Output URI:',
    outputUri
  );

  // =========================
  // START OCR
  // =========================

  console.log(
    'Sending OCR request...'
  );

  const [operation] =
    await visionClient.asyncBatchAnnotateFiles(
      request as any
    );

  console.log(
    'OCR operation started'
  );

  // =========================
  // WAIT OCR COMPLETE
  // =========================

  console.log(
    'Waiting OCR completion...'
  );

  await operation.promise();

  console.log(
    'OCR completed successfully'
  );

  // =========================
  // READ OCR RESULT
  // =========================

  console.log(
    'Reading OCR JSON result...'
  );

  const extractedText =
    await readOCRResult(
      materialId
    );

  console.log(
    'OCR text extracted'
  );

  console.log(
    'Extracted text length:',
    extractedText.length
  );

  console.log(
    '================================='
  );

  // =========================
  // VALIDATION
  // =========================

  if (
    !extractedText ||
    extractedText.trim().length === 0
  ) {

    throw new Error(
      'OCR extracted empty text'
    );
  }

  return extractedText;
}

