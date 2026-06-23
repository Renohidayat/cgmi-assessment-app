// ============================================================
// components/navbar.js
// Responsive top navigation bar (auth-aware)
// ============================================================

import { logout } from '../utils/auth.js';
import { toast } from './toast.js';

export function renderNavbar(currentUser, currentRole) {
  const isLoggedIn = !!currentUser;
  const isAdmin    = currentRole === 'admin';

  return `
  <nav id="main-navbar" class="carbon-topbar">
    <div class="carbon-topbar-inner">
      <a href="#/" id="nav-logo" class="carbon-brand">
        <strong class="carbon-brand-text">CGMI</strong>
        <span class="carbon-brand-subtitle">Collaboration Governance Maturity Index</span>
      </a>

      <div class="carbon-topbar-links hidden md:flex items-center gap-4">
        <a href="#/" id="nav-home" class="carbon-topbar-link">Beranda</a>
        <a href="#/about" id="nav-about" class="carbon-topbar-link">Tentang</a>
        ${isLoggedIn && !isAdmin ? `
        <a href="#/assessment" id="nav-assessment" class="carbon-topbar-link">Asesmen</a>
        <a href="#/dashboard" id="nav-dashboard" class="carbon-topbar-link">Hasil Saya</a>
        ` : ''}
        ${isAdmin ? `
        <a href="#/admin" id="nav-admin" class="carbon-topbar-link">Panel Admin</a>
        ` : ''}
      </div>

      <div class="flex items-center gap-3">
        ${isLoggedIn ? `
          <div class="hidden sm:flex items-center gap-3">
            <div class="carbon-topbar-avatar">
              <span>${(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}</span>
            </div>
            ${isAdmin ? `<span class="carbon-badge carbon-badge-admin">Admin</span>` : ''}
          </div>
          <button id="navbar-logout-btn" class="carbon-topbar-btn-secondary">
            Keluar
          </button>
        ` : `
          <a href="#/login" id="nav-login" class="carbon-topbar-btn-secondary">Masuk</a>
          <a href="#/register" id="nav-register" class="carbon-topbar-btn-primary">Daftar</a>
        `}

        <button id="nav-hamburger" class="carbon-topbar-hamburger" type="button">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>

    <div id="mobile-menu" class="carbon-topbar-mobile-menu hidden">
      <div class="px-4 py-3 space-y-2">
        <a href="#/" class="carbon-topbar-mobile-link">Beranda</a>
        <a href="#/about" class="carbon-topbar-mobile-link">Tentang</a>
        ${isLoggedIn && !isAdmin ? `
        <a href="#/assessment" class="carbon-topbar-mobile-link">Asesmen</a>
        <a href="#/dashboard" class="carbon-topbar-mobile-link">Hasil Saya</a>
        ` : ''}
        ${isAdmin ? `
        <a href="#/admin" class="carbon-topbar-mobile-link">Panel Admin</a>
        ` : ''}
      </div>
    </div>
  </nav>
  `;
}

export function initNavbar() {
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const logoutBtn  = document.getElementById('navbar-logout-btn');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await logout();
        toast.success('Anda telah berhasil keluar.');
        window.location.hash = '/';
      } catch (e) {
        toast.error('Gagal keluar: ' + e.message);
      }
    });
  }

  // Highlight active nav link
  const hash = window.location.hash || '#/';
  document.querySelectorAll('#main-navbar a[href]').forEach(a => {
    a.classList.remove('active-link');
    if (a.getAttribute('href') === hash || (hash === '#/' && a.getAttribute('href') === '#/')) {
      a.classList.add('active-link');
    }
  });
}
