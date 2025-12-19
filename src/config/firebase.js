const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();
console.log('ENV DEBUG CHECK:');
console.log('PORT:', process.env.PORT);
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const path = require('path');

let db;

// Initialize Firebase Admin
// Initialize Firebase Admin
try {
  let credential;

  // Check for distinct environment variables (Best for Vercel/Cloud hosting)
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    console.log('Initializing Firebase from Environment Variables');
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Handle newlines in private key which often get escaped in env vars
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    });
    // Check for Google Application Credentials File (Best for Local Dev)
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const serviceAccountPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('Loading credentials from file:', serviceAccountPath);
    const serviceAccount = require(serviceAccountPath);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // Fallback to default (e.g. GCloud environment)
    console.log('Using Application Default Credentials');
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential: credential
  });

  console.log('Firebase Admin Initialized successfully');
  db = admin.firestore();
} catch (error) {
  console.error('CRITICAL ERROR initializing Firebase Admin:', error);
  // Do not exit process in serverless (Vercel) as it might restart unnecessarily, 
  // but for express app it's usually fatal. We'll log and let it crash if needed.
  if (process.env.NODE_ENV !== 'production') process.exit(1);
}

module.exports = { db };
