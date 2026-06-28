# 📘 Dokumentasi Alur Proses Pembuatan Web CGMI Assessment App

> **CGMI** – Collaboration Governance Maturity Index  
> Platform pengukuran kematangan tata kelola kolaborasi antar-instansi pemerintah daerah.  
> URL: [cgmi-assessmentt.web.app](https://cgmi-assessmentt.web.app)

---

## 1. Ringkasan Proyek

| Item | Detail |
|------|--------|
| **Nama** | CGMI Assessment App |
| **Tujuan** | Mengukur tingkat kematangan tata kelola kolaborasi instansi pemerintah daerah Kab. Sumedang |
| **Target Pengguna** | Pejabat/staf OPD (Responden) + Admin Peneliti |
| **Instrumen** | 30 pertanyaan · 6 dimensi · Skala Likert 1–5 · 5 level kematangan |
| **Tech Stack** | Vanilla JS (ES Modules) · Tailwind CSS CDN · Firebase Hosting + Firestore + Auth |

---

## 2. Arsitektur Aplikasi

```
┌─────────────────────────────────────────────────────┐
│                   BROWSER (Client)                  │
│                                                     │
│  index.html ─── app.js (SPA Router)                 │
│       │              │                              │
│       ├── navbar.js  ├── home.js                    │
│       ├── footer.js  ├── about.js                   │
│       └── toast.js   ├── assessment.js              │
│                      ├── dashboard.js               │
│                      ├── login.js                   │
│                      └── admin/ (4 halaman)          │
│                                                     │
│  utils/                                             │
│       ├── auth.js           (Autentikasi)           │
│       ├── firestore.js      (CRUD Firestore)        │
│       ├── assessment-logic.js (Skor & Rekomendasi)  │
│       └── export.js         (Ekspor PDF/CSV)        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                FIREBASE (Backend)                   │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │ Hosting  │  │ Firestore │  │ Authentication   │  │
│  │ (Static) │  │ (Database)│  │ (Google OAuth)   │  │
│  └──────────┘  └───────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Tipe aplikasi:** Single Page Application (SPA) murni tanpa framework (React/Vue/Angular). Routing menggunakan hash-based (`#/path`) yang dikelola oleh `app.js`.

---

## 3. Struktur Folder

```
cgmi-assessment-app/
│
├── index.html              ← Entry point HTML utama
├── app.js                  ← SPA Router + Route Guards + Init Auth
├── firebase-config.js      ← Konfigurasi Firebase (API Key, Project ID)
│
├── pages/                  ← Halaman-halaman utama
│   ├── home.js             ← Landing page (Hero + CTA)
│   ├── about.js            ← Halaman "Tentang CGMI"
│   ├── assessment.js       ← Formulir kuesioner (30 soal)
│   ├── dashboard.js        ← Dashboard hasil asesmen
│   ├── login.js            ← Halaman login (Kode Akses + Google)
│   └── admin/              ← Panel admin (4 sub-halaman)
│       ├── admin-layout.js       ← Layout sidebar admin
│       ├── admin-dashboard.js    ← Dashboard ringkasan admin
│       ├── admin-respondents.js  ← Kelola data responden
│       ├── admin-questions.js    ← Kelola pertanyaan kuesioner
│       └── admin-admins.js       ← Kelola daftar admin
│
├── components/             ← Komponen UI yang dipakai ulang
│   ├── navbar.js           ← Navigasi atas (responsive)
│   ├── footer.js           ← Footer halaman
│   ├── toast.js            ← Notifikasi pop-up (sukses/error)
│   └── profile-setup.js    ← Modal setup profil
│
├── utils/                  ← Logic & helper functions
│   ├── auth.js             ← Register, Login (Kode Akses + Google), Logout
│   ├── firestore.js        ← Semua operasi CRUD ke Firestore
│   ├── assessment-logic.js ← Pertanyaan, skor, level, rekomendasi
│   └── export.js           ← Ekspor hasil ke PDF/CSV
│
├── styles/
│   └── main.css            ← CSS kustom (Carbon Design + override Tailwind)
│
├── assets/                 ← Gambar, ikon, dan aset statis
│
├── firebase.json           ← Konfigurasi Firebase Hosting
├── firestore.rules         ← Security rules Firestore
├── firestore.indexes.json  ← Index Firestore
└── buku-panduan.html       ← Buku panduan pengguna (mandiri)
```

---

## 4. Alur Pengembangan (Development Flow)

### Tahap 1: Setup Proyek

```
1. Buat folder proyek
2. Buat Firebase Project di console.firebase.google.com
3. Aktifkan: Firestore, Authentication (Google), Hosting
4. Salin config Firebase → firebase-config.js
5. Install Firebase CLI → npm install firebase-tools
```

### Tahap 2: Bangun Fondasi

```
1. Buat index.html    → Shell HTML + load Tailwind CDN + link CSS + <script module>
2. Buat app.js        → SPA Router berbasis hashchange
3. Buat main.css      → Design system (CSS variables, Carbon-style components)
4. Buat navbar.js     → Navigasi responsive
5. Buat footer.js     → Footer halaman
```

### Tahap 3: Bangun Halaman Publik

```
1. home.js       → Hero section + CTA "Mulai Asesmen"
2. about.js      → Penjelasan CGMI, dimensi, dan instrumen
3. assessment.js → Formulir: data diri + 30 pertanyaan Likert
4. dashboard.js  → Tampilan hasil: skor, radar chart, rekomendasi
5. login.js      → Login dengan Kode Akses atau Google (admin)
```

### Tahap 4: Bangun Logic Asesmen

```
1. assessment-logic.js → Definisikan:
   - 6 dimensi (leadership, decision, transparency, risk, resource, performance)
   - 30 pertanyaan default (5 per dimensi)
   - Fungsi calculateScores() → hitung rata-rata per dimensi
   - Fungsi getMaturityLevel() → mapping skor → level 1-5
   - Fungsi getRecommendations() → rekomendasi per dimensi per level
```

### Tahap 5: Bangun Backend (Firebase)

```
1. firebase-config.js  → Inisialisasi Firebase App, Auth, Firestore
2. firestore.js        → CRUD: questions, assessments, users, admins
3. auth.js             → Sistem autentikasi hybrid:
   - Responden: Kode Akses 6 digit → localStorage session
   - Admin: Google OAuth → Firebase Auth
4. firestore.rules     → Security rules per koleksi
```

### Tahap 6: Bangun Panel Admin

```
1. admin-layout.js      → Sidebar navigasi admin
2. admin-dashboard.js   → Statistik ringkasan (jumlah responden, rata-rata skor)
3. admin-respondents.js → Tabel data responden + detail jawaban
4. admin-questions.js   → CRUD pertanyaan kuesioner
5. admin-admins.js      → Kelola whitelist admin
```

### Tahap 7: Deploy

```
1. firebase deploy --only hosting    → Deploy ke Firebase Hosting
2. firebase deploy --only firestore  → Deploy Firestore rules + indexes
```

---

## 5. Alur Data (Data Flow)

### 5.1 Alur Responden Mengisi Asesmen

```
Responden buka web
       │
       ▼
   Halaman Home (#/)
       │
       ▼ klik "Mulai Asesmen"
       │
   Halaman Assessment (#/assessment)
       │
       ├── 1. Isi Data Diri (Instansi, Lama Bekerja, Bidang)
       │
       ├── 2. Jawab 30 pertanyaan (Likert 1-5)
       │
       ├── 3. Klik "Kirim Asesmen"
       │        │
       │        ▼
       │   ┌──────────────────────────┐
       │   │ auth.js → registerUser() │ → Simpan user ke Firestore (users/)
       │   │ → Generate UUID + Kode   │   + Generate Kode Akses 6 digit
       │   │   Akses 6 digit          │
       │   └──────────────────────────┘
       │        │
       │        ▼
       │   ┌────────────────────────────────┐
       │   │ assessment-logic.js             │
       │   │ → calculateScores(answers)      │ → Hitung rata-rata per dimensi
       │   │ → getMaturityLevel(avgScore)    │ → Tentukan level 1-5
       │   │ → getRecommendations(scores)    │ → Ambil rekomendasi per dimensi
       │   └────────────────────────────────┘
       │        │
       │        ▼
       │   ┌──────────────────────────────┐
       │   │ firestore.js                  │
       │   │ → submitAssessment({          │ → Simpan ke Firestore (assessments/)
       │   │     userId, answers, scores,  │
       │   │     maturityLevel, ...        │
       │   │   })                          │
       │   └──────────────────────────────┘
       │        │
       │        ▼
       │   localStorage.setItem(session)
       │        │
       ▼        ▼
   Redirect → Halaman Dashboard (#/dashboard)
       │
       ├── Tampilkan skor rata-rata (1.00 – 5.00)
       ├── Tampilkan level kematangan (Level 1-5)
       ├── Tampilkan radar chart (Chart.js)
       ├── Tampilkan rekomendasi per dimensi
       └── Tampilkan Kode Akses (untuk login ulang)
```

### 5.2 Alur Admin

```
Admin buka web
       │
       ▼ klik "Masuk Admin"
       │
   Halaman Login (#/login)
       │
       ▼ klik "Login dengan Google"
       │
   ┌─────────────────────────────┐
   │ auth.js → loginWithGoogle() │
   │ → signInWithPopup (Google)  │
   │ → Cek whitelist di admins/  │
   │ → Jika terdaftar → OK      │
   │ → Jika tidak → signOut()   │
   └─────────────────────────────┘
       │
       ▼ (jika berhasil)
       │
   Redirect → Panel Admin (#/admin)
       │
       ├── Dashboard  → Statistik ringkasan semua asesmen
       ├── Responden  → Tabel + detail jawaban per responden
       ├── Pertanyaan → CRUD pertanyaan kuesioner
       └── Admin      → Kelola whitelist admin (tambah/hapus)
```

---

## 6. Skema Database (Firestore)

### Koleksi `users`
```
users/{uuid}
├── uid          : string    (UUID unik)
├── instansi     : string    (nama OPD)
├── lamaBekerja  : string    ("1-3 Tahun", dll.)
├── jabatan      : string    (nama bidang)
├── kodeAkses    : string    (6 digit, untuk login ulang)
├── role         : string    ("user")
└── createdAt    : timestamp
```

### Koleksi `assessments`
```
assessments/{auto-id}
├── userId       : string    (referensi ke users/{uuid})
├── instansi     : string
├── answers      : map       ({ "q_leadership_1": 4, "q_decision_2": 3, ... })
├── scores       : map       ({ leadership: 4.2, decision: 3.6, ... })
├── avgScore     : number    (rata-rata keseluruhan)
├── maturityLevel: number    (1-5)
└── submittedAt  : timestamp
```

### Koleksi `questions`
```
questions/{question-id}
├── id           : string    ("q_leadership_1")
├── dimensionKey : string    ("leadership")
├── dimension    : string    ("Kepemimpinan")
├── text         : string    (teks pertanyaan)
├── order        : number    (urutan dalam dimensi)
└── createdAt    : timestamp
```

### Koleksi `admins`
```
admins/{uid-or-email}
├── uid          : string
├── name         : string
├── email        : string
├── emailLower   : string    (normalisasi lowercase)
├── role         : string    ("admin")
└── addedAt      : timestamp
```

---

## 7. Sistem Autentikasi

Aplikasi menggunakan **sistem autentikasi hybrid**:

| Aktor | Metode Login | Penyimpanan Session | Guard |
|-------|-------------|-------------------|-------|
| **Responden** | Kode Akses 6 digit | `localStorage` | Tidak perlu login untuk isi asesmen |
| **Admin** | Google OAuth (popup) | Firebase Auth State | Route guard: harus login + role `admin` |

### Alur Autentikasi:

```
app.js init
    │
    ├── 1. Cek localStorage → ada session? → set currentUser
    │
    ├── 2. Listen Firebase onAuthStateChanged
    │       │
    │       ├── Ada Firebase user? → Cek role admin → set currentUser + currentRole
    │       │
    │       └── Tidak ada? → Fallback ke localStorage session
    │
    └── 3. handleRouting()
            │
            ├── Route butuh auth?  → Tidak login? → Redirect ke #/login
            ├── Route butuh admin? → Bukan admin? → Redirect ke #/
            └── Route guestOnly?   → Sudah login? → Redirect ke dashboard
```

---

## 8. Sistem Routing (SPA)

Routing berbasis **hash** (`window.location.hash`):

| Route | Halaman | Auth | Role |
|-------|---------|------|------|
| `#/` | Home (Landing) | ❌ | – |
| `#/about` | Tentang CGMI | ❌ | – |
| `#/assessment` | Formulir Kuesioner | ❌ | – |
| `#/dashboard` | Dashboard Hasil | ❌ | – |
| `#/login` | Halaman Login | ❌ (guest only) | – |
| `#/admin` | Admin Dashboard | ✅ | `admin` |
| `#/admin/respondents` | Admin Responden | ✅ | `admin` |
| `#/admin/questions` | Admin Pertanyaan | ✅ | `admin` |
| `#/admin/admins` | Admin Kelola Admin | ✅ | `admin` |

### Cara Kerja Router:

```javascript
// app.js
window.addEventListener('hashchange', handleRouting);

function handleRouting() {
  const path = window.location.hash.replace('#', '');  // contoh: "/assessment"
  const route = routes[path];                           // cari di registry
  document.getElementById('app').innerHTML = route.render();  // render HTML
  route.init();                                         // init event listeners
}
```

---

## 9. Logika Perhitungan Skor

### 9.1 Rumus Skor per Dimensi

```
Skor Dimensi = Σ (jawaban pertanyaan dimensi) / jumlah pertanyaan dimensi

Contoh: Dimensi Kepemimpinan (5 pertanyaan)
  Jawaban: 4, 3, 5, 4, 4
  Skor = (4 + 3 + 5 + 4 + 4) / 5 = 4.00
```

### 9.2 Skor Rata-rata Keseluruhan

```
Skor Rata-rata = Σ (skor semua dimensi) / 6
```

### 9.3 Mapping Level Kematangan

| Rentang Skor | Level | Nama | Deskripsi |
|-------------|-------|------|-----------|
| 1.00 – 1.80 | 1 | Ad Hoc | Belum ada kolaborasi terstruktur |
| 1.81 – 2.60 | 2 | Emerging | Kolaborasi mulai terbentuk |
| 2.61 – 3.40 | 3 | Structured | Ada mekanisme formal |
| 3.41 – 4.20 | 4 | Integrated | Terintegrasi dan terukur |
| 4.21 – 5.00 | 5 | Optimized | Sudah optimal dan berkelanjutan |

### 9.4 Rekomendasi Tindakan

Setiap dimensi mendapat rekomendasi yang **berbeda per level kematangan**. Total: 6 dimensi × 5 level = **30 rekomendasi unik**.

---

## 10. Teknologi & Library

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **HTML5** | – | Struktur halaman |
| **JavaScript** | ES2020+ (Modules) | Logic aplikasi |
| **Tailwind CSS** | CDN v3 | Utility-first styling |
| **Custom CSS** | – | Carbon Design System override |
| **Firebase Hosting** | – | Hosting static files |
| **Cloud Firestore** | v10.12.2 | Database NoSQL realtime |
| **Firebase Auth** | v10.12.2 | Google OAuth untuk admin |
| **Chart.js** | CDN latest | Radar chart pada dashboard |
| **IBM Plex Sans** | Google Fonts | Tipografi utama |
| **Material Symbols** | Google Fonts | Ikon UI |

---

## 11. Perintah Deploy

```bash
# Install Firebase CLI (sekali saja)
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Deploy semua (hosting + rules + indexes)
firebase deploy

# Deploy hosting saja
firebase deploy --only hosting

# Deploy Firestore rules saja
firebase deploy --only firestore:rules

# Preview lokal sebelum deploy
firebase serve
```

---

## 12. Diagram Alur Keseluruhan

```
 ┌──────────┐     ┌────────────┐     ┌───────────────┐     ┌─────────────┐
 │          │     │            │     │               │     │             │
 │  index   │────▶│   app.js   │────▶│   pages/*.js  │────▶│  Dashboard  │
 │  .html   │     │  (Router)  │     │  (Render UI)  │     │  (Hasil)    │
 │          │     │            │     │               │     │             │
 └──────────┘     └─────┬──────┘     └───────┬───────┘     └─────────────┘
                        │                    │
                        │              ┌─────┴──────┐
                        │              │            │
                        ▼              ▼            ▼
                  ┌───────────┐  ┌──────────┐  ┌──────────────┐
                  │  auth.js  │  │firestore │  │ assessment   │
                  │ (Login)   │  │  .js     │  │ -logic.js    │
                  │           │  │ (CRUD)   │  │ (Skor)       │
                  └─────┬─────┘  └────┬─────┘  └──────────────┘
                        │             │
                        ▼             ▼
                  ┌─────────────────────────┐
                  │    FIREBASE CLOUD       │
                  │  ┌────────┐ ┌────────┐  │
                  │  │  Auth  │ │Firestore│  │
                  │  │(Google)│ │  (DB)  │  │
                  │  └────────┘ └────────┘  │
                  └─────────────────────────┘
```

---

> 📅 Dokumentasi ini dibuat pada **25 Juni 2026**  
> 📝 Dibuat oleh tim pengembang CGMI Assessment App
