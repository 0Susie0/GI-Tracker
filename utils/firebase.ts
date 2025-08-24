// utils/firebase.ts
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from 'firebase/auth';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// Your web app's Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAimzsZCjED_Ho-lsbpfej9V6dApGfdIgw",
  authDomain: "foodgi-bc42c.firebaseapp.com",
  projectId: "foodgi-bc42c",
  storageBucket: "foodgi-bc42c.appspot.com",
  messagingSenderId: "639715555947",
  appId: "1:639715555947:web:5a561254fa44b6b232cf2e",
  measurementId: "G-YX20W02FT6"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Auth (Firebase v12+ automatically uses AsyncStorage for persistence when available)
const auth: Auth = getAuth(app);

export { auth };
export default app;
