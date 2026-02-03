// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMwgdZu5cO56s9hC4Yl7Cxpy5ypJfcbyc",
  authDomain: "login-auth-2d07d.firebaseapp.com",
  projectId: "login-auth-2d07d",
  storageBucket: "login-auth-2d07d.firebasestorage.app",
  messagingSenderId: "446922491548",
  appId: "1:446922491548:web:eb36a6a1d112eeb83bcf59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
