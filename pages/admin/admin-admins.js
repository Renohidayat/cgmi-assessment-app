// ============================================================
// pages/admin/admin-admins.js
// Multi-admin white-list management
// ============================================================

import { getAllAdmins, addAdmin, deleteAdmin } from '../../utils/firestore.js';
import { toast } from '../../components/toast.js';

export function renderAdminAdmins() {
  return `
  <div class="space-y-8">
    
    <!-- Add new admin white-list form -->
    <div class="carbon-card space-y-6">
      <div class="pb-3 border-b border-[#e0e0e0]">
        <h3 class="font-bold text-[#161616] text-base">Tambah Whitelist Admin Baru</h3>
        <p class="text-xs text-[#525252]">Daftarkan akun Gmail tim peneliti baru agar dapat login melalui Google OAuth.</p>
      </div>

      <form id="admin-whitelist-form" class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
        <div class="space-y-1">
          <label class="block text-xs font-semibold text-[#161616]">Nama Peneliti</label>
          <input type="text" id="whitelist-name" required placeholder="Contoh: Dr. Nindi"
            class="carbon-input text-xs">
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-semibold text-[#161616]">Alamat Google Gmail</label>
          <input type="email" id="whitelist-email" required placeholder="nama@gmail.com"
            class="carbon-input text-xs">
        </div>
        <button type="submit" class="carbon-button w-full sm:w-auto text-xs">
          Tambah Admin
        </button>
      </form>
    </div>

    <!-- Active Whitelist Table -->
    <div class="carbon-panel overflow-hidden">
      <div class="px-6 py-4 border-b border-[#e0e0e0]">
        <h3 class="font-bold text-[#161616] text-sm">Daftar Whitelist Admin Aktif</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="carbon-table min-w-full text-left text-xs text-[#525252]">
          <thead>
            <tr>
              <th class="px-6 py-3.5">Nama</th>
              <th class="px-6 py-3.5">Surel (Email)</th>
              <th class="px-6 py-3.5">Aksi</th>
            </tr>
          </thead>
          <tbody id="admins-tbody">
            <tr>
              <td colspan="3" class="px-6 py-10 text-center text-[#8c8c8c]">Memuat whitelist admin...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
  `;
}

export async function initAdminAdmins() {
  const tbody = document.getElementById('admins-tbody');
  const form  = document.getElementById('admin-whitelist-form');

  let adminList = [];

  async function loadAdmins() {
    try {
      adminList = await getAllAdmins();
      renderTable(adminList);
    } catch (e) {
      toast.error('Gagal memuat daftar admin: ' + e.message);
    }
  }

  function renderTable(dataList) {
    if (!tbody) return;
    if (dataList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-400">Tidak ada admin terdaftar.</td></tr>`;
      return;
    }

    tbody.innerHTML = dataList.map(a => `
      <tr>
        <td class="px-6 py-4 font-bold text-slate-800">${a.name || '-'}</td>
        <td class="px-6 py-4 font-semibold text-slate-600">${a.email || '-'}</td>
        <td class="px-6 py-4">
          <button data-id="${a.id || a.uid}" class="carbon-button-danger text-xs btn-delete-admin">Cabut Akses</button>
        </td>
      </tr>
    `).join('');

    // Attach deletion handlers
    tbody.querySelectorAll('.btn-delete-admin').forEach(btn => {
      btn.addEventListener('click', async () => {
        const docId = btn.getAttribute('data-id');
        if (confirm('Apakah Anda yakin ingin mencabut hak akses admin untuk akun ini?')) {
          try {
            await deleteAdmin(docId);
            toast.success('Akses admin berhasil dicabut.');
            loadAdmins();
          } catch (err) {
            toast.error('Gagal menghapus admin: ' + err.message);
          }
        }
      });
    });
  }

  // Handle addition form submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('whitelist-name').value.trim();
      const email = document.getElementById('whitelist-email').value.trim().toLowerCase();

      if (!name || !email) {
        toast.error('Nama dan alamat Gmail wajib diisi.');
        return;
      }

      const existingAdmin = adminList.some(a => (a.email || '').toLowerCase() === email);
      if (existingAdmin) {
        toast.error('Akun admin dengan email tersebut sudah terdaftar.');
        return;
      }

      const docId = email;

      try {
        await addAdmin(docId, { name, email });
        toast.success(`Admin "${name}" berhasil didaftarkan.`);
        form.reset();
        await loadAdmins();
      } catch (err) {
        toast.error('Gagal mendaftarkan admin: ' + err.message);
      }
    });
  }

  loadAdmins();
}
