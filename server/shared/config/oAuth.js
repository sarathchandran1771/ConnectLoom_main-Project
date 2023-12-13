import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBhUQ5-8PuOgdIDWr3O2yjXYAxugOhqS5A",
  authDomain: "connectloom-auth.firebaseapp.com",
  projectId: "connectloom-auth",
  storageBucket: "connectloom-auth.appspot.com",
  messagingSenderId: "39004255604",
  appId: "1:39004255604:web:9e2ac9484d187735bc2821",
  measurementId: "G-DLCD9FRW4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth, provider}