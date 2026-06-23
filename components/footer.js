// ============================================================
// components/footer.js
// Site footer with team member names
// ============================================================

export function renderFooter() {
  return `
  <footer class="bg-[#161616] text-white mt-auto">
    <div class="max-w-[1584px] mx-auto px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div>
          <p class="text-xs font-semibold tracking-[0.16em] text-white/70 mb-4">CGMI</p>
          <p class="text-base font-normal leading-7 text-white/90">
            Alat asesmen tata kelola kolaborasi yang memberikan hasil terstruktur dan rekomendasi berbasiskan data untuk instansi publik.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-6 text-sm text-white/70">
          <div>
            <p class="font-semibold text-white mb-3">Navigasi</p>
            <ul class="space-y-2">
              <li><a href="#/" class="hover:text-white">Beranda</a></li>
              <li><a href="#/about" class="hover:text-white">Tentang CGMI</a></li>
              <li><a href="#/login" class="hover:text-white">Masuk / Daftar</a></li>
              <li><a href="#/assessment" class="hover:text-white">Mulai Asesmen</a></li>
            </ul>
          </div>
          <div>
            <p class="font-semibold text-white mb-3">Peneliti</p>
            <ul class="space-y-2">
              ${['Ajeng', 'Arya', 'Farrel', 'Yusuf', 'Nindi'].map(name => `<li>${name}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-10 border-t border-white/10 pt-6 text-xs text-white/60 flex flex-col sm:flex-row justify-between gap-3">
        <span>© ${new Date().getFullYear()} CGMI – Collaboration Governance Maturity Index</span>
        <span>Universitas Sabelas April</span>
      </div>
    </div>
  </footer>
  `;
}
