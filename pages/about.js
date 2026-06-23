// ============================================================
// pages/about.js
// Academic definitions and descriptions of CGMI
// ============================================================

export function renderAbout() {
  return `
  <div class="py-12 bg-slate-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      
      <!-- Header -->
      <div class="text-center mb-12 space-y-3">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900">Tentang CGMI</h1>
        <p class="text-slate-500 max-w-xl mx-auto">
          Mengenal instrumen tata kelola dan tingkat kematangan kolaborasi pada sektor publik.
        </p>
      </div>

      <!-- Main Content Cards -->
      <div class="space-y-8">
        
        <!-- Card 1: Collaboration Governance -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🏛️</span>
            <h2 class="text-2xl font-bold text-slate-900">Tata Kelola Kolaborasi</h2>
          </div>
          <p class="text-slate-600 leading-relaxed">
            <strong>Collaboration Governance</strong> (Tata Kelola Kolaborasi) adalah rangkaian pengaturan formal dan informal yang menetapkan cara berbagai pihak (organisasi publik, swasta, dan masyarakat sipil) membuat keputusan bersama, mengelola sumber daya, membagi tanggung jawab, serta merumuskan akuntabilitas guna memecahkan masalah publik pelik yang tidak dapat dituntaskan secara mandiri.
          </p>
        </div>

        <!-- Card 2: Maturity Index -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">📈</span>
            <h2 class="text-2xl font-bold text-slate-900">Maturity Index (Indeks Kematangan)</h2>
          </div>
          <p class="text-slate-600 leading-relaxed">
            <strong>Maturity Index</strong> (Indeks Kematangan) berguna untuk mengukur sejauh mana proses tata kelola kolaborasi telah didokumentasikan, distandarisasi, dievaluasi, dan dioptimalkan secara sistematis. Dengan memiliki parameter tingkat kematangan yang jelas, suatu organisasi dapat memetakan posisi saat ini dan menyusun peta jalan perbaikan yang terarah menuju tataran optimal.
          </p>
        </div>

        <!-- Card 3: Why it matters -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🔑</span>
            <h2 class="text-2xl font-bold text-slate-900">Urgensi Bagi Sektor Publik</h2>
          </div>
          <p class="text-slate-600 leading-relaxed mb-4">
            Banyak kerja sama antarinstansi di Indonesia mengalami kendala karena kurangnya komitmen pimpinan, ketiadaan mitigasi risiko bersama, atau buruknya integrasi data. CGMI hadir sebagai instrumen reflektif ilmiah untuk mengatasi hambatan tersebut dengan mengukur 6 dimensi utama secara kuantitatif:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl">
              <span class="text-blue-600 mt-1">1.</span>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Kepemimpinan</h4>
                <p class="text-xs text-slate-500">Komitmen serta kemampuan mengarahkan visi lintas lembaga.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl">
              <span class="text-blue-600 mt-1">2.</span>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Pengambilan Keputusan</h4>
                <p class="text-xs text-slate-500">Mekanisme penentuan kesepakatan secara inklusif dan adil.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl">
              <span class="text-blue-600 mt-1">3.</span>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Transparansi</h4>
                <p class="text-xs text-slate-500">Akses terbuka atas proses kerja sama, informasi, dan data.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl">
              <span class="text-blue-600 mt-1">4.</span>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Manajemen Risiko</h4>
                <p class="text-xs text-slate-500">Identifikasi bersama atas potensi hambatan dan penyelesaiannya.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl">
              <span class="text-blue-600 mt-1">5.</span>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Pengelolaan Sumber Daya</h4>
                <p class="text-xs text-slate-500">Distribusi serta pemanfaatan sarana dan prasarana yang efisien.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl">
              <span class="text-blue-600 mt-1">6.</span>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Kinerja dan Evaluasi</h4>
                <p class="text-xs text-slate-500">Metrik kesuksesan dan evaluasi kemajuan periodik yang solid.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  `;
}

export function initAbout() {}
