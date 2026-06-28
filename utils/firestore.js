// ============================================================
// utils/firestore.js
// All Firestore CRUD operations
// ============================================================

import { db } from '../firebase-config.js';
import {
  collection, doc, addDoc, setDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, limit,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

function normalizeEmail(email = '') {
  return String(email || '').trim().toLowerCase();
}

// ═══════════════════════════════════════════════════════════
//  QUESTIONS
// ═══════════════════════════════════════════════════════════

export async function getQuestions() {
  const snap = await getDocs(collection(db, 'questions'));

  const dimensionOrder = {
    leadership: 1,
    decision: 2,
    transparency: 3,
    risk: 4,
    resource: 5,
    performance: 6,
  };

  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const dimA = dimensionOrder[a.dimensionKey] || 999;
      const dimB = dimensionOrder[b.dimensionKey] || 999;

      if (dimA !== dimB) return dimA - dimB;

      return (a.order || 0) - (b.order || 0);
    });
}

export async function addQuestion(data) {
  return await addDoc(collection(db, 'questions'), {
    ...data, createdAt: serverTimestamp(),
  });
}

export async function updateQuestion(id, data) {
  await updateDoc(doc(db, 'questions', id), data);
}

export async function deleteQuestion(id) {
  await deleteDoc(doc(db, 'questions', id));
}

/** Seed default questions if collection is empty. */
export async function seedQuestions(defaultQuestions) {
  const snap = await getDocs(collection(db, 'questions'));
  if (!snap.empty) return { seeded: false, count: snap.size };
  const promises = defaultQuestions.map(q =>
    setDoc(doc(db, 'questions', q.id), { ...q, createdAt: serverTimestamp() })
  );
  await Promise.all(promises);
  return { seeded: true, count: defaultQuestions.length };
}

// ═══════════════════════════════════════════════════════════
//  ASSESSMENTS
// ═══════════════════════════════════════════════════════════

export async function submitAssessment(data) {
  return await addDoc(collection(db, 'assessments'), {
    ...data, submittedAt: serverTimestamp(),
  });
}

export async function getUserAssessments(userId) {
  const q = query(collection(db, 'assessments'), where('userId', '==', userId), orderBy('submittedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getLatestAssessment(userId) {
  const q = query(
    collection(db, 'assessments'),
    where('userId', '==', userId),
    orderBy('submittedAt', 'desc'),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function getAllAssessments() {
  const q = query(collection(db, 'assessments'), orderBy('submittedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAssessmentById(id) {
  const snap = await getDoc(doc(db, 'assessments', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ═══════════════════════════════════════════════════════════
//  USERS
// ═══════════════════════════════════════════════════════════

export async function getUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function findUserByKodeAkses(kodeAkses) {
  const q = query(collection(db, 'users'), where('kodeAkses', '==', kodeAkses), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function saveUserProfile(uuid, data) {
  await setDoc(doc(db, 'users', uuid), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// ═══════════════════════════════════════════════════════════
//  ADMINS
// ═══════════════════════════════════════════════════════════

export async function getAllAdmins() {
  const snap = await getDocs(collection(db, 'admins'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addAdmin(uid, data) {
  const normalizedEmail = normalizeEmail(data?.email || '');
  await setDoc(doc(db, 'admins', uid), {
    uid,
    ...data,
    email: data?.email || '',
    emailLower: normalizedEmail,
    role: 'admin',
    addedAt: serverTimestamp(),
  });
}

export async function deleteAdmin(uid) {
  await deleteDoc(doc(db, 'admins', uid));
}

export async function isAdminEmail(email) {
  return !!(await getAdminByEmail(email));
}

export async function getAdminByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  // 1. Direct document fetch (since whitelist document ID is the email address)
  try {
    const directSnap = await getDoc(doc(db, 'admins', normalizedEmail));
    if (directSnap.exists()) {
      return { id: directSnap.id, ...directSnap.data() };
    }
  } catch (err) {
    console.warn("Gagal melakukan pencarian admin secara langsung, mencoba fallback query:", err);
  }

  // 2. Query fallback (for compatibility with legacy whitelist formats)
  const queries = [
    query(collection(db, 'admins'), where('emailLower', '==', normalizedEmail)),
    query(collection(db, 'admins'), where('email', '==', normalizedEmail)),
  ];

  for (const q of queries) {
    try {
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0];
        return { id: docData.id, ...docData.data() };
      }
    } catch (err) {
      console.error("Gagal melakukan query fallback:", err);
    }
  }

  return null;
}
