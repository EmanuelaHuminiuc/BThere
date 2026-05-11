import { initializeApp } from "firebase/app";
import { initializeAuth} from "firebase/auth";
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxx.firebaseapp.com",
  projectId: "xxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxx.appspot.com",
  messagingSenderId: "xxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, { experimentalForceLongPolling: true });
export const auth = initializeAuth(app, { experimentalForceLongPolling: true });
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });
export const storage = getStorage(app);
export {app}