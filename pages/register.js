// ============================================================
// pages/register.js
// Registration screen for Organizations
// ============================================================

import { registerUser } from '../utils/auth.js';
import { toast } from '../components/toast.js';

export function renderRegister() {
  return `
  <div class="bg-[#f4f4f4] min-h-[80vh] py-16">
    <div class="max-w-[640px] mx-auto px-8">
      <section class="carbon-card">
        <div class="mb-8">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#525252] mb-2">Daftar Akun CGMI</p>
          <h1 class="text-[2rem] font-[300] leading-[1.05] text-[#161616]">Registrasi Organisasi Publik</h1>
          <p class="text-sm text-[#525252] mt-4">Isi data organisasi Anda untuk mengakses asesmen dan memperoleh hasil tata kelola kolaborasi.</p>
        </div>

        <form id="register-form" class="space-y-6">
          <div class="carbon-field">
            <label for="reg-name">Nama Lengkap Narahubung</label>
            <input id="reg-name" type="text" required placeholder="Contoh: Budi Santoso" class="carbon-input">
          </div>
          <div class="carbon-field">
            <label for="reg-org">Nama Organisasi / Instansi Publik</label>
            <input id="reg-org" type="text" required placeholder="Contoh: Dinas Kesehatan Kabupaten Sumedang" class="carbon-input">
          </div>
          <div class="carbon-field">
            <label for="reg-email">Alamat Surel Resmi (Email)</label>
            <input id="reg-email" type="email" required placeholder="nama@organisasi.go.id" class="carbon-input">
          </div>
          <div class="carbon-field">
            <label for="reg-password">Kata Sandi (Min. 6 Karakter)</label>
            <input id="reg-password" type="password" required minlength="6" placeholder="••••••••" class="carbon-input">
          </div>
          <button type="submit" id="btn-reg-submit" class="carbon-button w-full">Daftar &amp; Masuk</button>
          <p class="text-sm text-[#525252]">
            Sudah memiliki akun? <a href="#/login" class="text-[#0f62fe] hover:text-[#0050e6]">Masuk</a>
          </p>
        </form>
      </section>
    </div>
  </div>
  `;
}

export function initRegister() {
  const form = document.getElementById('register-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name         = document.getElementById('reg-name').value;
      const organization = document.getElementById('reg-org').value;
      const email        = document.getElementById('reg-email').value;
      const password     = document.getElementById('reg-password').value;
      const submitBtn    = document.getElementById('btn-reg-submit');

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Mendaftar...';
        }
        await registerUser({ name, organization, email, password });
        
        // Buat modal notifikasi dinamis agar terlihat premium
        const modalDiv = document.createElement('div');
        modalDiv.className = 'fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md';
        modalDiv.innerHTML = `
          <div class="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-slate-100 transform scale-95 transition-all duration-300">
            <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto animate-bounce">
              ✉️
            </div>
            <div class="space-y-2">
              <h3 class="text-xl font-black text-slate-900">Verifikasi Email Anda</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Kami telah mengirimkan tautan verifikasi ke email <strong class="text-slate-700">${email}</strong>.<br>
                Silakan buka kotak masuk atau folder spam email Anda, lalu klik tautan tersebut untuk mengaktifkan akun Anda.
              </p>
            </div>
            <button id="btn-modal-close-reg"
              class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-200 transition-all">
              Saya Mengerti, Buka Halaman Login
            </button>
          </div>
        `;
        document.body.appendChild(modalDiv);

        // Pasang handler tombol tutup modal
        document.getElementById('btn-modal-close-reg').addEventListener('click', () => {
          modalDiv.remove();
          form.reset();
          window.location.hash = '/login';
        });

      } catch (err) {
        toast.error('Gagal melakukan pendaftaran: ' + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Daftar & Masuk';
        }
      }
    });
  }
}
