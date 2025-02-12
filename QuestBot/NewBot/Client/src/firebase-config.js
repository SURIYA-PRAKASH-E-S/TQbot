// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // Import Realtime Database

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtwRfg2Fbr6YQEBZvt5_LV2zj6N8e7SpI",
    authDomain: "playturf-f6809.firebaseapp.com",
    projectId: "playturf-f6809",
    storageBucket: "playturf-f6809.firebasestorage.app",
    messagingSenderId: "391548622984",
    appId: "1:391548622984:web:9eae2ecf7d97b7ece9e73d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Realtime Database
const database = getDatabase(app); // Initialize Realtime Database

// Export Firestore, Auth, and Realtime Database
export { db, auth, database };
