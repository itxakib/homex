// integrations/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA64ERKMTRuF5dQRiQeoNE4xeDsUn70xKc",
  authDomain: "final-year-project-fbb60.firebaseapp.com",
  projectId: "final-year-project-fbb60",
  storageBucket: "final-year-project-fbb60.firebasestorage.app",
  messagingSenderId: "766223486811",
  appId: "1:766223486811:web:ca63c0c300591a56c8d47e",
  measurementId: "G-95BDRL7JRQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Export the services you'll use
export { app, db, auth };