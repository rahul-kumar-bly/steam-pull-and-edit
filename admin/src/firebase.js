// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "steamfetch-login.firebaseapp.com",
  projectId: "steamfetch-login",
  storageBucket: "steamfetch-login.firebasestorage.app",
  messagingSenderId: "179524232928",
  appId: "1:179524232928:web:b45ec52670123169285285"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);