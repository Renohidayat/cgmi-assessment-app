// ============================================================
// pages/home.js
// Home/Introduction page component (Customized for CGMI Specs)
// ============================================================

export function renderHome() {
  return `
<main>
  <!-- Hero Section -->
  <section class="relative h-screen min-h-[700px] flex items-center overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwpQnt-GFvGM0g6QEisW7EjfLe5_HxIn3QNWOJfwmvQCbRVNIvaHWw2Vg5FvNZ6fS2Y7wum92Wkt1Sx3lZz3i2vWlY1SiW1tveynSxE6IcHsRpl-oNbqTaiV78R5C0VveDwW1QTmxqtjRgemL8ekf1t0PLthn0u06Dn7RmkDMVT6C_NfX-07JwT2E_uTvqVyvVlieVtWhXeVVpnhiY6ckLAh3eemAz-iG_NfHPZA36uZQUOFDjrGeXUI_vsCfXY3kOpdHjZHpmP0ej');"></div>
    <div class="absolute inset-0 hero-overlay"></div>
    <div class="relative z-10 w-full max-w-[1584px] mx-auto px-[clamp(16px,5vw,64px)]">
      <div class="max-w-4xl">
        <p class="font-semibold text-[11px] leading-[1.2] tracking-[0.28em] uppercase text-[#0f62fe] mb-6">Asesmen Kematangan Tata Kelola Kolaborasi</p>
        <h1 class="text-5xl md:text-[88px] font-light leading-[1.02] md:tracking-[-0.01em] text-white mb-4">Collaboration Governance</h1>
        <div class="home-hero-highlight inline-block px-6 py-4">
          <span class="text-5xl md:text-[88px] font-semibold text-white">Maturity Index</span>
        </div>
        <p class="mt-8 text-lg leading-[1.75] text-[#c3c6d8] max-w-2xl">Standar pengukuran performa kolaborasi antar-instansi berbasis data untuk mewujudkan tata kelola yang tangkas, terpadu, dan berkelanjutan.</p>
      </div>
    </div>
  </section>
    <!-- Marquee -->
  <section class="bg-[#0f62fe] py-3">
    <div class="marquee text-white text-sm">
      <div class="marquee-content flex gap-12 items-center">
        <span>Collaboration Governance Maturity Index • Asesmen Tata Kelola Kolaborasi • 6 Dimensi • 30 Pertanyaan</span>
        <span>Collaboration Governance Maturity Index • Asesmen Tata Kelola Kolaborasi • 6 Dimensi • 30 Pertanyaan</span>
        <span>Collaboration Governance Maturity Index • Asesmen Tata Kelola Kolaborasi • 6 Dimensi • 30 Pertanyaan</span>
        <span>Collaboration Governance Maturity Index • Asesmen Tata Kelola Kolaborasi • 6 Dimensi • 30 Pertanyaan</span>
      </div>
    </div>
  </section>
     <!-- Statistik: 6 Dimensi & 30 Pertanyaan -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 border border-[#424656] divide-y md:divide-y-0 md:divide-x divide-[#424656]">
        <div class="flex flex-col items-center md:items-start p-8">
          <span class="text-5xl font-bold text-white">6 Dimensi</span>
          <span class="text-[11px] leading-[1.2] tracking-[0.28em] uppercase font-semibold text-[#8c8c8c] mt-2">Indikator CGMI</span>
        </div>
        <div class="flex flex-col items-center md:items-start p-8">
          <span class="text-5xl font-bold text-white">30 Pertanyaan</span>
          <span class="text-[11px] leading-[1.2] tracking-[0.28em] uppercase font-semibold text-[#8c8c8c] mt-2">Instrumen Kuesioner</span>
        </div>
      </div>

 
  <!-- Ringkasan CGMI Section -->
  <section class="py-24 bg-[#0a0a0a]">
    <div class="max-w-[1584px] mx-auto px-[clamp(16px,5vw,64px)]">

      <!-- Judul & Deskripsi -->
      <div class="mb-12">
        <p class="font-semibold text-[11px] leading-[1.2] tracking-[0.28em] uppercase text-[#0f62fe] mb-3">Ringkasan Parameter</p>
        <h2 class="text-4xl md:text-5xl font-light text-white leading-tight">6 Dimensi Evaluasi CGMI</h2>
        <p class="mt-4 text-base leading-relaxed text-[#c3c6d8] max-w-2xl">Instrumen CGMI dirancang untuk mengukur kematangan tata kelola kolaborasi antar-instansi melalui enam dimensi evaluasi yang komprehensif dan berbasis data.</p>
      </div>


      <!-- Kartu 6 Dimensi -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Dimensi 1 -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 hover:bg-[#252834] transition-all duration-300">
          <span class="text-xs font-bold text-[#0f62fe] block mb-4">DIMENSI 01</span>
          <h3 class="text-xl font-bold text-white mb-4">Kepemimpinan (Leadership)</h3>
          <p class="text-sm leading-relaxed text-[#c3c6d8]">
            Komitmen pimpinan secara aktif mendorong kerja sama antar instansi dalam setiap kebijakan, menyelesaikan konflik secara efektif, serta menyelaraskan visi dengan tujuan kolaborasi jangka panjang.
          </p>
        </div>

        <!-- Dimensi 2 -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 hover:bg-[#252834] transition-all duration-300">
          <span class="text-xs font-bold text-[#0f62fe] block mb-4">DIMENSI 02</span>
          <h3 class="text-xl font-bold text-white mb-4">Pengambilan Keputusan (Decision Making)</h3>
          <p class="text-sm leading-relaxed text-[#c3c6d8]">
            Keputusan kolaboratif diambil berdasarkan data dan bukti yang valid, melibatkan semua pihak yang berkepentingan secara transparan, serta diimplementasikan secara konsisten.
          </p>
        </div>

        <!-- Dimensi 3 -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 hover:bg-[#252834] transition-all duration-300">
          <span class="text-xs font-bold text-[#0f62fe] block mb-4">DIMENSI 03</span>
          <h3 class="text-xl font-bold text-white mb-4">Transparansi (Transparency)</h3>
          <p class="text-sm leading-relaxed text-[#c3c6d8]">
            Keterbukaan informasi mengenai program, anggaran, dan laporan kemajuan kepada pemangku kepentingan secara berkala melalui platform digital serta akses informasi yang setara.
          </p>
        </div>

        <!-- Dimensi 4 -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 hover:bg-[#252834] transition-all duration-300">
          <span class="text-xs font-bold text-[#0f62fe] block mb-4">DIMENSI 04</span>
          <h3 class="text-xl font-bold text-white mb-4">Manajemen Risiko (Risk Management)</h3>
          <p class="text-sm leading-relaxed text-[#c3c6d8]">
            Penilaian risiko bersama sebelum memulai program, tersedianya rencana mitigasi yang terdokumentasi, serta pembagian tanggung jawab pengelolaan risiko yang jelas antar mitra.
          </p>
        </div>

        <!-- Dimensi 5 -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 hover:bg-[#252834] transition-all duration-300">
          <span class="text-xs font-bold text-[#0f62fe] block mb-4">DIMENSI 05</span>
          <h3 class="text-xl font-bold text-white mb-4">Pengelolaan Sumber Daya (Resource Management)</h3>
          <p class="text-sm leading-relaxed text-[#c3c6d8]">
            Alokasi sumber daya secara adil antar mitra dengan kesepakatan tertulis, pemantauan dan evaluasi rutin, serta mekanisme berbagi sumber daya yang efisien.
          </p>
        </div>

        <!-- Dimensi 6 -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 hover:bg-[#252834] transition-all duration-300">
          <span class="text-xs font-bold text-[#0f62fe] block mb-4">DIMENSI 06</span>
          <h3 class="text-xl font-bold text-white mb-4">Kinerja dan Evaluasi (Performance & Evaluation)</h3>
          <p class="text-sm leading-relaxed text-[#c3c6d8]">
            Penerapan indikator kinerja utama (KPI) yang jelas, evaluasi periodik bersama oleh semua pihak, serta pemanfaatan hasil evaluasi sebagai dasar perbaikan program.
          </p>
        </div>

      </div>

      <!-- CTA Mulai Asesmen -->
      <div class="mt-16 flex flex-col items-center text-center gap-4">
        <p class="text-sm text-[#8c8c8c] max-w-xl">Anda telah memahami 6 dimensi CGMI. Saatnya mengukur kematangan tata kelola kolaborasi instansi Anda.</p>
        <a href="#/assessment" id="home-cta-asesmen" class="inline-flex items-center gap-3 bg-[#0f62fe] text-white px-10 py-4 text-sm font-semibold hover:bg-[#0353e9] transition-colors">
          Mulai Asesmen Sekarang
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>

    </div>
  </section>
</main>
  `;
}

export function initHome() {
  // Empty init since old reveal effects are simplified
}
