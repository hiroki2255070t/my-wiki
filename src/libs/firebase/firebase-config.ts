import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Node.jsでプログラムを実行するとき用
// dotenv.config();
// const firebaseConfig = {
//   apiKey: process.env.VITE_FIREBASE_API_KEY!,
//   authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.VITE_FIREBASE_APP_ID!,
// };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
