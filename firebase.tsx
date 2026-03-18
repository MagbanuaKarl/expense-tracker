// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9-S88CHqcJrQbL6_7bVM61qiBNTdonv4",
  authDomain: "expense-tracker-2635b.firebaseapp.com",
  projectId: "expense-tracker-2635b",
  storageBucket: "expense-tracker-2635b.firebasestorage.app",
  messagingSenderId: "1011893297676",
  appId: "1:1011893297676:web:65405744a4283527018429",
  measurementId: "G-D7CC7Y613E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);