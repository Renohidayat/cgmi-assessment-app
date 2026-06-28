// ============================================================
// pages/register.js
// Registration screen for Organizations
// ============================================================

import { registerUser, saveUserSession } from '../utils/auth.js';
import { toast } from '../components/toast.js';

const LIST_INSTANSI = [
  "Sekretariat Daerah",
  "Sekretariat DPRD",
  "Inspektorat Daerah",
  "Dinas Pendidikan",
  "Dinas Kesehatan",
  "Dinas Pekerjaan Umum dan Penataan Ruang",
  "Dinas Perumahan, Kawasan Permukiman dan Pertanahan",
  "Satuan Polisi Pamong Praja (Satpol PP)",
  "Dinas Sosial, Pemberdayaan Perempuan dan Perlindungan Anak",
  "Dinas Tenaga Kerja dan Transmigrasi",
  "Dinas Lingkungan Hidup dan Kehutanan",
  "Dinas Kependudukan dan Pencatatan Sipil",
  "Dinas Pemberdayaan Masyarakat dan Desa",
  "Dinas Pengendalian Penduduk dan Keluarga Berencana",
  "Dinas Perhubungan",
  "Dinas Komunikasi dan Informatika, Persandian dan Statistik",
  "Dinas Koperasi, UKM, Perdagangan dan Perindustrian",
  "Dinas Penanaman Modal dan PTSP",
  "Dinas Pariwisata, Kebudayaan, Kepemudaan dan Olahraga",
  "Dinas Arsip dan Perpustakaan",
  "Dinas Pertanian dan Ketahanan Pangan",
  "Dinas Perikanan dan Peternakan",
  "Badan Perencanaan, Pembangunan, Penelitian dan Pengembangan Daerah (Bapemda)",
  "Badan Kepegawaian dan Pengembangan SDM",
  "Badan Pengelolaan Keuangan dan Aset Daerah",
  "Badan Pengelolaan Pendapatan Daerah",
  "RSUD (Rumah Sakit Umum Daerah)",
  "Kecamatan Buahdua",
  "Kecamatan Cibugel",
  "Kecamatan Cimalaka",
  "Kecamatan Cimanggung",
  "Kecamatan Cisarua",
  "Kecamatan Cisitu",
  "Kecamatan Conggeang",
  "Kecamatan Darmaraja",
  "Kecamatan Ganeas",
  "Kecamatan Jatinangor",
  "Kecamatan Jatinunggal",
  "Kecamatan Jatigede",
  "Kecamatan Pamulihan",
  "Kecamatan Paseh",
  "Kecamatan Rancakalong",
  "Kecamatan Situraja",
  "Kecamatan Sukasari",
  "Kecamatan Sumedang Selatan",
  "Kecamatan Sumedang Utara",
  "Kecamatan Surian",
  "Kecamatan Tanjungkerta",
  "Kecamatan Tanjungmedar",
  "Kecamatan Tanjungsari",
  "Kecamatan Tomo",
  "Kecamatan Ujungjaya",
  "Kecamatan Wado"
];

const LAMA_BEKERJA_OPTIONS = [
  "< 1 Tahun",
  "1-3 Tahun",
  "3-5 Tahun",
  "5-10 Tahun",
  "> 10 Tahun"
];

export function renderRegister() {
  const instansiOptions = LIST_INSTANSI.map(i => `<option value="${i}">${i}</option>`).join('');
  const lamaOptions = LAMA_BEKERJA_OPTIONS.map(l => `<option value="${l}">${l}</option>`).join('');

  return `
  <div class="bg-[#f4f4f4] min-h-[80vh] py-16">
    <div class="max-w-[640px] mx-auto px-8">
      <section class="carbon-card">
        <div class="mb-8">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#525252] mb-2">Daftar Akun CGMI</p>
          <h1 class="text-[2rem] font-[300] leading-[1.05] text-[#161616]">Registrasi Organisasi Publik</h1>
          <p class="text-sm text-[#525252] mt-4">Isi data instansi Anda untuk mengakses asesmen dan memperoleh hasil tata kelola kolaborasi.</p>
        </div>

        <form id="register-form" class="space-y-6">
          <div class="carbon-field">
            <label for="reg-instansi">Instansi</label>
            <select id="reg-instansi" required class="carbon-input">
              <option value="">-- Pilih Instansi --</option>
              ${instansiOptions}
            </select>
          </div>
          <div class="carbon-field">
            <label for="reg-lama-bekerja">Lama Bekerja</label>
            <select id="reg-lama-bekerja" required class="carbon-input">
              <option value="">-- Pilih Lama Bekerja --</option>
              ${lamaOptions}
            </select>
          </div>
          <div class="carbon-field">
            <label for="reg-jabatan">Jabatan</label>
            <input id="reg-jabatan" type="text" required placeholder="Contoh: Kepala Bidang Perencanaan" class="carbon-input">
          </div>
          <button type="submit" id="btn-reg-submit" class="carbon-button w-full">Daftar &amp; Dapatkan Kode Akses</button>
          <p class="text-sm text-[#525252]">
            Sudah memiliki kode akses? <a href="#/login" class="text-[#0f62fe] hover:text-[#0050e6]">Masuk</a>
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
      const instansi    = document.getElementById('reg-instansi').value;
      const lamaBekerja = document.getElementById('reg-lama-bekerja').value;
      const jabatan     = document.getElementById('reg-jabatan').value;
      const submitBtn   = document.getElementById('btn-reg-submit');

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Mendaftar...';
        }
        const profile = await registerUser({ instansi, lamaBekerja, jabatan });

        // Simpan session ke localStorage
        saveUserSession({
          uid: profile.uuid,
          instansi: profile.instansi,
          lamaBekerja: profile.lamaBekerja,
          jabatan: profile.jabatan,
          role: 'user',
        });

        // Tampilkan modal berisi Kode Akses
        const modalDiv = document.createElement('div');
        modalDiv.className = 'fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md';
        modalDiv.innerHTML = `
          <div class="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-slate-100 transform scale-95 transition-all duration-300">
            <div class="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              🔑
            </div>
            <div class="space-y-2">
              <h3 class="text-xl font-black text-slate-900">Pendaftaran Berhasil!</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Berikut adalah <strong class="text-slate-700">Kode Akses</strong> Anda. Harap simpan kode ini dengan baik karena akan digunakan untuk masuk kembali ke platform.
              </p>
              <div class="bg-slate-100 rounded-2xl py-4 px-6 mt-2">
                <span class="text-4xl font-black tracking-[0.3em] text-[#0f62fe]">${profile.kodeAkses}</span>
              </div>
              <p class="text-[10px] text-slate-400">Instansi: ${profile.instansi}</p>
            </div>
            <button id="btn-modal-close-reg"
              class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-200 transition-all">
              Saya Sudah Mencatat, Masuk ke Dasbor
            </button>
          </div>
        `;
        document.body.appendChild(modalDiv);

        document.getElementById('btn-modal-close-reg').addEventListener('click', () => {
          modalDiv.remove();
          form.reset();
          window.location.hash = '/dashboard';
        });

      } catch (err) {
        toast.error('Gagal melakukan pendaftaran: ' + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Daftar & Dapatkan Kode Akses';
        }
      }
    });
  }
}
