# CGMI Assessment App

Platform web (Single Page Application) untuk pengukuran kematangan tata kelola kolaborasi antar-instansi pemerintah daerah. Proyek ini dikembangkan khusus untuk instansi di lingkungan Kabupaten Sumedang.

## Deskripsi

CGMI (Collaboration Governance Maturity Index) menyediakan instrumen kuesioner (30 pertanyaan dari 6 dimensi) untuk menilai sejauh mana kolaborasi antar-instansi berjalan. Sistem akan memproses jawaban menjadi skor, memetakannya ke dalam 5 level kematangan, dan memberikan rekomendasi tindak lanjut secara otomatis.

## Teknologi

Aplikasi ini dibangun tanpa framework frontend (seperti React/Vue), menggunakan arsitektur Vanilla JS murni dengan modul ES6.

- **Core**: HTML5, Vanilla JavaScript (ES Modules)
- **Styling**: Tailwind CSS (CDN), Custom CSS (pendekatan desain bergaya IBM Carbon)
- **Backend/BaaS**: Firebase (Firestore, Authentication, Hosting)
- **Library Tambahan**: Chart.js (untuk visualisasi Radar Chart)

## Fitur

1. **SPA Router Custom**: Routing berbasis hash (`#/`) yang dikelola secara native di `app.js`.
2. **Sistem Autentikasi Hybrid**:
   - **Responden**: Akses instan menggunakan Kode Akses (6-digit) tanpa registrasi ulang. Session disimpan di `localStorage`.
   - **Admin**: Login via Google OAuth (Firebase Auth) dengan perlindungan _whitelist_ di Firestore.
3. **Kalkulasi Otomatis**: Penghitungan rata-rata skor per dimensi dan penentuan Level 1 (Ad Hoc) hingga Level 5 (Optimized).
4. **Dashboard Admin**: Pengelolaan data responden, manajemen pertanyaan kuesioner, dan kontrol akses admin.

## Struktur Folder Utama

- `app.js` - SPA Router & inisialisasi aplikasi.
- `firebase-config.js` - Konfigurasi koneksi ke project Firebase.
- `/pages` - Logika dan render per halaman (Home, Assessment, Dashboard, Admin, dll).
- `/components` - Komponen UI yang dapat direusability (Navbar, Footer, Toast).
- `/utils` - Kumpulan fungsi helper (Autentikasi, CRUD Firestore, dan Logika Assessment).
- `/styles` - File CSS utama.

## Persiapan & Pengembangan Lokal

1. Clone repositori ke mesin lokal Anda.
2. Pastikan Anda memiliki Firebase project yang aktif dengan layanan **Hosting**, **Firestore**, dan **Authentication (Google provider)**.
3. Update variabel di dalam `firebase-config.js` menggunakan kredensial SDK dari project Firebase Anda.
4. Jalankan aplikasi menggunakan local server (wajib karena menggunakan ES Modules):
   ```bash
   # Jika menggunakan script npm yang tersedia
   npm run dev
   
   # Alternatif: menggunakan ekstensi Live Server di VS Code
   ```

## Deployment

Aplikasi dideploy menggunakan Firebase CLI. Pastikan `firebase-tools` sudah terinstal (`npm install -g firebase-tools`).

```bash
# Login ke akun Firebase
firebase login

# Deploy keseluruhan (Hosting, rules Firestore, indexes)
firebase deploy

# Deploy hanya update file statis (frontend)
firebase deploy --only hosting
```
