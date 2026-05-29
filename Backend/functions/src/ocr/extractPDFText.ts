import vision from '@google-cloud/vision';

import {
  readOCRResult
} from './readOCRResult';

export async function extractPdfText(
  materialId: string,
  gcsSourceUri: string
): Promise<string> {

  const client =
    new vision.ImageAnnotatorClient();

  const outputUri =
    'gs://lucia-4b190.appspot.com/ocr-output/';

  const request = {

    requests: [
      {
        inputConfig: {
          mimeType: 'application/pdf',

          gcsSource: {
            uri: gcsSourceUri
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
            uri: outputUri
          },

          batchSize: 1
        }
      }
    ]
  };

  console.log(
    'Starting Vision OCR...'
  );

  const [operation] =
    await client.asyncBatchAnnotateFiles(
      request as any
    );

  console.log(
    'Waiting OCR operation...'
  );

  await operation.promise();

  console.log(
    'OCR completed'
  );

  // =========================
  // Read OCR JSON result
  // =========================

  const extractedText =
    await readOCRResult(
      materialId
    );

  return extractedText;
}