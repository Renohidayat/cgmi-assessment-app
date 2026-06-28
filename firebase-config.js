// ============================================================
// firebase-config.js
// CGMI – Collaboration Governance Maturity Index
// ============================================================
// ⚠️  IMPORTANT: Replace the values below with your own
//    Firebase project configuration from the Firebase Console.
//    Go to: Project Settings → General → Your apps → SDK setup
// ============================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCWznT-WRGXz1Smz4bBFyei2YS800Q0QOk",
  authDomain: "cgmi-assessmentt.firebaseapp.com",
  projectId: "cgmi-assessmentt",
  storageBucket: "cgmi-assessmentt.firebasestorage.app",
  messagingSenderId: "278440968248",
  appId: "1:278440968248:web:daabc7c333b840c907e6cd",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
