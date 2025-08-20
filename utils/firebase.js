// utils/firebase.js

// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
// Do NOT import getAnalytics in React Native

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAimzsZCjED_Ho-lsbpfej9V6dApGfdIgw",
  authDomain: "foodgi-bc42c.firebaseapp.com",
  projectId: "foodgi-bc42c",
  storageBucket: "foodgi-bc42c.appspot.com", // fixed typo: should be .appspot.com
  messagingSenderId: "639715555947",
  appId: "1:639715555947:web:5a561254fa44b6b232cf2e",
  measurementId: "G-YX20W02FT6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
export default app;