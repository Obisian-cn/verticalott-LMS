import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import fs from 'fs';
import path from 'path';

let app;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    let serviceAccount;
    // Check if it looks like a JSON string
    if (process.env.FIREBASE_SERVICE_ACCOUNT.trim().startsWith('{')) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      // Treat as a file path
      const filePath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
      serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    app = initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    app = initializeApp();
  }
} catch (error: any) {
  console.error("Firebase Admin Initialization Error:", error.message || error);
  try {
    app = getApp();
  } catch (getAppError) {
    console.error("Critical: Could not initialize or retrieve Firebase App.");
    // We export a dummy so compilation doesn't fail, but it will fail on use
    app = null as any; 
  }
}

export const firebaseAdmin = {
  auth: () => getAuth(app)
};
