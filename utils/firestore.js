// ============================================================
// utils/firestore.js
// All Firestore CRUD operations
// ============================================================

import { db } from '../firebase-config.js';
import {
  collection, doc, addDoc, setDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, limit,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ═══════════════════════════════════════════════════════════
//  QUESTIONS
// ═══════════════════════════════════════════════════════════

export async function getQuestions() {
  const q    = query(collection(db, 'questions'), orderBy('dimensionKey'), orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
  const q    = query(collection(db, 'assessments'), where('userId', '==', userId), orderBy('submittedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getLatestAssessment(userId) {
  const q    = query(
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
  const q    = query(collection(db, 'assessments'), orderBy('submittedAt', 'desc'));
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

// ═══════════════════════════════════════════════════════════
//  ADMINS
// ═══════════════════════════════════════════════════════════

export async function getAllAdmins() {
  const snap = await getDocs(collection(db, 'admins'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addAdmin(uid, data) {
  await setDoc(doc(db, 'admins', uid), {
    uid, ...data, role: 'admin', addedAt: serverTimestamp(),
  });
}

export async function deleteAdmin(uid) {
  await deleteDoc(doc(db, 'admins', uid));
}

export async function isAdminEmail(email) {
  const q    = query(collection(db, 'admins'), where('email', '==', email));
  const snap = await getDocs(q);
  return !snap.empty;
}
