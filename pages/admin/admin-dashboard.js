// ============================================================
// pages/admin/admin-dashboard.js
// Macro dashboard with counters and pie distribution chart
// ============================================================

import { getAllAssessments } from '../../utils/firestore.js';
import { getMaturityLevel, MATURITY_LEVELS } from '../../utils/assessment-logic.js';
import { toast } from '../../components/toast.js';

export function renderAdminDashboard() {
  return `
  <div class="space-y-8">
    
    <!-- Loading Area -->
    <div id="admin-dash-loading" class="animate-pulse space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="h-28 carbon-skeleton"></div>
        <div class="h-28 carbon-skeleton"></div>
        <div class="h-28 carbon-skeleton"></div>
      </div>
      <div class="h-96 carbon-skeleton"></div>
    </div>

    <!-- Main Content Area -->
    <div id="admin-dash-content" class="hidden space-y-8">
      
      <!-- Counters Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="carbon-panel flex items-center justify-between">
          <div class="space-y-1">
            <span class="carbon-meta-label">Total Responden</span>
            <h3 class="text-3xl font-black" id="stat-total-org">0</h3>
          </div>
          <span class="carbon-badge carbon-badge-primary">Responden</span>
        </div>
        <div class="carbon-panel flex items-center justify-between">
          <div class="space-y-1">
            <span class="carbon-meta-label">Rata-Rata Indeks</span>
            <h3 class="text-3xl font-black" id="stat-avg-score">0.00</h3>
          </div>
          <span class="carbon-badge carbon-badge-primary">Rata-Rata</span>
        </div>
        <div class="carbon-panel flex items-center justify-between">
          <div class="space-y-1">
            <span class="carbon-meta-label">Tingkat Tertinggi</span>
            <h3 class="text-base font-black leading-tight" id="stat-top-maturity">N/A</h3>
          </div>
          <span class="carbon-badge carbon-badge-primary">Puncak</span>
        </div>
      </div>

      <!-- Pie Chart / Distribution Panel -->
      <div class="carbon-panel space-y-6">
        <div class="carbon-panel-heading">
          <h3 class="font-bold text-base">Distribusi Tingkat Kematangan Organisasi</h3>
          <p class="carbon-caption text-xs">Presentasi persentase kematangan kolaborasi seluruh mitra yang berpartisipasi.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Canvas for Pie Chart -->
          <div class="relative w-full max-w-xs mx-auto aspect-square flex items-center justify-center">
            <canvas id="pieChartCanvas" class="w-full max-h-[250px]"></canvas>
          </div>

          <!-- Color Coding Indicators -->
          <div class="space-y-3" id="pie-legend-list">
            <!-- Dynamically populated labels and counts -->
          </div>
        </div>
      </div>

    </div>

  </div>
  `;
}

let pieChartInstance = null;

export async function initAdminDashboard() {
  const loading = document.getElementById('admin-dash-loading');
  const content = document.getElementById('admin-dash-content');

  try {
    const list = await getAllAssessments();

    if (loading) loading.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    if (list.length === 0) {
      document.getElementById('stat-total-org').innerText   = '0';
      document.getElementById('stat-avg-score').innerText   = '0.00';
      document.getElementById('stat-top-maturity').innerText = 'Belum ada data';
      return;
    }

    // Calculations
    const totalCount = list.length;
    const sumScore   = list.reduce((sum, item) => sum + (item.totalAverageScore || 0), 0);
    const avgScore   = parseFloat((sumScore / totalCount).toFixed(2));
    
    document.getElementById('stat-total-org').innerText = totalCount.toString();
    document.getElementById('stat-avg-score').innerText = avgScore.toFixed(2);
    document.getElementById('stat-top-maturity').innerText = getMaturityLevel(avgScore).label;

    // Distribution counts per maturity level label
    const counts = {};
    MATURITY_LEVELS.forEach(l => { counts[l.label] = 0; });
    
    list.forEach(item => {
      const ml = getMaturityLevel(item.totalAverageScore || 0);
      if (counts[ml.label] !== undefined) {
        counts[ml.label]++;
      }
    });

    // Populate legend with custom numbers
    const legendList = document.getElementById('pie-legend-list');
    legendList.innerHTML = MATURITY_LEVELS.map(l => {
      const cnt = counts[l.label] || 0;
      const pct = totalCount ? Math.round((cnt / totalCount) * 100) : 0;
      return `
        <div class="carbon-panel flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="legend-dot" style="background-color: ${l.color}"></span>
            <span class="font-semibold text-[#161616]">${l.label}</span>
          </div>
          <span class="font-bold text-[#161616]">${cnt} Org (${pct}%)</span>
        </div>
      `;
    }).reverse().join(''); // Reverse to show levels descending

    // Pie Chart
    const ctx = document.getElementById('pieChartCanvas');
    if (!ctx) return;

    if (pieChartInstance) {
      pieChartInstance.destroy();
    }

    pieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: MATURITY_LEVELS.map(l => l.label),
        datasets: [{
          data: MATURITY_LEVELS.map(l => counts[l.label] || 0),
          backgroundColor: MATURITY_LEVELS.map(l => l.color),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });

  } catch (err) {
    toast.error('Gagal memuat visualisasi makro: ' + err.message);
  }
}
