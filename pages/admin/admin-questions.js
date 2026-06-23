// ============================================================
// pages/admin/admin-questions.js
// Questionnaire CRUD editor & automatic seeder
// ============================================================

import { getQuestions, addQuestion, updateQuestion, deleteQuestion, seedQuestions } from '../../utils/firestore.js';
import { DEFAULT_QUESTIONS, DIMENSIONS } from '../../utils/assessment-logic.js';
import { toast } from '../../components/toast.js';

export function renderAdminQuestions() {
  const dimOptions = DIMENSIONS.map(d => `
    <option value="${d.key}">${d.label}</option>
  `).join('');

  return `
  <div class="space-y-6">
    
    <!-- Control Header -->
    <div class="carbon-panel flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div class="flex flex-wrap gap-2">
        <button id="btn-add-q" class="carbon-button text-xs">
          Tambah Soal
        </button>
        <button id="btn-seed-q" class="carbon-button-secondary text-xs">
          Seed 30 Pertanyaan Default
        </button>
      </div>
      <span class="text-xs text-[#525252] font-semibold" id="questions-counter">Total: 0 Soal</span>
    </div>

    <!-- Table Question lists -->
    <div class="carbon-panel overflow-hidden">
      <div class="overflow-x-auto">
        <table class="carbon-table min-w-full text-left text-xs text-[#525252]">
          <thead>
            <tr>
              <th>Urutan</th>
              <th>Dimensi</th>
              <th>Pertanyaan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="questions-tbody">
            <tr>
              <td colspan="4" class="px-6 py-10 text-center text-[#8c8c8c]">Memuat bank soal...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Q Edit / Create Modal Form -->
    <div id="q-modal" class="carbon-modal-overlay hidden">
      <div class="carbon-modal-card">
        <button id="close-q-modal-btn" class="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h2 class="text-lg font-extrabold text-slate-900" id="q-modal-title">Tambah Pertanyaan</h2>
        
        <form id="q-modal-form" class="space-y-4">
          <input type="hidden" id="q-edit-id">
          
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Dimensi Tata Kelola</label>
            <select id="q-form-dimension" required class="carbon-input text-xs">
              ${dimOptions}
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Pertanyaan (Bahasa Indonesia)</label>
            <textarea id="q-form-text" required rows="3" placeholder="Masukkan indikator evaluasi..." class="carbon-input text-xs"></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">No. Urut Pengurutan</label>
            <input type="number" id="q-form-order" required min="1" max="100" value="1" class="carbon-input text-xs">
          </div>

          <button type="submit" class="carbon-button w-full text-xs">
            Simpan Pertanyaan
          </button>
        </form>
      </div>
    </div>

  </div>
  `;
}

export async function initAdminQuestions() {
  const tbody      = document.getElementById('questions-tbody');
  const addBtn     = document.getElementById('btn-add-q');
  const seedBtn    = document.getElementById('btn-seed-q');
  const modal      = document.getElementById('q-modal');
  const modalClose = document.getElementById('close-q-modal-btn');
  const form       = document.getElementById('q-modal-form');
  const counter    = document.getElementById('questions-counter');

  let questions = [];

  async function loadQuestions() {
    try {
      questions = await getQuestions();
      renderTable(questions);
    } catch (err) {
      toast.error('Gagal mengambil kuesioner: ' + err.message);
    }
  }

  function renderTable(dataList) {
    if (!tbody) return;
    if (counter) counter.innerText = `Total: ${dataList.length} Soal`;

    if (dataList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-400">Kuesioner kosong. Silakan gunakan tombol seed atau tambah soal secara manual.</td></tr>`;
      return;
    }

    tbody.innerHTML = dataList.map(q => `
      <tr>
        <td class="px-6 py-4 font-semibold text-[#525252]">${q.order ?? 1}</td>
        <td class="px-6 py-4 font-bold text-[#161616]">${q.dimension ?? '-'}</td>
        <td class="px-6 py-4 font-semibold text-[#525252] max-w-md break-words">${q.text ?? ''}</td>
        <td class="px-6 py-4 flex items-center gap-2">
          <button data-id="${q.id}" class="carbon-button-secondary carbon-button-small btn-edit-q">
            Edit
          </button>
          <button data-id="${q.id}" class="carbon-button-danger carbon-button-small btn-delete-q">
            Hapus
          </button>
        </td>
      </tr>
    `).join('');

    // Attach listeners
    tbody.querySelectorAll('.btn-edit-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.getAttribute('data-id');
        const found = dataList.find(x => x.id === qid);
        if (found) openModalForEdit(found);
      });
    });

    tbody.querySelectorAll('.btn-delete-q').forEach(btn => {
      btn.addEventListener('click', async () => {
        const qid = btn.getAttribute('data-id');
        if (confirm('Apakah Anda yakin ingin menghapus indikator pertanyaan ini?')) {
          try {
            await deleteQuestion(qid);
            toast.success('Pertanyaan berhasil dihapus.');
            loadQuestions();
          } catch (e) {
            toast.error('Gagal menghapus: ' + e.message);
          }
        }
      });
    });
  }

  // Seeding default questions
  if (seedBtn) {
    seedBtn.addEventListener('click', async () => {
      try {
        const res = await seedQuestions(DEFAULT_QUESTIONS);
        if (res.seeded) {
          toast.success(`Berhasil mengimpor ${res.count} bank soal default.`);
        } else {
          toast.warning(`Firestore telah memiliki data (${res.count} soal). Proses seed dibatalkan.`);
        }
        loadQuestions();
      } catch (err) {
        toast.error('Gagal melakukan seeding: ' + err.message);
      }
    });
  }

  // Modal open handlers
  function openModalForEdit(q = null) {
    if (!modal) return;
    modal.classList.remove('hidden');

    const title  = document.getElementById('q-modal-title');
    const qid    = document.getElementById('q-edit-id');
    const dim    = document.getElementById('q-form-dimension');
    const text   = document.getElementById('q-form-text');
    const order  = document.getElementById('q-form-order');

    if (q) {
      title.innerText = 'Edit Pertanyaan';
      qid.value = q.id;
      dim.value = q.dimensionKey || DIMENSIONS.find(d => d.label === q.dimension)?.key || '';
      text.value = q.text || '';
      order.value = q.order || 1;
    } else {
      title.innerText = 'Tambah Pertanyaan';
      qid.value = '';
      dim.value = DIMENSIONS[0].key;
      text.value = '';
      order.value = (questions.length + 1).toString();
    }
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => openModalForEdit(null));
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => modal.classList.add('hidden'));
  }

  // Save changes
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const qid    = document.getElementById('q-edit-id').value;
      const dimKey = document.getElementById('q-form-dimension').value;
      const text   = document.getElementById('q-form-text').value;
      const order  = Number(document.getElementById('q-form-order').value);

      const label = DIMENSIONS.find(d => d.key === dimKey)?.label || 'Umum';

      const data = {
        dimension: label,
        dimensionKey: dimKey,
        text,
        order,
      };

      try {
        if (qid) {
          await updateQuestion(qid, data);
          toast.success('Pertanyaan berhasil diubah.');
        } else {
          await addQuestion(data);
          toast.success('Pertanyaan berhasil ditambahkan.');
        }
        modal.classList.add('hidden');
        loadQuestions();
      } catch (err) {
        toast.error('Gagal menyimpan: ' + err.message);
      }
    });
  }

  // Load questions automatically
  loadQuestions();
}
