// ============================================================
// pages/login.js
// Login screen supporting Organization email/pwd and Admin Google Auth
// ============================================================

import { loginWithEmail, loginWithGoogle, getUserRole } from '../utils/auth.js';
import { toast } from '../components/toast.js';

export function renderLogin() {
  return `
  <div class="bg-[#f4f4f4] min-h-[80vh] py-16">
    <div class="max-w-[640px] mx-auto px-8">
      <section class="carbon-card">
        <div class="mb-8">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#525252] mb-2">Masuk CGMI</p>
          <h1 class="text-[2rem] font-[300] leading-[1.05] text-[#161616]">Akses Platform Evaluasi Tata Kelola Kolaborasi</h1>
          <p class="text-sm text-[#525252] mt-4">Masuk dengan akun organisasi publik untuk mengelola asesmen atau dengan akun Google terdaftar untuk akses admin.</p>
        </div>

        <div class="carbon-tabs mb-8" role="tablist">
          <button id="tab-user" class="active" type="button">Organisasi Publik</button>
          <button id="tab-admin" type="button">Tim Peneliti (Admin)</button>
        </div>

        <form id="login-user-form" class="space-y-8">
          <div class="carbon-field">
            <label for="login-email">Surel Resmi (Email)</label>
            <input id="login-email" type="email" required placeholder="nama@organisasi.go.id" class="carbon-input">
          </div>
          <div class="carbon-field">
            <label for="login-password">Kata Sandi</label>
            <input id="login-password" type="password" required placeholder="••••••••" class="carbon-input">
          </div>
          <button type="submit" id="btn-login-submit" class="carbon-button w-full">Masuk ke Dasbor</button>
          <p class="text-sm text-[#525252]">
            Belum terdaftar? <a href="#/register" class="text-[#0f62fe] hover:text-[#0050e6]">Buat Akun Asesmen</a>
          </p>
        </form>

        <div id="login-admin-section" class="hidden space-y-6 pt-8 border-t border-[#e0e0e0]">
          <div class="carbon-panel text-sm text-[#525252]">Hanya alamat Gmail tim peneliti yang terdaftar pada whitelist yang dapat masuk ke Panel Admin.</div>
          <button id="btn-google-login" class="carbon-button w-full justify-center bg-[#0f62fe]">Masuk dengan Akun Google</button>
        </div>
      </section>
    </div>
  </div>
  `;
}

export function initLogin() {
  const tabUser    = document.getElementById('tab-user');
  const tabAdmin   = document.getElementById('tab-admin');
  const userForm   = document.getElementById('login-user-form');
  const adminSec   = document.getElementById('login-admin-section');
  const googleBtn  = document.getElementById('btn-google-login');

  // Tab switching
  if (tabUser && tabAdmin && userForm && adminSec) {
    tabUser.addEventListener('click', () => {
      tabUser.className = "w-1/2 pb-4 px-1 text-center border-b-2 border-blue-600 font-bold text-sm text-blue-600";
      tabAdmin.className = "w-1/2 pb-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-slate-500 hover:text-slate-700 hover:border-slate-300";
      userForm.classList.remove('hidden');
      adminSec.classList.add('hidden');
    });

    tabAdmin.addEventListener('click', () => {
      tabAdmin.className = "w-1/2 pb-4 px-1 text-center border-b-2 border-blue-600 font-bold text-sm text-blue-600";
      tabUser.className = "w-1/2 pb-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-slate-500 hover:text-slate-700 hover:border-slate-300";
      adminSec.classList.remove('hidden');
      userForm.classList.add('hidden');
    });
  }

  // Normal User login submit
  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass  = document.getElementById('login-password').value;
      const submitBtn = document.getElementById('btn-login-submit');

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Masuk...';
        }
        const user = await loginWithEmail(email, pass);
        const role = await getUserRole(user.uid);

        if (role === 'admin') {
          toast.success('Selamat datang Admin ' + (user.displayName || user.email));
          window.location.hash = '/admin';
        } else {
          toast.success('Masuk berhasil.');
          window.location.hash = '/dashboard';
        }
      } catch (err) {
        toast.error('Email atau kata sandi salah: ' + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Masuk ke Dasbor';
        }
      }
    });
  }

  // Google Login (Admin)
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        const { user } = await loginWithGoogle();
        toast.success(`Selamat datang Admin: ${user.displayName || user.email}`);
        window.location.hash = '/admin';
      } catch (err) {
        toast.error(err.message);
      }
    });
  }
}
