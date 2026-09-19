const WHATSAPP_NUMBER = '58XXXXXXXXXX';
const ADMIN_PASS = 'aurafit2024';
const INSTAGRAM_USER = 'aurafit';
const SIZES_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ÚNICO', 'T1', 'T2', 'T3'];

function showToast(message, type = 'default') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast show' + (type === 'warning' ? ' toast-warning' : '');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initBackToTop() {
  const backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.textContent = '↑';
  backToTop.setAttribute('aria-label', 'Volver arriba');
  backToTop.className = 'btn-primary';
  backToTop.style.cssText = 'position:fixed;bottom:80px;right:24px;width:44px;height:44px;border-radius:50%;display:none;z-index:500;padding:0;font-size:18px;align-items:center;justify-content:center;cursor:pointer;';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackToTop);
} else {
  initBackToTop();
}

function downloadCSV(rows, headers, filename) {
  const processRow = (row) =>
    row
      .map((val) => {
        let text = val === null || val === undefined ? '' : String(val);
        text = text.replace(/"/g, '""');
        if (text.search(/("|,|\n)/g) >= 0) {
          text = `"${text}"`;
        }
        return text;
      })
      .join(',');

  const csvContent = [headers ? processRow(headers) : null, ...rows.map(processRow)]
    .filter(Boolean)
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
