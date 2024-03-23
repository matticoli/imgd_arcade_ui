// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1SJ8EX3whDi3Nn554FxJPJQZYDECDBMc",
  authDomain: "imgd-arcade.firebaseapp.com",
  projectId: "imgd-arcade",
  storageBucket: "imgd-arcade.appspot.com",
  messagingSenderId: "19034314277",
  appId: "1:19034314277:web:aaf8a526a01016acc951cc",
  measurementId: "G-GC8SPCQQWV"
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
