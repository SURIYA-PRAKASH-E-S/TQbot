import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration object
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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Function to fetch user details
export const fetchUserDetails = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid); // Assuming user data is stored in the "users" collection
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.error("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
