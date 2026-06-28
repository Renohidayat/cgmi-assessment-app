// ============================================================
// pages/login.js
// Login screen for Admin Google Auth (General user login has been removed)
// ============================================================

import { loginWithGoogle, getUserRole } from '../utils/auth.js';
import { toast } from '../components/toast.js';

export function renderLogin() {
  return `
  <div class="bg-[#f4f4f4] min-h-[80vh] py-16">
    <div class="max-w-[640px] mx-auto px-8">
      <section class="carbon-card">
        <div class="mb-8">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#525252] mb-2">Masuk Admin CGMI</p>
          <h1 class="text-[2rem] font-[300] leading-[1.05] text-[#161616]">Akses Panel Tim Peneliti (Admin)</h1>
          <p class="text-sm text-[#525252] mt-4">Silakan masuk menggunakan akun Google terdaftar untuk mengakses pengelolaan instrumen asesmen dan hasil responden.</p>
        </div>

        <div id="login-admin-section" class="space-y-6 pt-4">
          <div class="carbon-panel text-sm text-[#525252]">
            Hanya alamat Gmail tim peneliti yang telah terdaftar pada whitelist yang dapat mengakses Panel Admin ini.
          </div>
          <button id="btn-google-login" class="carbon-button w-full justify-center bg-[#0f62fe] flex items-center gap-2">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.65 4.5 1.8l2.4-2.4C17.3 1.8 14.9 1 12.24 1 6.64 1 2 5.64 2 11.24s4.64 10.24 10.24 10.24c5.79 0 10.24-4.1 10.24-10.24 0-.6-.05-1.15-.15-1.65h-10.09z"/>
            </svg>
            Masuk dengan Akun Google
          </button>
        </div>
      </section>
    </div>
  </div>
  `;
}

export function initLogin() {
  const googleBtn = document.getElementById('btn-google-login');

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        const { user } = await loginWithGoogle();
        const role = await getUserRole(user.uid);

        if (role === 'admin') {
          toast.success(`Selamat datang Admin: ${user.displayName || user.email}`);
          window.location.hash = '/admin';
        } else {
          toast.warning('Anda terdaftar, namun peran Anda bukan admin.');
          window.location.hash = '/dashboard';
        }
      } catch (err) {
        toast.error(err.message);
      }
    });
  }
}
