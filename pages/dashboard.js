import { getLatestAssessment } from '../utils/firestore.js';
import { getMaturityLevel, getRecommendations, DIMENSIONS } from '../utils/assessment-logic.js';
import { toast } from '../components/toast.js';

export function renderDashboard() {
  return `
  <div class="py-16 px-4 sm:px-6 bg-[#0a0a0a] min-h-screen">
    <div class="max-w-6xl mx-auto">
      <div id="dashboard-loading" class="animate-pulse space-y-6">
        <div class="h-10 bg-[#272a33] w-1/4"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 h-96 bg-[#272a33]"></div>
          <div class="h-96 bg-[#272a33]"></div>
        </div>
      </div>

      <div id="dashboard-content" class="hidden space-y-8">

        <!-- Header Profile -->
        <div class="bg-[#1d1f28] border border-[#424656] p-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-black text-white" id="dash-org-name">Nama Organisasi</h1>
              <p class="text-[#8c8c8c] text-sm mt-1" id="dash-meta-info">Riwayat asesmen tingkat kematangan kolaborasi Anda</p>
            </div>
          </div>
        </div>

        <!-- Grid Results -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Column 1 & 2: Main score detail & chart -->
          <div class="lg:col-span-2 space-y-8">

            <!-- Overall score & Badge -->
            <div class="bg-[#1d1f28] border border-[#424656] p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div class="space-y-2">
                <span class="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#8c8c8c]">Skor Indeks Rata-rata</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-5xl sm:text-6xl font-black text-white" id="dash-score-num">0.00</span>
                  <span class="text-[#8c8c8c] text-lg font-bold">/ 5.00</span>
                </div>
                <div class="pt-2">
                  <span id="dash-maturity-badge" class="inline-block px-3 py-1 text-xs font-semibold border border-[#424656] text-[#b4c5ff] bg-[#0f62fe]/10">
                    Level 1 - Initial
                  </span>
                </div>
              </div>
              <div class="bg-[#11131c] border border-[#424656] p-4 space-y-2">
                <h4 class="font-bold text-sm text-white">Deskripsi Tingkat Kematangan:</h4>
                <p class="text-[#8c8c8c] text-xs leading-relaxed" id="dash-maturity-desc">
                  Deskripsi tingkat kematangan berdasarkan hasil kalkulasi skor total rata-rata organisasi.
                </p>
              </div>
            </div>

            <!-- Radar chart card -->
            <div class="bg-[#1d1f28] border border-[#424656] p-6 space-y-4">
              <div class="flex justify-between items-center pb-4 border-b border-[#424656]">
                <h3 class="font-bold text-base text-white">Visualisasi Kematangan 6 Dimensi</h3>
                <span class="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#8c8c8c] border border-[#424656] px-3 py-1">Radar Chart</span>
              </div>
              <div class="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
                <canvas id="radarChartCanvas" class="w-full max-h-[350px]"></canvas>
              </div>
            </div>

          </div>

          <!-- Column 3: Recommendations Panel -->
          <div class="space-y-8">
            <div class="bg-[#1d1f28] border border-[#424656] p-6 space-y-6">
              <div class="pb-4 border-b border-[#424656]">
                <h3 class="font-bold text-base text-white">Rekomendasi Tindakan</h3>
                <p class="text-[#8c8c8c] text-xs mt-1">Arahan tindakan spesifik per dimensi disesuaikan dengan tingkat kematangan masing-masing</p>
              </div>

              <!-- Recommendation List container -->
              <div class="space-y-4 max-h-[420px] overflow-y-auto pr-1" id="dash-recs-container">
                <!-- Recommendations will be populated here -->
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- No assessment state -->
      <div id="dashboard-empty-state" class="hidden bg-[#1d1f28] border border-[#424656] text-center py-20 max-w-xl mx-auto space-y-6 px-8">
        <h2 class="text-2xl font-bold text-white">Belum Ada Riwayat Asesmen</h2>
        <p class="text-[#8c8c8c] max-w-sm mx-auto text-sm leading-relaxed">
          Organisasi Anda belum pernah mengisi kuesioner CGMI. Mulai pengisian sekarang untuk mendapatkan hasil pengukuran tata kelola kolaborasi publik.
        </p>
        <div>
          <a href="#/assessment" class="bg-[#0f62fe] hover:bg-[#0050e6] text-white px-8 py-3 text-sm font-semibold transition-colors inline-block">
            Mulai Kuesioner
          </a>
        </div>
      </div>

    </div>
  </div>
  `;
}

let radarChartInstance = null;

export async function initDashboard(currentUser) {
  const loadingArea = document.getElementById('dashboard-loading');
  const contentArea = document.getElementById('dashboard-content');
  const emptyArea   = document.getElementById('dashboard-empty-state');
  const profileArea = document.getElementById('dashboard-profile-setup-container');

  if (!currentUser) {
    if (loadingArea) loadingArea.classList.add('hidden');
    if (emptyArea) emptyArea.classList.remove('hidden');
    return;
  }

  try {
    const latest = await getLatestAssessment(currentUser.uid);

    if (loadingArea) loadingArea.classList.add('hidden');

    if (!latest) {
      if (emptyArea) emptyArea.classList.remove('hidden');
      return;
    }

    if (contentArea) contentArea.classList.remove('hidden');

    // Populate data
    document.getElementById('dash-org-name').innerText = latest.organization || 'Instansi Tanpa Nama';
    const scoreVal = latest.totalAverageScore || 0;
    document.getElementById('dash-score-num').innerText = scoreVal.toFixed(2);
    
    // Date formatting
    const subDate = latest.submittedAt?.toDate ? latest.submittedAt.toDate() : new Date(latest.submittedAt);
    document.getElementById('dash-meta-info').innerText = `Asesmen disubmit pada: ${subDate.toLocaleString('id-ID')}`;

    // Maturity Level
    const levelObj = getMaturityLevel(scoreVal);
    const badge = document.getElementById('dash-maturity-badge');
    badge.innerText = levelObj.label;
    badge.className = 'carbon-badge ' + levelObj.badge;
    
    document.getElementById('dash-maturity-desc').innerText = levelObj.description;

    // Recommendations Engine
    const recs = getRecommendations(latest.scoresPerDimension || {});
    const recsContainer = document.getElementById('dash-recs-container');
    
    const levelColors = {
      1: { bg: 'bg-red-900/30', border: 'border-red-700', text: 'text-red-400', badge: 'bg-red-900 text-red-300' },
      2: { bg: 'bg-orange-900/30', border: 'border-orange-700', text: 'text-orange-400', badge: 'bg-orange-900 text-orange-300' },
      3: { bg: 'bg-yellow-900/30', border: 'border-yellow-700', text: 'text-yellow-400', badge: 'bg-yellow-900 text-yellow-300' },
      4: { bg: 'bg-blue-900/30', border: 'border-blue-700', text: 'text-blue-400', badge: 'bg-blue-900 text-blue-300' },
      5: { bg: 'bg-green-900/30', border: 'border-green-700', text: 'text-green-400', badge: 'bg-green-900 text-green-300' },
    };
    if (recs.length === 0) {
      recsContainer.innerHTML = `
        <div class="bg-[#11131c] border border-[#424656] p-4 text-center text-xs text-[#8c8c8c]">
          Data rekomendasi tidak tersedia.
        </div>
      `;
    } else {
      recsContainer.innerHTML = recs.map(r => {
        const lv = r.level || 1;
        const clr = levelColors[lv] || levelColors[1];
        return `
        <div class="bg-[#11131c] border ${clr.border} p-4 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2 text-sm font-bold text-white">
              <span>${r.icon}</span>
              <span>${r.label}</span>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded ${clr.badge}">${r.maturity?.label ?? 'Level ' + lv}</span>
              <span class="text-[10px] ${clr.text} font-semibold">Skor: ${r.score.toFixed(2)}</span>
            </div>
          </div>
          <p class="text-[#8c8c8c] text-xs leading-relaxed">${r.text}</p>
        </div>
        `;
      }).join('');
    }

    // Chart.js Radar Initialization
    const ctx = document.getElementById('radarChartCanvas');
    if (!ctx) return;

    if (radarChartInstance) {
      radarChartInstance.destroy();
    }

    const labels = DIMENSIONS.map(d => d.label);
    const dataValues = DIMENSIONS.map(d => latest.scoresPerDimension[d.label] || 0);

    radarChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Skor Dimensi',
          data: dataValues,
          backgroundColor: 'rgba(15, 98, 254, 0.2)',
          borderColor: '#b4c5ff',
          borderWidth: 2,
          pointBackgroundColor: '#b4c5ff',
          pointBorderColor: '#1d1f28',
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#b4c5ff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            angleLines: { display: true, color: '#424656' },
            grid: { color: '#424656' },
            suggestedMin: 1,
            suggestedMax: 5,
            ticks: {
              stepSize: 1,
              font: { size: 10 },
              color: '#8c8c8c',
              backdropColor: 'transparent'
            },
            pointLabels: {
              font: {
                family: 'IBM Plex Sans',
                size: 10,
                weight: 'bold'
              },
              color: '#c3c6d8'
            }
          }
        }
      }
    });

  } catch (err) {
    toast.error('Gagal memuat hasil kuesioner: ' + err.message);
  }
}
