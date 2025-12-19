const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();
console.log('ENV DEBUG CHECK:');
console.log('PORT:', process.env.PORT);
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const path = require('path');

let db;

// Initialize Firebase Admin
try {
  let credential;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const serviceAccountPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('Loading credentials from:', serviceAccountPath);
    const serviceAccount = require(serviceAccountPath);
    console.log('Loaded Service Account Project ID:', serviceAccount.project_id);
    credential = admin.credential.cert(serviceAccount);

    admin.initializeApp({
      credential: credential,
      projectId: serviceAccount.project_id
    });
  } else {
    credential = admin.credential.applicationDefault();
    admin.initializeApp({
      credential: credential
    });
  }
  console.log('Firebase Admin Initialized successfully');
  db = admin.firestore();
} catch (error) {
  console.error('CRITICAL ERROR initializing Firebase Admin:', error);
  process.exit(1);
}

module.exports = { db };
