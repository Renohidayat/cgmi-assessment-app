// ============================================================
// pages/home.js
// Home/Introduction page component
// ============================================================

export function renderHome(currentUser, currentRole) {
  const isLoggedIn = !!currentUser;

  return `
  <div class="bg-[#f4f4f4] py-16">
    <div class="max-w-[1584px] mx-auto px-8">
      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">

        <section class="carbon-card">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#525252] mb-4">Asesmen Kematangan Tata Kelola Kolaborasi</p>
          <h1 class="text-[3rem] font-[300] leading-[1.05] text-[#161616] max-w-2xl">Collaboration Governance Maturity Index untuk Organisasi Publik</h1>
          <p class="text-base text-[#525252] leading-7 mt-6 max-w-2xl">Instrumen ilmiah untuk mengukur, mengevaluasi, dan mendukung optimalisasi tata kelola kolaborasi lintas instansi publik.</p>
          <div class="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="${isLoggedIn ? '#/assessment' : '#/login'}" class="carbon-button">
              Mulai Asesmen
            </a>
            <a href="#/about" class="carbon-button-secondary">
              Pelajari Lebih Lanjut
            </a>
          </div>
        </section>

        <aside class="carbon-panel">
          <div class="space-y-6">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#525252] mb-4">Ringkasan CGMI</p>
              <ul class="space-y-4 text-sm text-[#525252]">
                <li class="border-b border-[#e0e0e0] pb-4">Pengukuran 6 dimensi tata kelola kolaborasi berbasis kuesioner terstruktur.</li>
                <li class="border-b border-[#e0e0e0] pb-4">Dashboard hasil dan rekomendasi yang mudah dilaporkan.</li>
                <li class="border-b border-[#e0e0e0] pb-4">Akses peneliti terkelola untuk manajemen data dan validasi.</li>
              </ul>
            </div>
            <div class="carbon-panel">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#525252] mb-4">Keunggulan</p>
              <div class="grid gap-4">
                <div class="border border-[#e0e0e0] p-4">
                  <h3 class="text-base font-semibold text-[#161616]">Struktur Terukur</h3>
                  <p class="text-sm text-[#525252] mt-2">Laporan yang tersusun dengan rapi sesuai dokumentasi tata kelola.</p>
                </div>
                <div class="border border-[#e0e0e0] p-4">
                  <h3 class="text-base font-semibold text-[#161616]">Data Eksklusif</h3>
                  <p class="text-sm text-[#525252] mt-2">Informasi terjaga untuk kebutuhan evaluasi organisasi publik.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div class="carbon-divider"></div>

      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="carbon-card">
          <h2 class="text-xl font-semibold text-[#161616] mb-3">Analisis Komprehensif</h2>
          <p class="text-sm text-[#525252]">Evaluasi enam dimensi tata kelola kolaborasi dengan metodologi yang jelas dan terdokumentasi.</p>
        </div>
        <div class="carbon-card">
          <h2 class="text-xl font-semibold text-[#161616] mb-3">Rekomendasi Taktis</h2>
          <p class="text-sm text-[#525252]">Saran perbaikan yang fokus pada area prioritas organisasi.</p>
        </div>
        <div class="carbon-card">
          <h2 class="text-xl font-semibold text-[#161616] mb-3">Monitoring Riil</h2>
          <p class="text-sm text-[#525252]">Laporan kemajuan organisasi berdasarkan hasil asesmen sebelumnya.</p>
        </div>
      </section>
    </div>
  </div>
  `;
}

export function initHome() {}
