// ============================================================
// app.js
// Single Page Application Router, Route Guards, and Init
// ============================================================

import { onAuthStateChanged, getUserRole, getUserProfile } from './utils/auth.js';
import { renderNavbar, initNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';

// Page imports
import { renderHome, initHome } from './pages/home.js';
import { renderAbout, initAbout } from './pages/about.js';
import { renderLogin, initLogin } from './pages/login.js';
import { renderRegister, initRegister } from './pages/register.js';
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
  '/register': { render: renderRegister, init: initRegister, auth: false, guestOnly: true },
  '/assessment': { render: renderAssessment, init: initAssessment, auth: true, role: 'user' },
  '/dashboard': { render: renderDashboard, init: initDashboard, auth: true, role: 'user' },
  
  // Admin route endpoints
  '/admin': { render: () => renderAdminLayout(renderAdminDashboard(), 'dashboard'), init: initAdminDashboard, auth: true, role: 'admin' },
  '/admin/respondents': { render: () => renderAdminLayout(renderAdminRespondents(), 'respondents'), init: initAdminRespondents, auth: true, role: 'admin' },
  '/admin/questions': { render: () => renderAdminLayout(renderAdminQuestions(), 'questions'), init: initAdminQuestions, auth: true, role: 'admin' },
  '/admin/admins': { render: () => renderAdminLayout(renderAdminAdmins(), 'admins'), init: initAdminAdmins, auth: true, role: 'admin' },
};

/**
 * Handle client-side hash change routing with guard checks.
 */
async function handleRouting() {
  const rawHash = window.location.hash || '#/';
  // Strip trailing slashes and hash prefix
  let path = rawHash.replace(/^#/, '');
  if (!path.startsWith('/')) path = '/' + path;

  // Find exact matching route
  const route = routes[path];

  if (!route) {
    // Route not found fallback
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
    // Admins can view user dashboards if desired, but user accounts cannot view admin panels
    if (route.role === 'admin' && currentRole !== 'admin') {
      window.location.hash = '/';
      return;
    }
  }

  // ── RENDER SHELL & VIEW ──
  const appRoot = document.getElementById('app');
  if (appRoot) {
    // Render top navigation
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      navbarContainer.innerHTML = renderNavbar(currentUser, currentRole);
      initNavbar();
    }

    // Render page body
    appRoot.innerHTML = route.render(currentUser, currentRole);

    // Render footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      footerContainer.innerHTML = renderFooter();
    }

    // Initialize controller actions for page
    if (route.init) {
      await route.init(currentUser, userProfile);
    }
  }
}

// Subscribe to auth state updates
onAuthStateChanged(async (user) => {
  currentUser = user;
  if (user) {
    // Hanya proses profiling jika email sudah diverifikasi ATAU akun adalah admin
    if (user.emailVerified) {
      try {
        currentRole = await getUserRole(user.uid);
        userProfile = await getUserProfile(user.uid);
      } catch (e) {
        console.error("Gagal mendapatkan metadata profil pengguna:", e);
        currentRole = 'user';
      }
    } else {
      // Jika email belum diverifikasi, paksa logout secara aman untuk mencegah error query database
      currentRole = null;
      userProfile = null;
    }
  } else {
    currentRole = null;
    userProfile = null;
  }
  
  // Re-run routing when auth state transitions
  handleRouting();
});

// Watch hash routes changes
window.addEventListener('hashchange', handleRouting);
