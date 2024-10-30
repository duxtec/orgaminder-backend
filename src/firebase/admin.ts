/**
 * Initializes Firebase Admin SDK using the service account configuration.
 * This configuration enables secure access to Firebase services in the backend,
 * such as Firestore, Authentication, and Cloud Functions, as defined by the 
 * Firebase project in `firebase.json`.
 */
import * as serviceAccount from '@app/configs/firebase.json';
import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
