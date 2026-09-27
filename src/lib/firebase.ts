import { getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCVmYkaUKr003oDDjZVja98HpTf9ByrH44',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sohanmali-77014.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://sohanmali-77014-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sohanmali-77014',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sohanmali-77014.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '281655194324',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:281655194324:web:05833d65971ebbd5580141'
};

export const hasFirebaseConfig = Boolean(config.apiKey && config.databaseURL);
const app = hasFirebaseConfig ? (getApps()[0] ?? initializeApp(config)) : undefined;
export const database = app ? getDatabase(app) : undefined;
export const CONTENT_PATH = 'website/content';
