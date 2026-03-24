import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() || "555555",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || "playstori2026-b15fa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || "playstori2026-b15fa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || "playstori2026-b15fa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || "805359695981",
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() || "1:805359695981:web:c3a660f4a4ca69a4f0e764"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Works for both localhost and production — no code changes ever needed
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('YOUR_ENTERPRISE_SITE_KEY'),
  isTokenAutoRefreshEnabled: true,
});
