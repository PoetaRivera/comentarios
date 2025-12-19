const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

console.log('Credentials path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

try {
    const serviceAccount = require(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS));
    console.log('Service account loaded. Project ID:', serviceAccount.project_id);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase initialized.');

    const db = admin.firestore();

    db.collection('test').add({ timestamp: new Date() })
        .then(doc => {
            console.log('Successfully wrote to Firestore! ID:', doc.id);
            process.exit(0);
        })
        .catch(err => {
            console.error('Firestore Write Error:', err);
            process.exit(1);
        });

} catch (err) {
    console.error('Initialization Error:', err);
}
