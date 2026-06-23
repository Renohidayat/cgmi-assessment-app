// ============================================================
// utils/auth.js
// Authentication helpers (Email/Password + Google OAuth)
// ============================================================

import { auth, db, googleProvider } from '../firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  signOut,
  onAuthStateChanged as _onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc, setDoc, getDoc, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { addAdmin, isAdminEmail } from './firestore.js';

// ── Register new user (dengan Verifikasi Email) ──────────────────────
export async function registerUser({ name, organization, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  
  // 1. Kirim Email Verifikasi
  await sendEmailVerification(user);

  // 2. Simpan profil ke Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid, name, organization, email, role: 'user',
    createdAt: serverTimestamp(),
  });

  // 3. Keluarkan user secara paksa agar tidak langsung login sebelum verifikasi
  await signOut(auth);
  return user;
}

// ── Login (Wajib memvalidasi apakah Email sudah diverifikasi) ─────────
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  // Cek apakah email sudah diverifikasi
  if (!user.emailVerified) {
    // Jika belum diverifikasi, keluarkan paksa dan lempar error
    await signOut(auth);
    throw new Error('Email Anda belum diverifikasi. Silakan periksa kotak masuk email Anda untuk melakukan verifikasi terlebih dahulu.');
  }

  return user;
}

// ── Google Sign-In (admin flow) ──────────────────────────────
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;

  // First try: check admins collection by UID
  const adminRef = doc(db, 'admins', user.uid);
  const adminSnap = await getDoc(adminRef);

  if (adminSnap.exists()) {
    return { user, adminData: adminSnap.data() };
  }

  // Fallback: allow whitelist by email (admins registered earlier with email-only)
  if (user.email) {
    const emailWhitelisted = await isAdminEmail(user.email);
    if (emailWhitelisted) {
      // Create admin document keyed by UID for future quick checks
      await addAdmin(user.uid, { name: user.displayName || '', email: user.email });
      const createdSnap = await getDoc(adminRef);
      return { user, adminData: createdSnap.exists() ? createdSnap.data() : { uid: user.uid, name: user.displayName || '', email: user.email } };
    }
  }

  // Not whitelisted by UID nor by email
  await signOut(auth);
  throw new Error('Akun Google Anda tidak terdaftar sebagai admin. Hubungi tim peneliti untuk mendapatkan akses.');
}

// ── Logout ───────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ── Get current user role from Firestore ─────────────────────
export async function getUserRole(uid) {
  // Check admin first
  const adminSnap = await getDoc(doc(db, 'admins', uid));
  if (adminSnap.exists()) return 'admin';

  // Check regular user
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) return userSnap.data().role || 'user';

  return null;
}

// ── Get full user profile ────────────────────────────────────
export async function getUserProfile(uid) {
  const adminSnap = await getDoc(doc(db, 'admins', uid));
  if (adminSnap.exists()) return { ...adminSnap.data(), role: 'admin' };

  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) return userSnap.data();

  return null;
}

// ── Auth state change listener ───────────────────────────────
export function onAuthStateChanged(callback) {
  return _onAuthStateChanged(auth, callback);
}
