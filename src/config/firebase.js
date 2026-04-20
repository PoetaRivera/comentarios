const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

let db;

// Initialize Firebase Admin
// Initialize Firebase Admin
try {
  let credential;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  // Check for distinct environment variables (Best for Vercel/Cloud hosting)
  if (projectId && privateKey && clientEmail) {
    credential = admin.credential.cert({
      projectId: projectId,
      clientEmail: clientEmail,
      // Handle newlines in private key which often get escaped in env vars
      privateKey: privateKey.replace(/\\n/g, '\n')
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const serviceAccountPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const serviceAccount = require(serviceAccountPath);
    credential = admin.credential.cert(serviceAccount);
  } else {
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential: credential
  });

  db = admin.firestore();
} catch (error) {
  console.error('CRITICAL ERROR initializing Firebase Admin:', error);
  // Do not exit process in serverless (Vercel) as it might restart unnecessarily, 
  // but for express app it's usually fatal. We'll log and let it crash if needed.
  if (process.env.NODE_ENV !== 'production') process.exit(1);
}

module.exports = { db };
