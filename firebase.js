// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNWy9AzeWo8A1zDCgj_ck-vK-32KhCo2c",
  authDomain: "love-notes-839de.firebaseapp.com",
  projectId: "love-notes-839de",
  storageBucket: "love-notes-839de.firebasestorage.app",
  messagingSenderId: "731912640820",
  appId: "1:731912640820:web:cec457412d2ad686e06d61",
  measurementId: "G-EYW0X3BS48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);