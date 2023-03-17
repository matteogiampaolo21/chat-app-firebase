// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1gjZFVD51BMzuRPx9X82uRC-CU2bjzQE",
  authDomain: "my-chat-app-13594.firebaseapp.com",
  projectId: "my-chat-app-13594",
  storageBucket: "my-chat-app-13594.appspot.com",
  messagingSenderId: "980154490139",
  appId: "1:980154490139:web:6b6e84c2b261c1d1da87be",
  measurementId: "G-1TGM7495WK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();