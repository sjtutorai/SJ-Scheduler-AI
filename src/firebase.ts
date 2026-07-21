import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA11QIV3_-Yl5JylAXN3zlrKZ93FypRdnI",
  authDomain: "sj-schedular-ai.firebaseapp.com",
  projectId: "sj-schedular-ai",
  storageBucket: "sj-schedular-ai.firebasestorage.app",
  messagingSenderId: "1018585477464",
  appId: "1:1018585477464:web:cc69c93eb6f7603e31352d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
