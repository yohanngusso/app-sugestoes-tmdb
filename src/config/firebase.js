import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { GOOGLE_API_KEY } from '@env';

const firebaseConfig = {
  apiKey: GOOGLE_API_KEY,
  authDomain: "app-sugestoes.firebaseapp.com",
  projectId: "app-sugestoes",
  storageBucket: "app-sugestoes.firebasestorage.app",
  messagingSenderId: "788238131768",
  appId: "1:788238131768:web:fa18bfe81287d06cfd3ccd",
  measurementId: "G-TSTNWVGVVF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
