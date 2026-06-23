// ============================================================
// components/toast.js
// Non-blocking toast notification system
// ============================================================

let container = null;

function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.right = '0';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';
    container.style.padding = '8px 16px';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);
  }
  return container;
}

const ICONS = {
  success: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"></path></svg>`,
  error: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6"></path><path d="M6 6l12 12"></path></svg>`,
  info: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`,
  warning: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18"></path><path d="M12 9v2"></path><path d="M12 15h.01"></path></svg>`,
};

const CLASS_NAMES = {
  success: 'toast-bar success',
  error: 'toast-bar error',
  info: 'toast-bar info',
  warning: 'toast-bar warning',
};

export function showToast(message, type = 'info', duration = 4000) {
  const c = getContainer();
  const toast = document.createElement('div');
  toast.className = CLASS_NAMES[type] || CLASS_NAMES.info;
  toast.style.transform = 'translateY(-16px)';
  toast.style.opacity = '0';
  toast.style.transition = 'transform 180ms ease, opacity 180ms ease';

  toast.innerHTML = `
    <span class="shrink-0">${ICONS[type] || ICONS.info}</span>
    <span class="flex-1">${message}</span>
    <button class="toast-close-button" aria-label="Tutup notifikasi">×</button>
  `;

  c.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  toast.querySelector('.toast-close-button')?.addEventListener('click', () => {
    toast.style.transform = 'translateY(-16px)';
    toast.style.opacity = '0';
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  });

  if (duration > 0) {
    setTimeout(() => {
      toast.style.transform = 'translateY(-16px)';
      toast.style.opacity = '0';
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  }
}

export const toast = {
  success: (msg, d) => showToast(msg, 'success', d),
  error: (msg, d) => showToast(msg, 'error', d),
  info: (msg, d) => showToast(msg, 'info', d),
  warning: (msg, d) => showToast(msg, 'warning', d),
};
