// ============================================================
// pages/admin/admin-respondents.js
// Respondent management, data table with Search/Export/Radar details modal
// ============================================================

import { getAllAssessments } from '../../utils/firestore.js';
import { exportAssessments } from '../../utils/export.js';
import { DIMENSIONS } from '../../utils/assessment-logic.js';
import { toast } from '../../components/toast.js';

export function renderAdminRespondents() {
  return `
  <div class="space-y-6">
    
    <!-- Action panel and search -->
    <div class="carbon-panel flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div class="w-full sm:max-w-xs">
        <input type="text" id="respondent-search" placeholder="Cari organisasi atau narahubung..." class="carbon-input text-xs">
      </div>
      <button id="btn-export-csv" class="carbon-button text-xs w-full sm:w-auto">
        Ekspor CSV
      </button>
    </div>

    <!-- Data Table Card -->
    <div class="carbon-panel overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
              <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Narahubung</th>
              <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Organisasi</th>
              <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Skor</th>
              <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Kematangan</th>
              <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody id="respondents-tbody" class="bg-white divide-y divide-slate-100 text-xs text-slate-700">
            <tr>
              <td colspan="6" class="px-6 py-10 text-center text-slate-400">Memuat data responden...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View details radar modal overlay -->
    <div id="details-modal" class="carbon-modal-overlay hidden">
      <div class="carbon-modal-card">
        <button id="close-modal-btn" class="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div class="space-y-1">
          <h2 class="text-xl font-extrabold text-slate-900" id="modal-org-name">Nama Instansi</h2>
          <p class="text-xs text-slate-500" id="modal-org-meta">Narahubung: -</p>
        </div>

        <!-- Radar Chart Container -->
        <div class="relative w-full max-w-xs mx-auto aspect-square flex items-center justify-center">
          <canvas id="modalRadarCanvas" class="w-full max-h-[250px]"></canvas>
        </div>

        <div class="carbon-grid-2">
          <div class="carbon-panel text-xs">
            <span class="carbon-meta-label">Rata-Rata Total</span>
            <span class="carbon-panel-title" id="modal-score-val">0.00</span>
          </div>
          <div class="carbon-panel text-xs">
            <span class="carbon-meta-label">Kematangan</span>
            <span class="carbon-panel-title-sm" id="modal-maturity-val">-</span>
          </div>
        </div>
      </div>
    </div>

  </div>
  `;
}

let modalChartInstance = null;

export async function initAdminRespondents() {
  const tbody      = document.getElementById('respondents-tbody');
  const search     = document.getElementById('respondent-search');
  const exportBtn  = document.getElementById('btn-export-csv');
  const modal      = document.getElementById('details-modal');
  const modalClose = document.getElementById('close-modal-btn');

  let assessments = [];

  try {
    assessments = await getAllAssessments();
    renderTable(assessments);
  } catch (err) {
    toast.error('Gagal mengambil data responden: ' + err.message);
  }

  function renderTable(dataList) {
    if (!tbody) return;
    if (dataList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-slate-400">Tidak ada data responden ditemukan.</td></tr>`;
      return;
    }

    tbody.innerHTML = dataList.map((a, i) => `
      <tr>
        <td class="px-6 py-4 font-semibold text-slate-500">${i + 1}</td>
        <td class="px-6 py-4 font-bold text-slate-800">${a.userName || '-'}</td>
        <td class="px-6 py-4 font-semibold text-slate-700">${a.organization || '-'}</td>
        <td class="px-6 py-4 font-black text-[#161616]">${(a.totalAverageScore || 0).toFixed(2)}</td>
        <td class="px-6 py-4">
          <span class="carbon-badge text-xs" style="background: #eef4ff; border-color: #d8eafd; color: #0f62fe;">
            ${a.maturityLevel || '-'}
          </span>
        </td>
        <td class="px-6 py-4">
          <button data-id="${a.id}" class="carbon-button-secondary btn-view-details" style="padding: 8px 12px; font-size: 12px;">
            Lihat Detil
          </button>
        </td>
      </tr>
    `).join('');

    // Attach click triggers
    tbody.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const aid = btn.getAttribute('data-id');
        const found = dataList.find(x => x.id === aid);
        if (found) showDetailsModal(found);
      });
    });
  }

  // Handle Search Filtering
  if (search) {
    search.addEventListener('input', () => {
      const val = search.value.toLowerCase();
      const filtered = assessments.filter(a => 
        (a.organization || '').toLowerCase().includes(val) ||
        (a.userName || '').toLowerCase().includes(val)
      );
      renderTable(filtered);
    });
  }

  // CSV Export Trigger
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (assessments.length === 0) {
        toast.warning('Tidak ada data responden untuk diekspor.');
        return;
      }
      exportAssessments(assessments);
      toast.success('File CSV data responden berhasil diunduh.');
    });
  }

  // Details Modal handler
  function showDetailsModal(item) {
    if (!modal) return;
    modal.classList.remove('hidden');

    document.getElementById('modal-org-name').innerText = item.organization || 'Organisasi';
    document.getElementById('modal-org-meta').innerText = `Narahubung: ${item.userName || '-'} (${item.userId})`;
    document.getElementById('modal-score-val').innerText = (item.totalAverageScore || 0).toFixed(2);
    document.getElementById('modal-maturity-val').innerText = item.maturityLevel || '-';

    // Chart.js Radar Render inside modal
    const ctx = document.getElementById('modalRadarCanvas');
    if (!ctx) return;

    if (modalChartInstance) {
      modalChartInstance.destroy();
    }

    const labels = DIMENSIONS.map(d => d.label);
    const dataValues = DIMENSIONS.map(d => item.scoresPerDimension[d.label] || 0);

    modalChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: '#4f46e5',
          borderWidth: 2,
          pointBackgroundColor: '#4f46e5'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            suggestedMin: 1,
            suggestedMax: 5,
            ticks: { stepSize: 1, font: { size: 9 } },
            pointLabels: { font: { size: 9, weight: 'bold' } }
          }
        }
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => modal.classList.add('hidden'));
  }
}
