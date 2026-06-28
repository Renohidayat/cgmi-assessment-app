# Daftar GitHub Issues untuk CGMI Assessment App

Berikut adalah daftar *issue* yang bisa Anda buat di repositori GitHub untuk melacak pengembangan proyek ini. Anda dapat menyalin judul dan deskripsinya ke menu **Issues > New Issue** di GitHub.

---

## Issue 1: [Setup] Inisialisasi Proyek dan Firebase
**Title:** `[Setup] Inisialisasi Proyek dan Konfigurasi Firebase`
**Labels:** `enhancement`, `setup`

**Description:**
```markdown
### Deskripsi
Melakukan setup awal proyek dan menghubungkannya dengan Firebase (Hosting, Firestore, dan Authentication).

### Task List
- [ ] Inisialisasi struktur folder (pages, components, utils, styles).
- [ ] Setup `index.html` dan `app.js` sebagai entry point SPA.
- [ ] Buat project di Firebase Console.
- [ ] Tambahkan `firebase-config.js` dengan kredensial SDK.
- [ ] Inisialisasi Firebase CLI (`firebase init`).
```

---

## Issue 2: [Auth] Sistem Autentikasi Responden & Admin
**Title:** `[Auth] Implementasi Sistem Autentikasi Hybrid (Kode Akses & Google OAuth)`
**Labels:** `enhancement`, `security`

**Description:**
```markdown
### Deskripsi
Membuat sistem login yang berbeda untuk responden (menggunakan Kode Akses) dan admin (menggunakan Google OAuth).

### Task List
- [ ] Buat fungsi generate 6-digit Kode Akses untuk responden baru.
- [ ] Simpan sesi responden di `localStorage`.
- [ ] Setup Google Auth Provider menggunakan Firebase Authentication.
- [ ] Buat pengecekan (middleware/guard) di router SPA untuk memastikan hanya admin yang bisa masuk rute `#/admin`.
- [ ] Validasi email admin ke koleksi `admins` (whitelist) di Firestore.
```

---

## Issue 3: [Feature] Logika Kuesioner dan Perhitungan Kematangan (CGMI)
**Title:** `[Feature] Logika Kuesioner, Skor, dan Level Kematangan`
**Labels:** `enhancement`, `core-logic`

**Description:**
```markdown
### Deskripsi
Mengimplementasikan fungsi inti untuk menghitung jawaban kuesioner menjadi skor dan pemetaan ke 5 Level Kematangan.

### Task List
- [ ] Definisikan data 30 pertanyaan kuesioner bawaan (6 dimensi).
- [ ] Buat fungsi `calculateScores(answers)` untuk merata-rata skor per dimensi.
- [ ] Buat fungsi `getMaturityLevel(avgScore)` untuk menentukan Level 1-5.
- [ ] Buat fungsi `getRecommendations(scores)` untuk menghasilkan rekomendasi tindak lanjut yang dinamis.
```

---

## Issue 4: [UI/UX] Halaman Kuesioner & Dashboard Hasil
**Title:** `[UI/UX] Halaman Formulir Kuesioner dan Dashboard Visualisasi`
**Labels:** `enhancement`, `ui`

**Description:**
```markdown
### Deskripsi
Membangun antarmuka untuk pengguna (responden) mengisi kuesioner dan melihat hasilnya dalam bentuk Radar Chart.

### Task List
- [ ] Desain halaman `assessment.js` (Form data diri + 30 soal skala Likert).
- [ ] Desain halaman `dashboard.js` untuk menampilkan skor rata-rata dan Level Kematangan.
- [ ] Integrasikan `Chart.js` untuk membuat Radar Chart dari nilai 6 dimensi.
- [ ] Tampilkan rekomendasi tindak lanjut secara dinamis berdasarkan skor tiap dimensi.
```

---

## Issue 5: [Admin] Panel Admin & Manajemen Data
**Title:** `[Admin] Pengembangan Panel Dashboard Admin`
**Labels:** `enhancement`, `admin`

**Description:**
```markdown
### Deskripsi
Membangun antarmuka khusus admin untuk mengelola hasil asesmen, daftar admin, dan pertanyaan.

### Task List
- [ ] Buat `admin-layout.js` untuk navigasi sidebar admin.
- [ ] Buat halaman Statistik Ringkasan (total responden, rata-rata skor kabupaten).
- [ ] Buat tabel data responden beserta tombol untuk melihat detail jawaban mereka.
- [ ] Buat antarmuka CRUD untuk mengelola whitelist admin (`admin-admins.js`).
- [ ] Buat antarmuka CRUD untuk memodifikasi pertanyaan (`admin-questions.js`).
```

---

## Issue 6: [DB] Integrasi Firestore dan Security Rules
**Title:** `[DB] Integrasi Operasi CRUD Firestore & Security Rules`
**Labels:** `database`, `security`

**Description:**
```markdown
### Deskripsi
Mengimplementasikan semua panggilan database (menyimpan dan mengambil data) serta mengamankannya.

### Task List
- [ ] Buat file `utils/firestore.js` untuk fungsi standar (get, add, update, delete).
- [ ] Implementasikan penyimpanan hasil `assessments` dan profil `users`.
- [ ] Tulis aturan keamanan (`firestore.rules`) agar responden hanya bisa membaca datanya sendiri dan admin bisa membaca semua data.
- [ ] Deploy Security Rules dan Indexes ke Firebase.
```
