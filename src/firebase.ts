import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase の設定
const firebaseConfig = {
  apiKey: process.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.VITE_REACT_APP_FIREBASE_MEASUREMENT_ID
};

// console.log(firebaseConfig)

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firebaseServices = { auth, db };

export default firebaseServices;
