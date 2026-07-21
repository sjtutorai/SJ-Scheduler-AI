import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection } from "firebase/firestore";

// Real Firebase Web App configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyB8aa8oLRtyLJGS6_-lFWs6cqZOejORjTE",
  authDomain: "abiding-composition-k9ffs.firebaseapp.com",
  projectId: "abiding-composition-k9ffs",
  storageBucket: "abiding-composition-k9ffs.firebasestorage.app",
  messagingSenderId: "526552560400",
  appId: "1:526552560400:web:2f74a3ef42d21dd35ceb95"
};

const databaseId = "ai-studio-sjschedularai-718dd8b7-ca06-49f7-a1cd-e7836b5fdad4";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, databaseId);

export {
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection
};

