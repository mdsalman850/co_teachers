// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKdb6C8LL_uWzlvR2pVgyY2V77pgwnEUo",
  authDomain: "coteachers-e5345.firebaseapp.com",
  projectId: "coteachers-e5345",
  storageBucket: "coteachers-e5345.firebasestorage.app",
  messagingSenderId: "211606164055",
  appId: "1:211606164055:web:2813f0d0d8799e3ecb4912",
  measurementId: "G-HCXDGGNZ4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
