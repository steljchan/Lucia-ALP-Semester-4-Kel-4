import {
  onDocumentCreated
} from 'firebase-functions/v2/firestore';

import * as admin
  from 'firebase-admin';

import {
  processMaterial
} from '../services/processMaterial';

export const onMaterialCreated =
  onDocumentCreated(
    'material/{materialId}',

    async (event) => {

      try {

        const snapshot =
          event.data;

        if (!snapshot) {
          return;
        }

        const data =
          snapshot.data();

        const materialId =
          event.params.materialId;

        console.log(
          'New material detected:',
          materialId
        );

        if (!data.storagePath) {

          console.log(
            'No storagePath found'
          );

          await admin
            .firestore()
            .collection('material')
            .doc(materialId)
            .update({
              aiStatus: 'failed',
              aiError:
                'storagePath missing'
            });

          return;
        }

        await admin
          .firestore()
          .collection('material')
          .doc(materialId)
          .update({
            aiStatus: 'processing',
            processingStartedAt:
              admin.firestore.FieldValue.serverTimestamp()
          });

        await processMaterial(
          materialId,
          data.storagePath
        );

        await admin
          .firestore()
          .collection('material')
          .doc(materialId)
          .update({
            aiStatus: 'completed',

            processingCompletedAt:
              admin.firestore.FieldValue.serverTimestamp()
          });

        console.log(
          'Material processed successfully'
        );

      } catch (error) {

        console.error(
          'TRIGGER ERROR:',
          error
        );

        const materialId =
          event.params.materialId;

        await admin
          .firestore()
          .collection('material')
          .doc(materialId)
          .update({
            aiStatus: 'failed',

            aiError:
              error instanceof Error
                ? error.message
                : 'Unknown error',

            processingFailedAt:
              admin.firestore.FieldValue.serverTimestamp()
          });
      }
    }
  );