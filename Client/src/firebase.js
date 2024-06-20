// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-mern-e427c.firebaseapp.com",
  projectId: "real-estate-mern-e427c",
  storageBucket: "real-estate-mern-e427c.appspot.com",
  messagingSenderId: "969076129601",
  appId: "1:969076129601:web:61951c560178c0a6196bc0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
