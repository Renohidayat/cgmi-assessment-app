// ============================================================
// pages/about.js
// Academic definitions and descriptions of CGMI (Customized for CGMI Specs)
// ============================================================

export function renderAbout() {
  return `
  <div class="py-16 px-4 sm:px-6 bg-[#0a0a0a] min-h-screen text-[#e1e1ee]">
    <div class="max-w-4xl mx-auto space-y-12">
      
      <!-- Header -->
      <div class="text-center space-y-4">
        <span class="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#0f62fe]">Tentang CGMI</span>
        <h1 class="text-4xl sm:text-5xl font-light text-white leading-tight">Mengenal Instrumen Asesmen</h1>
        <p class="text-[#8c8c8c] text-sm max-w-xl mx-auto leading-relaxed">
          Mengukur tingkat kematangan tata kelola kolaborasi pada sektor publik secara terukur dan objektif.
        </p>
      </div>

      <!-- Main Content Cards -->
      <div class="space-y-8">
        
        <!-- Card 1: Collaboration Governance -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🏛️</span>
            <h2 class="text-2xl font-bold text-white">Tata Kelola Kolaborasi</h2>
          </div>
          <p class="text-[#c3c6d8] text-sm leading-relaxed">
            Collaboration Governance (Tata Kelola Kolaborasi) adalah rangkaian pengaturan formal dan informal yang mengatur bagaimana berbagai pihak, baik organisasi publik, swasta, maupun masyarakat, bekerja sama dalam pengambilan keputusan, pengelolaan sumber daya, pembagian tanggung jawab, serta pelaksanaan program untuk mencapai tujuan bersama dan menyelesaikan permasalahan publik secara efektif.
          </p>
        </div>

        <!-- Card 2: Maturity Index -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">📊</span>
            <h2 class="text-2xl font-bold text-white">Collaboration Governance Maturity Index (CGMI)</h2>
          </div>
          <p class="text-[#c3c6d8] text-sm leading-relaxed">
            Collaboration Governance Maturity Index (CGMI) merupakan instrumen asesmen yang digunakan untuk mengukur tingkat kematangan tata kelola kolaborasi suatu organisasi berdasarkan enam dimensi utama. Hasil asesmen membantu organisasi memahami kondisi tata kelola kolaborasi saat ini serta mengidentifikasi aspek yang perlu ditingkatkan untuk mendukung kolaborasi yang lebih efektif.
          </p>
        </div>

        <!-- Card 3: Tujuan CGMI -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎯</span>
            <h2 class="text-2xl font-bold text-white">Tujuan CGMI</h2>
          </div>
          <p class="text-[#c3c6d8] text-sm leading-relaxed mb-2">CGMI dikembangkan untuk:</p>
          <ul class="list-disc pl-5 text-[#c3c6d8] text-sm space-y-2">
            <li>Mengukur tingkat kematangan tata kelola kolaborasi secara sistematis.</li>
            <li>Mengidentifikasi kekuatan dan kelemahan dalam pelaksanaan kolaborasi.</li>
            <li>Menyediakan dasar evaluasi bagi organisasi dalam meningkatkan kualitas kolaborasi.</li>
            <li>Mendukung pengambilan keputusan berdasarkan hasil asesmen yang terukur.</li>
            <li>Mendorong peningkatan efektivitas kerja sama antar pemangku kepentingan.</li>
          </ul>
        </div>

        <!-- Card 4: Manfaat CGMI -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">📋</span>
            <h2 class="text-2xl font-bold text-white">Manfaat CGMI</h2>
          </div>
          <p class="text-[#c3c6d8] text-sm leading-relaxed mb-2">Penerapan CGMI memberikan manfaat sebagai berikut:</p>
          <ul class="list-disc pl-5 text-[#c3c6d8] text-sm space-y-2">
            <li>Membantu organisasi memahami kondisi tata kelola kolaborasi yang sedang berjalan.</li>
            <li>Menjadi alat evaluasi terhadap pelaksanaan kolaborasi antar instansi.</li>
            <li>Mendukung penyusunan strategi perbaikan yang lebih terarah.</li>
            <li>Meningkatkan transparansi dan akuntabilitas dalam proses kolaborasi.</li>
            <li>Mendorong pengelolaan sumber daya, risiko, dan kinerja yang lebih efektif.</li>
          </ul>
        </div>

        <!-- Card 5: Urgensi -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🔑</span>
            <h2 class="text-2xl font-bold text-white">Urgensi Bagi Sektor Publik</h2>
          </div>
          <p class="text-[#c3c6d8] text-sm leading-relaxed">
            Pelaksanaan kerja sama antar instansi sering menghadapi berbagai tantangan, seperti kurangnya koordinasi, keterbatasan transparansi, pengelolaan risiko yang belum optimal, serta belum adanya mekanisme evaluasi yang terstruktur. Oleh karena itu, CGMI hadir sebagai instrumen asesmen yang membantu organisasi mengevaluasi dan meningkatkan kualitas tata kelola kolaborasi berdasarkan enam dimensi utama.
          </p>
        </div>

        <!-- Card 6: 6 Dimensi -->
        <div class="bg-[#1d1f28] border border-[#424656] p-8 space-y-6">
          <h2 class="text-2xl font-bold text-white pb-3 border-b border-[#424656]">6 Dimensi Evaluasi CGMI</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="space-y-1">
              <h4 class="font-bold text-[#0f62fe] text-sm">1. Kepemimpinan (Leadership)</h4>
              <p class="text-xs text-[#c3c6d8] leading-relaxed">Komitmen dan kemampuan pimpinan dalam mendorong kerja sama, menyelaraskan visi, menyelesaikan konflik, serta memberikan arahan strategis dalam pelaksanaan kolaborasi.</p>
            </div>

            <div class="space-y-1">
              <h4 class="font-bold text-[#0f62fe] text-sm">2. Pengambilan Keputusan (Decision Making)</h4>
              <p class="text-xs text-[#c3c6d8] leading-relaxed">Proses pengambilan keputusan yang melibatkan seluruh pemangku kepentingan, berbasis data dan bukti, transparan, serta dapat diimplementasikan secara konsisten.</p>
            </div>

            <div class="space-y-1">
              <h4 class="font-bold text-[#0f62fe] text-sm">3. Transparansi (Transparency)</h4>
              <p class="text-xs text-[#c3c6d8] leading-relaxed">Keterbukaan informasi terkait program, anggaran, pelaksanaan, dan hasil kolaborasi sehingga dapat diakses oleh seluruh pihak yang berkepentingan.</p>
            </div>

            <div class="space-y-1">
              <h4 class="font-bold text-[#0f62fe] text-sm">4. Manajemen Risiko (Risk Management)</h4>
              <p class="text-xs text-[#c3c6d8] leading-relaxed">Kemampuan organisasi dalam mengidentifikasi, menilai, mengelola, dan memitigasi risiko yang dapat memengaruhi keberhasilan kolaborasi.</p>
            </div>

            <div class="space-y-1">
              <h4 class="font-bold text-[#0f62fe] text-sm">5. Pengelolaan Sumber Daya (Resource Management)</h4>
              <p class="text-xs text-[#c3c6d8] leading-relaxed">Pengalokasian, pemanfaatan, dan pengelolaan sumber daya secara efektif, efisien, dan adil untuk mendukung pencapaian tujuan kolaborasi.</p>
            </div>

            <div class="space-y-1">
              <h4 class="font-bold text-[#0f62fe] text-sm">6. Kinerja dan Evaluasi (Performance & Evaluation)</h4>
              <p class="text-xs text-[#c3c6d8] leading-relaxed">Pengukuran kinerja, pelaporan hasil, serta evaluasi berkala untuk memastikan efektivitas dan keberlanjutan pelaksanaan kolaborasi.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
  `;
}

export function initAbout() {}
