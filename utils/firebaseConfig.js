// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPWYEOb9wzNFG288f60IX-QcyIG6f4Pco",
  authDomain: "portfolio-builder-ebc0d.firebaseapp.com",
  projectId: "portfolio-builder-ebc0d",
  storageBucket: "portfolio-builder-ebc0d.appspot.com",
  messagingSenderId: "860081431458",
  appId: "1:860081431458:web:0ff43185e2cd543180c8fb",
  measurementId: "G-J6ZZHZ9B06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);