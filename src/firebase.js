// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8OjMo8rjJQvPiFOV2-vRUtqs1bfeq-tc",
  authDomain: "surfshop-129bd.firebaseapp.com",
  projectId: "surfshop-129bd",
  storageBucket: "surfshop-129bd.appspot.com",
  messagingSenderId: "810008289670",
  appId: "1:810008289670:web:e915f9bbc56dd85515cc07",
  measurementId: "G-2Y2EN2C64S" // Optional for Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app); // Get the auth instance
const db = getFirestore(app); // Initialize Firestore

export { auth, db }; // Export the auth instance and Firestore
