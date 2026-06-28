// ============================================================
// pages/admin/admin-layout.js
// Sidebar navigation layout for Admin panel
// ============================================================

export function renderAdminLayout(subViewHtml, activeSubTab) {
  const tabs = [
    { key: 'dashboard',   label: 'Dasbor Makro',      href: '#/admin' },
    { key: 'respondents', label: 'Data Responden',     href: '#/admin/respondents' },
    { key: 'questions',   label: 'Manajemen Survei',  href: '#/admin/questions' },
    { key: 'admins',      label: 'Multi-Admin',       href: '#/admin/admins' },
  ];

  const sidebarLinks = tabs.map(t => {
    const isActive = activeSubTab === t.key;
    const activeClass = isActive ? 'carbon-sidebar-link active' : 'carbon-sidebar-link';
    return `
      <a href="${t.href}" class="${activeClass} whitespace-nowrap text-xs sm:text-sm">
        <span>${t.label}</span>
      </a>
    `;
  }).join('');

  return `
  <div class="carbon-page-shell">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Layout Header -->
      <div class="carbon-card mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-2xl font-black">Panel Administrasi</h1>
            <p class="carbon-caption text-xs mt-1">Kelola data makro organisasi publik, kuesioner, dan hak akses admin.</p>
          </div>
          <div class="carbon-badge carbon-badge-primary text-xs shrink-0">
            Google Authenticated
          </div>
        </div>
      </div>

      <!-- Main Body: Sidebar + Dynamic Panel Container -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-3 carbon-panel p-2 sm:p-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 sm:gap-2 items-center lg:items-stretch">
          <div class="px-2 lg:px-4 carbon-panel-heading hidden lg:block mb-2">
            <span class="carbon-meta-label">Menu Navigasi</span>
          </div>
          ${sidebarLinks}
        </div>

        <!-- Dynamic Panel Content -->
        <div class="lg:col-span-9" id="admin-subview-root">
          ${subViewHtml}
        </div>

      </div>

    </div>
  </div>
  `;
}
