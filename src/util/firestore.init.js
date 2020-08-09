import admin from 'firebase-admin';

const serviceAccount = require('../../appointex-firebase-adminsdk.json');

let db;

export default function getDatabase() {
  try {
    if (db) {
      return db;
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://the-appointex-project.firebaseio.com',
    });

    db = admin.firestore();

    return db;
  } catch (e) {
    console.error(e.stack);
    return null;
  }
}
