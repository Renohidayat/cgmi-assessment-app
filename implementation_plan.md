# CGMI – Collaboration Governance Maturity Index Web Application

## Overview

A complete, Firebase-backed interactive assessment web application for public organizations to measure their collaboration governance maturity. The UI is fully in Indonesian with an academic blue theme. Authentication is dual-track: email/password for user organizations, Google Sign-In for admins.

---

## Project File Structure

```
cgmi-assessment-app/
├── index.html                   # SPA shell with router
├── tailwind-cdn.html            # (CDN-based Tailwind, no build step needed)
├── firebase-config.js           # Firebase init & exports
├── app.js                       # Main router + auth guard
├── styles/
│   └── main.css                 # Custom CSS overrides & animations
├── pages/
│   ├── home.js                  # Home page component
│   ├── about.js                 # About page component
│   ├── login.js                 # Login page (email/password)
│   ├── register.js              # Register page (email/password + org name)
│   ├── assessment.js            # Questionnaire page (Likert scale)
│   ├── dashboard.js             # User results + radar chart
│   └── admin/
│       ├── admin-layout.js      # Admin shell with sidebar
│       ├── admin-dashboard.js   # Macro pie chart + counters
│       ├── admin-respondents.js # Respondent table + export CSV
│       ├── admin-questions.js   # Question CRUD
│       └── admin-admins.js      # Admin whitelist management
├── components/
│   ├── navbar.js                # Top navigation bar
│   ├── footer.js                # Footer with group member names
│   ├── radar-chart.js           # Reusable radar chart component
│   └── toast.js                 # Toast notification system
└── utils/
    ├── auth.js                  # Auth helpers (login, logout, Google sign-in)
    ├── firestore.js             # Firestore CRUD helpers
    ├── assessment-logic.js      # Score calculation, maturity level, recommendations
    └── export.js                # CSV/Excel export utility
```

---

## Technical Architecture

### Frontend
- **HTML5 SPA**: Single `index.html` shell with a `<div id="app">` root
- **Tailwind CSS**: Loaded via CDN with `@tailwindcss/typography` plugin
- **JavaScript ES6+**: Vanilla JS with ES module imports via `type="module"`
- **Charts**: Chart.js (CDN) for Radar and Pie charts
- **Router**: Lightweight hash-based router (`#/home`, `#/assessment`, etc.)

### Backend (Firebase)
- **Firebase Authentication**: Email/Password (users) + Google OAuth (admins)
- **Cloud Firestore**: NoSQL document database
- **Security Rules**: Written to enforce role-based access

---

## Firestore Database Schema

### Collection: `users`
```json
{
  "uid": "string",
  "name": "string",
  "organization": "string",
  "email": "string",
  "role": "user",
  "createdAt": "timestamp"
}
```

### Collection: `admins`
```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "role": "admin",
  "addedAt": "timestamp"
}
```

### Collection: `questions`
```json
{
  "id": "string",
  "dimension": "string (e.g. 'Kepemimpinan')",
  "dimensionKey": "string (e.g. 'leadership')",
  "text": "string",
  "order": "number"
}
```

### Collection: `assessments`
```json
{
  "id": "string",
  "userId": "string",
  "userName": "string",
  "organization": "string",
  "submittedAt": "timestamp",
  "answers": { "questionId": score },
  "scoresPerDimension": {
    "Kepemimpinan": 3.5,
    "Pengambilan Keputusan": 4.0,
    ...
  },
  "totalAverageScore": 3.72,
  "maturityLevel": "Level 4 – Integrated"
}
```

---

## The 6 Dimensions & Sample Questions (5 questions per dimension = 30 total)

| Dimension | Key |
|-----------|-----|
| Kepemimpinan | leadership |
| Pengambilan Keputusan | decision |
| Transparansi | transparency |
| Manajemen Risiko | risk |
| Pengelolaan Sumber Daya | resource |
| Kinerja dan Evaluasi | performance |

---

## Maturity Level Logic

| Range | Level |
|-------|-------|
| 1.00 – 1.80 | Level 1 – Initial (Ad Hoc) |
| 1.81 – 2.60 | Level 2 – Managed |
| 2.61 – 3.40 | Level 3 – Defined |
| 3.41 – 4.20 | Level 4 – Integrated |
| 4.21 – 5.00 | Level 5 – Optimized |

---

## Recommendation Engine

Triggered when any dimension score < 3.00:

| Dimension | Recommendation |
|-----------|----------------|
| Kepemimpinan | Susun program pengembangan kepemimpinan kolaboratif lintas instansi |
| Pengambilan Keputusan | Terapkan mekanisme musyawarah multi-pihak berbasis data |
| Transparansi | Bangun portal informasi publik bersama yang terintegrasi |
| Manajemen Risiko | Rancang matriks mitigasi risiko bersama antar lembaga |
| Pengelolaan Sumber Daya | Optimalkan skema berbagi sumber daya (resource sharing) lintas sektor |
| Kinerja dan Evaluasi | Tetapkan KPI kolaborasi dan jadwal evaluasi periodik bersama |

---

## UI Theme

- **Primary**: Blue (`#1d4ed8` / `blue-700`)
- **Secondary**: Indigo (`#4f46e5`)
- **Background**: Slate (`#f8fafc`)
- **Accent**: Cyan (`#0891b2`)
- **Font**: Inter (Google Fonts)
- **Style**: Clean, academic, professional with subtle glassmorphism cards

---

## Pages Breakdown

### 1. Home (`#/`)
- Hero section with CGMI logo/icon, title, subtitle
- "Tentang CGMI" section with 3 benefit cards
- "Mulai Asesmen" CTA button → redirects to login if not authenticated
- Footer with team members

### 2. About (`#/about`)
- Rich text explanations of Collaboration Governance, Maturity Index, why it matters

### 3. Login (`#/login`)
- Email + Password form for organizations (users)
- Google Sign-In button for admins
- Link to Register

### 4. Register (`#/register`)
- Name, Organization Name, Email, Password fields
- Creates user document in Firestore `users` collection

### 5. Assessment (`#/assessment`) — Auth-guarded (user role)
- 30 questions grouped by dimension with progress bar
- Likert scale radio buttons (1–5) with Indonesian labels
- "Kirim Asesmen" submit button

### 6. Dashboard (`#/dashboard`) — Auth-guarded (user role)
- Shows latest assessment results
- Radar chart (6 dimensions)
- Maturity level badge with color coding
- Recommendation list for low-scoring dimensions
- "Ikuti Asesmen Ulang" button

### 7. Admin Dashboard (`#/admin`) — Auth-guarded (admin role)
- KPI cards: Total organizations, avg maturity score, distribution
- Pie chart: Maturity level distribution
- Recent submissions list

### 8. Admin Respondents (`#/admin/respondents`)
- Searchable, sortable data table
- Modal with respondent's radar chart
- Export to CSV button

### 9. Admin Questions (`#/admin/questions`)
- List all questions by dimension
- Add/Edit modal form
- Delete with confirmation

### 10. Admin Admins (`#/admin/admins`)
- List current admins
- Add new admin by Google email (adds to whitelist)

---

## Security

### Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if isAdmin();
    }
    match /admins/{uid} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    match /questions/{qid} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    match /assessments/{aid} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.userId || isAdmin();
      allow write: if isAdmin();
    }
    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

---

## Open Questions

> [!IMPORTANT]
> **Firebase Project Configuration**: You will need to provide your own Firebase project credentials (API key, project ID, etc.). The `firebase-config.js` file will contain a placeholder that you must replace with your actual Firebase config object from the Firebase Console.

> [!NOTE]
> **Tailwind CSS**: We'll use the Tailwind CSS CDN (Play CDN) — no build step required. This is perfect for a university project and keeps setup simple.

> [!NOTE]
> **Default Questions Seeding**: The app will include a "Seed Questions" button visible only to admins in the Questions panel, which will pre-populate Firestore with all 30 questions if the collection is empty.

> [!WARNING]
> **Google Sign-In Domain**: You must add your hosting domain (and `localhost` for testing) to the **Authorized Domains** list in Firebase Console → Authentication → Settings.

---

## Verification Plan

### Manual Verification
1. Open `index.html` via a local web server (e.g., VS Code Live Server)
2. Register a new user organization account
3. Complete the 30-question assessment
4. Verify radar chart renders and maturity level is correctly calculated
5. Sign in with an admin Google account
6. Verify the pie chart and respondent table populate
7. Test CRUD for questions
8. Test CSV export
