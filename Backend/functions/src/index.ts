import {setGlobalOptions} from "firebase-functions";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();
setGlobalOptions({ maxInstances: 10 });

export { adminCreateUser } from "./admin";
export { purchaseItem } from "./purchaseItem";
export { onMaterialCreated } from './triggers/onMaterialCreated';
