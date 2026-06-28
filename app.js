// ============================================================
// app.js
// Single Page Application Router, Route Guards, and Init
// Hybrid Auth: localStorage (User Kode Akses) + Firebase (Admin Google)
// ============================================================

import { onAuthStateChanged, getUserRole, getUserProfile, getUserSession } from './utils/auth.js';
import { renderNavbar, initNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';

// Page imports
import { renderHome, initHome } from './pages/home.js';
import { renderAbout, initAbout } from './pages/about.js';
import { renderLogin, initLogin } from './pages/login.js';
import { renderAssessment, initAssessment } from './pages/assessment.js';
import { renderDashboard, initDashboard } from './pages/dashboard.js';

// Admin page imports
import { renderAdminLayout } from './pages/admin/admin-layout.js';
import { renderAdminDashboard, initAdminDashboard } from './pages/admin/admin-dashboard.js';
import { renderAdminRespondents, initAdminRespondents } from './pages/admin/admin-respondents.js';
import { renderAdminQuestions, initAdminQuestions } from './pages/admin/admin-questions.js';
import { renderAdminAdmins, initAdminAdmins } from './pages/admin/admin-admins.js';

// Global state
let currentUser = null;
let currentRole = null;
let userProfile = null;

// Routing registry
const routes = {
  '/': { render: renderHome, init: initHome, auth: false },
  '/about': { render: renderAbout, init: initAbout, auth: false },
  '/login': { render: renderLogin, init: initLogin, auth: false, guestOnly: true },
  '/assessment': { render: renderAssessment, init: initAssessment, auth: false },
  '/dashboard': { render: renderDashboard, init: initDashboard, auth: false },
  
  // Admin route endpoints
  '/admin': { render: () => renderAdminLayout(renderAdminDashboard(), 'dashboard'), init: initAdminDashboard, auth: true, role: 'admin' },
  '/admin/respondents': { render: () => renderAdminLayout(renderAdminRespondents(), 'respondents'), init: initAdminRespondents, auth: true, role: 'admin' },
  '/admin/questions': { render: () => renderAdminLayout(renderAdminQuestions(), 'questions'), init: initAdminQuestions, auth: true, role: 'admin' },
  '/admin/admins': { render: () => renderAdminLayout(renderAdminAdmins(), 'admins'), init: initAdminAdmins, auth: true, role: 'admin' },
};

/**
 * Try loading user session from localStorage.
 * Returns true if a valid session was found.
 */
function loadLocalSession() {
  const session = getUserSession();
  if (session && session.uid) {
    currentUser = { uid: session.uid, displayName: session.jabatan };
    currentRole = 'user';
    userProfile = session;
    return true;
  }
  return false;
}

/** Handle client-side hash change routing with guard checks. */
async function handleRouting() {
  const rawHash = window.location.hash || '#/';
  let path = rawHash.replace(/^#/, '');
  if (!path.startsWith('/')) path = '/' + path;

  // Re-check localStorage if no active session (covers fresh login)
  if (!currentUser) {
    loadLocalSession();
  }

  // Detect logout: localStorage cleared but global state still set
  if (currentUser && currentRole === 'user' && !getUserSession()) {
    currentUser = null;
    currentRole = null;
    userProfile = null;
  }

  const route = routes[path];

  if (!route) {
    window.location.hash = '/';
    return;
  }

  // ── ROUTE GUARDS ──
  const isLoggedIn = !!currentUser;

  // 1. Guest-only guard (e.g. login/register)
  if (route.guestOnly && isLoggedIn) {
    if (currentRole === 'admin') {
      window.location.hash = '/admin';
    } else {
      window.location.hash = '/dashboard';
    }
    return;
  }

  // 2. Authentication check
  if (route.auth && !isLoggedIn) {
    window.location.hash = '/login';
    return;
  }

  // 3. Role authorization check
  if (route.auth && route.role && currentRole !== route.role) {
    if (route.role === 'admin' && currentRole !== 'admin') {
      window.location.hash = '/';
      return;
    }
  }

  // ── RENDER SHELL & VIEW ──
  const appRoot = document.getElementById('app');
  if (appRoot) {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      navbarContainer.innerHTML = renderNavbar(currentUser, currentRole);
      initNavbar();
    }

    appRoot.innerHTML = route.render(currentUser, currentRole);

    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      footerContainer.innerHTML = renderFooter();
    }

    if (route.init) {
      await route.init(currentUser, userProfile);
    }
  }
}

// ── Initialize Auth System ──
function initAuth() {
  // 1. Load localStorage session first (renders immediately)
  loadLocalSession();

  // 2. Listen for Firebase Auth changes (Admin Google login)
  onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      // Firebase Admin is active — override localStorage user
      currentUser = firebaseUser;
      try {
        currentRole = await getUserRole(firebaseUser.uid);
        userProfile = await getUserProfile(firebaseUser.uid);

        // If admin logged in via Google, clear any lingering user session
        if (currentRole === 'admin') {
          localStorage.removeItem('cgmi_user_session');
        }
      } catch (e) {
        console.error("Gagal mendapatkan metadata admin:", e);
        currentRole = null;
        userProfile = null;
      }
    } else {
      // Firebase logged out — try restoring localStorage session
      if (!loadLocalSession()) {
        currentUser = null;
        currentRole = null;
        userProfile = null;
      }
    }

    handleRouting();
  });

  // 3. Initial route
  handleRouting();
}

// Start the app
initAuth();

// Watch hash route changes
window.addEventListener('hashchange', handleRouting);
