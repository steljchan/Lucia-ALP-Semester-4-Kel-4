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

        // validation
        if (!data.fileUrl) {

          console.log(
            'No fileUrl found'
          );

          return;
        }

        // update status
        await admin
          .firestore()
          .collection('material')
          .doc(materialId)
          .update({
            aiStatus: 'processing'
          });

        // process material
        await processMaterial(
          materialId,
          data.fileUrl
        );

        // success
        await admin
          .firestore()
          .collection('material')
          .doc(materialId)
          .update({
            aiStatus: 'completed'
          });

      } catch (error) {

        console.error(error);

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
                : 'Unknown error'
          });
      }
    }
  );