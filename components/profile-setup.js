// ============================================================
// components/profile-setup.js
// Profile Setup UI and Logic (bypassing auth registration screen)
// ============================================================

import { registerUser, saveUserSession } from '../utils/auth.js';
import { toast } from './toast.js';

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

export function renderProfileSetup(theme = 'dark') {
  const instansiOptions = LIST_INSTANSI.map(i => `<option value="${i}">${i}</option>`).join('');
  const lamaOptions = LAMA_BEKERJA_OPTIONS.map(l => `<option value="${l}">${l}</option>`).join('');

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#1d1f28] border-[#424656]' : 'bg-white border-[#e0e0e0]';
  const textTitle = isDark ? 'text-white' : 'text-[#161616]';
  const textMuted = isDark ? 'text-[#8c8c8c]' : 'text-[#525252]';
  const inputClass = isDark ? 'border-b-[#8c8c8c] text-white focus:border-b-[#0f62fe]' : 'border-b-[#8d8d8d] text-[#161616] focus:border-b-[#0f62fe]';
  const selectBg = isDark ? 'bg-[#1d1f28]' : 'bg-[#f4f4f4]';

  return `
  <div class="max-w-[600px] mx-auto">
    <div class="${cardBg} border p-8 space-y-6">
      <div class="space-y-2">
        <span class="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#0f62fe]">Profil Responden</span>
        <h2 class="text-2xl sm:text-3xl font-black ${textTitle}">Sebelum Memulai Asesmen</h2>
        <p class="${textMuted} text-xs leading-relaxed">
          Silakan lengkapi informasi instansi, masa kerja, dan bidang Anda. Informasi ini digunakan secara anonim untuk keperluan agregasi data evaluasi kematangan tata kelola kolaborasi.
        </p>
      </div>

      <form id="profile-setup-form" class="space-y-6">
        <div class="carbon-field">
          <label for="setup-instansi" class="${textTitle}">Instansi / OPD</label>
          <select id="setup-instansi" required class="carbon-input ${selectBg} ${inputClass}">
            <option value="" class="bg-[#1d1f28]">-- Pilih Instansi --</option>
            ${instansiOptions}
          </select>
        </div>

        <div class="carbon-field">
          <label for="setup-lama-bekerja" class="${textTitle}">Lama Bekerja di Instansi Ini</label>
          <select id="setup-lama-bekerja" required class="carbon-input ${selectBg} ${inputClass}">
            <option value="" class="bg-[#1d1f28]">-- Pilih Lama Bekerja --</option>
            ${lamaOptions}
          </select>
        </div>

        <div class="carbon-field">
          <label for="setup-jabatan" class="${textTitle}">Bidang</label>
          <input id="setup-jabatan" type="text" required placeholder="Contoh: Bidang Perencanaan" class="carbon-input ${inputClass}">
        </div>

        <button type="submit" id="btn-profile-submit" class="carbon-button w-full justify-center">
          Simpan Profil &amp; Mulai
        </button>
      </form>
    </div>
  </div>
  `;
}

export function initProfileSetup(onSuccess) {
  const form = document.getElementById('profile-setup-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const instansi = document.getElementById('setup-instansi').value;
    const lamaBekerja = document.getElementById('setup-lama-bekerja').value;
    const jabatan = document.getElementById('setup-jabatan').value.trim();
    const submitBtn = document.getElementById('btn-profile-submit');

    if (!instansi || !lamaBekerja || !jabatan) {
      toast.warning('Semua data profil wajib diisi.');
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Menyimpan...';
      }

      // Register the profile to Firestore (creates user record & returns unique uuid)
      const profile = await registerUser({ instansi, lamaBekerja, jabatan });

      // Save user session to localStorage
      saveUserSession({
        uid: profile.uuid,
        instansi: profile.instansi,
        lamaBekerja: profile.lamaBekerja,
        jabatan: profile.jabatan,
        role: 'user',
      });

      toast.success('Profil Anda berhasil disimpan!');
      if (onSuccess) {
        onSuccess(profile);
      }
    } catch (err) {
      toast.error('Gagal menyimpan profil: ' + err.message);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Simpan Profil & Mulai';
      }
    }
  });
}
