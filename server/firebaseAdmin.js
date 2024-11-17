const admin = require('firebase-admin');

// Load the service account key JSON file
const serviceAccount = require('./serviceAccountKey.json'); // Replace with actual path

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://surfshop-129bd.firebaseio.com', // Replace with your Firestore database URL
  });
}

const firestore = admin.firestore(); // Initialize Firestore

module.exports = firestore; // Export Firestore instance
