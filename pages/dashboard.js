// ============================================================
// pages/dashboard.js
// User Dashboard & Results Page displaying Spider Radar Chart
// ============================================================

import { getLatestAssessment } from '../utils/firestore.js';
import { getMaturityLevel, getRecommendations, DIMENSIONS } from '../utils/assessment-logic.js';
import { toast } from '../components/toast.js';

export function renderDashboard() {
  return `
  <div class="carbon-page-shell">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div id="dashboard-loading" class="animate-pulse space-y-6">
        <div class="h-10 carbon-skeleton w-1/4"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 h-96 carbon-skeleton"></div>
          <div class="h-96 carbon-skeleton"></div>
        </div>
      </div>

      <div id="dashboard-content" class="hidden space-y-8">

        <!-- Header Profile -->
        <div class="carbon-card">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-black" id="dash-org-name">Nama Organisasi</h1>
              <p class="carbon-caption text-sm mt-1" id="dash-meta-info">Riwayat asesmen tingkat kematangan kolaborasi Anda</p>
            </div>
            <a href="#/assessment" class="carbon-button inline-flex items-center gap-2 text-sm">
              Ikuti Asesmen Ulang
            </a>
          </div>
        </div>

        <!-- Grid Results -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Column 1 & 2: Main score detail & chart -->
          <div class="lg:col-span-2 space-y-8">

            <!-- Overall score & Badge -->
            <div class="carbon-card grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div class="space-y-2">
                <span class="carbon-meta-label">Skor Indeks Rata-rata</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-5xl sm:text-6xl font-black" id="dash-score-num">0.00</span>
                  <span class="carbon-caption text-lg font-bold">/ 5.00</span>
                </div>
                <div class="pt-2">
                  <span id="dash-maturity-badge" class="carbon-badge">
                    Level 1 - Initial
                  </span>
                </div>
              </div>
              <div class="carbon-panel space-y-2">
                <h4 class="font-bold text-sm">Deskripsi Tingkat Kematangan:</h4>
                <p class="carbon-caption text-xs leading-relaxed" id="dash-maturity-desc">
                  Deskripsi tingkat kematangan berdasarkan hasil kalkulasi skor total rata-rata organisasi.
                </p>
              </div>
            </div>

            <!-- Radar chart card -->
            <div class="carbon-panel space-y-4">
              <div class="flex justify-between items-center carbon-panel-heading">
                <h3 class="font-bold text-base">Visualisasi Kematangan 6 Dimensi</h3>
                <span class="carbon-badge uppercase tracking-widest">Radar Chart</span>
              </div>
              <div class="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
                <canvas id="radarChartCanvas" class="w-full max-h-[350px]"></canvas>
              </div>
            </div>

          </div>

          <!-- Column 3: Recommendations Panel -->
          <div class="space-y-8">
            <div class="carbon-panel space-y-6">
              <div class="carbon-panel-heading">
                <h3 class="font-bold text-base">Rekomendasi Tindakan</h3>
                <p class="carbon-caption text-xs">Arahan perbaikan taktis berdasarkan dimensi bernilai rendah (&lt; 3.00)</p>
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
      <div id="dashboard-empty-state" class="hidden carbon-card text-center py-20 max-w-xl mx-auto space-y-6">
        <h2 class="text-2xl font-bold">Belum Ada Riwayat Asesmen</h2>
        <p class="carbon-caption max-w-sm mx-auto text-sm leading-relaxed">
          Organisasi Anda belum pernah mengisi kuesioner CGMI. Mulai pengisian sekarang untuk mendapatkan hasil pengukuran tata kelola kolaborasi publik.
        </p>
        <div>
          <a href="#/assessment" class="carbon-button">
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

  if (!currentUser) return;

  try {
    const latest = await getLatestAssessment(currentUser.uid);

    if (loadingArea) loadingArea.classList.add('hidden');

    if (!latest) {
      if (emptyArea) emptyArea.classList.remove('hidden');
      return;
    }

    if (contentArea) contentArea.classList.remove('hidden');

    // Populate data
    document.getElementById('dash-org-name').innerText = latest.organization || 'Organisasi Tanpa Nama';
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
    
    if (recs.length === 0) {
      recsContainer.innerHTML = `
        <div class="carbon-panel carbon-panel-sm text-center text-xs">
          Luar biasa! Seluruh dimensi tata kelola kolaborasi organisasi Anda berada pada level prima (&ge; 3.00). Lanjutkan performa baik ini.
        </div>
      `;
    } else {
      recsContainer.innerHTML = recs.map(r => `
        <div class="carbon-panel carbon-panel-sm space-y-2">
          <div class="flex items-center gap-2 text-sm font-bold">
            <span>${r.icon}</span>
            <span>${r.label} (Skor: ${r.score.toFixed(2)})</span>
          </div>
          <p class="carbon-caption text-xs leading-relaxed">${r.text}</p>
        </div>
      `).join('');
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
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: '#2563eb',
          borderWidth: 2,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#2563eb'
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
            angleLines: { display: true, color: '#e2e8f0' },
            grid: { color: '#e2e8f0' },
            suggestedMin: 1,
            suggestedMax: 5,
            ticks: {
              stepSize: 1,
              font: { size: 10 }
            },
            pointLabels: {
              font: {
                family: 'Inter',
                size: 10,
                weight: 'bold'
              },
              color: '#475569'
            }
          }
        }
      }
    });

  } catch (err) {
    toast.error('Gagal memuat hasil kuesioner: ' + err.message);
  }
}
