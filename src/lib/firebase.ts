// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "coral-stay",
  appId: "1:688019306281:web:50ce282c28d1f2770ea938",
  storageBucket: "coral-stay.firebasestorage.app",
  apiKey: "AIzaSyCh5DN5YRtF4A3fV21k5VhUvoc1ayQWBUQ",
  authDomain: "coral-stay.firebaseapp.com",
  messagingSenderId: "688019306281"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
