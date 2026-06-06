import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore | null = null;
let adminMessaging: admin.messaging.Messaging | null = null;

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace literal escaped newlines with actual newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      adminDb = admin.firestore();
      adminMessaging = admin.messaging();
      console.log('Firebase Admin initialized successfully');
    } else {
      console.warn('Firebase Admin skipped: FIREBASE_PRIVATE_KEY is missing (expected during build).');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
} else {
  adminDb = admin.firestore();
  adminMessaging = admin.messaging();
}

export { adminDb, adminMessaging };
