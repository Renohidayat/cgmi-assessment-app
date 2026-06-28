// ============================================================
// utils/auth.js
// Authentication helpers (Kode Akses for Users + Google OAuth for Admin)
// ============================================================

import { auth, db, googleProvider } from '../firebase-config.js';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged as _onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc, setDoc, getDoc, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { addAdmin, getAdminByEmail, deleteAdmin, findUserByKodeAkses } from './firestore.js';

// ── Generate random 6-digit Kode Akses ──────────────────────────────
function generateKodeAkses() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ── Generate simple UUID v4 ─────────────────────────────────────────
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ── Register new user (Kode Akses – no email/password) ──────────────
export async function registerUser({ instansi, lamaBekerja, jabatan }) {
  const uuid = generateUUID();
  const kodeAkses = generateKodeAkses();

  await setDoc(doc(db, 'users', uuid), {
    uid: uuid,
    instansi,
    lamaBekerja,
    jabatan,
    kodeAkses,
    role: 'user',
    createdAt: serverTimestamp(),
  });

  return { uuid, kodeAkses, instansi, lamaBekerja, jabatan };
}

// ── Login with Kode Akses ───────────────────────────────────────────
export async function loginWithKodeAkses(kodeAkses) {
  const userProfile = await findUserByKodeAkses(kodeAkses);
  if (!userProfile) {
    throw new Error('Kode Akses tidak ditemukan. Pastikan kode yang Anda masukkan benar.');
  }
  return userProfile;
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

  // Fallback: allow whitelist by email (including manually added admins whose doc ID differs from auth UID)
  if (user.email) {
    const adminRecord = await getAdminByEmail(user.email);
    if (adminRecord) {
      const fallbackName = adminRecord.name || user.displayName || '';
      const fallbackEmail = adminRecord.email || user.email;
      await addAdmin(user.uid, {
        name: fallbackName,
        email: fallbackEmail,
      });

      // Delete the email-based whitelist document to avoid duplicate admin records in list
      if (adminRecord.id && adminRecord.id !== user.uid) {
        try {
          await deleteAdmin(adminRecord.id);
        } catch (e) {
          console.error("Gagal menghapus whitelist email lama:", e);
        }
      }

      const createdSnap = await getDoc(adminRef);
      return {
        user,
        adminData: createdSnap.exists()
          ? createdSnap.data()
          : { uid: user.uid, name: fallbackName, email: fallbackEmail },
      };
    }
  }

  // Not whitelisted by UID nor by email
  await signOut(auth);
  throw new Error('Akun Google Anda tidak terdaftar sebagai admin. Hubungi tim peneliti untuk mendapatkan akses.');
}

// ── Logout (Admin – Firebase signOut) ─────────────────────────
export async function logout() {
  await signOut(auth);
}

// ── Logout User (clear localStorage) ──────────────────────────
export function logoutUser() {
  localStorage.removeItem('cgmi_user_session');
}

// ── Save user session to localStorage ─────────────────────────
export function saveUserSession(profile) {
  localStorage.setItem('cgmi_user_session', JSON.stringify(profile));
}

// ── Get user session from localStorage ────────────────────────
export function getUserSession() {
  try {
    const raw = localStorage.getItem('cgmi_user_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Get current user role from Firestore ─────────────────────
export async function getUserRole(uid) {
  // Check admin first by UID
  const adminSnap = await getDoc(doc(db, 'admins', uid));
  if (adminSnap.exists()) return 'admin';

  // Check admin by current authenticated user's email
  const currentUserEmail = auth.currentUser?.email;
  if (currentUserEmail) {
    const adminEmailSnap = await getDoc(doc(db, 'admins', currentUserEmail.toLowerCase()));
    if (adminEmailSnap.exists()) return 'admin';
  }

  // Check regular user
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) return userSnap.data().role || 'user';

  return null;
}

// ── Get full user profile ────────────────────────────────────
export async function getUserProfile(uid) {
  const adminSnap = await getDoc(doc(db, 'admins', uid));
  if (adminSnap.exists()) return { ...adminSnap.data(), role: 'admin' };

  const currentUserEmail = auth.currentUser?.email;
  if (currentUserEmail) {
    const adminEmailSnap = await getDoc(doc(db, 'admins', currentUserEmail.toLowerCase()));
    if (adminEmailSnap.exists()) return { ...adminEmailSnap.data(), role: 'admin' };
  }

  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) return userSnap.data();

  return null;
}

// ── Auth state change listener ───────────────────────────────
export function onAuthStateChanged(callback) {
  return _onAuthStateChanged(auth, callback);
}
