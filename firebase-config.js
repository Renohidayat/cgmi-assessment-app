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
  apiKey: "AIzaSyCHsUYe1_4a2xY-rdQmncZTtyKAOQvr27I",
  authDomain: "cgmi-assessment.firebaseapp.com",
  projectId: "cgmi-assessment",
  storageBucket: "cgmi-assessment.firebasestorage.app",
  messagingSenderId: "918751923543",
  appId: "1:918751923543:web:5cd816f2900db6a72bc212",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
