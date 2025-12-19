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

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  // Check for distinct environment variables (Best for Vercel/Cloud hosting)
  if (projectId && privateKey && clientEmail) {
    console.log('Inicializando Firebase desde Variables de Entorno');
    credential = admin.credential.cert({
      projectId: projectId,
      clientEmail: clientEmail,
      // Handle newlines in private key which often get escaped in env vars
      privateKey: privateKey.replace(/\\n/g, '\n')
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Check for Google Application Credentials File (Best for Local Dev)
    const serviceAccountPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('Cargando credenciales desde archivo:', serviceAccountPath);
    const serviceAccount = require(serviceAccountPath);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // Fallback to default (e.g. GCloud environment)
    console.log('ADVERTENCIA: Usando "Application Default Credentials". Esto fallará en Vercel si no se configuran las variables correctas.');
    console.log('Variables de entorno detectadas:');
    console.log('- FIREBASE_PROJECT_ID:', projectId ? 'DEFINIDO' : 'FALTANTE');
    console.log('- FIREBASE_CLIENT_EMAIL:', clientEmail ? 'DEFINIDO' : 'FALTANTE');
    console.log('- FIREBASE_PRIVATE_KEY:', privateKey ? 'DEFINIDO' : 'FALTANTE');

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
