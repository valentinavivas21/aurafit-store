let adminLoggedIn = false;
let logoClickCount = 0;
let logoClickTimer = null;

function openAdminLogin() {
  const modal = document.getElementById('modal-login');
  if (!modal) return;
  modal.removeAttribute('hidden');
  modal.style.display = 'flex';
  const input = document.getElementById('admin-password-input');
  if (input) input.value = '';
  const error = document.getElementById('login-error');
  if (error) error.style.display = 'none';
  setTimeout(() => input?.focus(), 100);
}

function closeAdminLogin() {
  const modal = document.getElementById('modal-login');
  if (modal) {
    modal.style.display = 'none';
  }
}

function doLogin() {
  const input = document.getElementById('admin-password-input');
  const error = document.getElementById('login-error');
  if (!input) return;

  if (input.value === ADMIN_PASS) {
    adminLoggedIn = true;
    closeAdminLogin();
    goTo('screen-admin');
    loadPanel('dashboard');
  } else {
    if (error) {
      error.textContent = 'Contraseña incorrecta';
      error.style.display = 'block';
    }
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
    input.value = '';
    input.focus();
  }
}

function logoutAdmin() {
  adminLoggedIn = false;
  goTo('screen-store');
  showToast('Sesión cerrada');
}

function loadPanel(name) {
  // Update sidebar active state
  document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById('nav-' + name)?.classList.add('active');

  // Load panel content
  const content = document.getElementById('admin-content');
  if (!content) return;
  content.innerHTML = '<div style="color:var(--text-muted);padding:40px;text-align:center">Cargando...</div>';

  switch (name) {
    case 'dashboard':
      if (typeof renderDashboard === 'function') renderDashboard();
      break;
    case 'products':
      if (typeof renderProducts_admin === 'function') renderProducts_admin();
      break;
    case 'incomes':
      if (typeof renderIncomes === 'function') renderIncomes();
      break;
    case 'sales':
      if (typeof renderSales === 'function') renderSales();
      break;
    case 'outofstock':
      if (typeof renderOutOfStock === 'function') renderOutOfStock();
      break;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Keyboard shortcut Ctrl+Shift+A
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      openAdminLogin();
    }
  });

  // Logo click 5 times
  const logo = document.querySelector('.logo-aura');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      logoClickCount++;
      clearTimeout(logoClickTimer);
      logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 2000);
      if (logoClickCount >= 5) {
        logoClickCount = 0;
        openAdminLogin();
      }
    });
  }

  // Login modal events
  document.getElementById('btn-admin-login')?.addEventListener('click', doLogin);
  document.getElementById('admin-password-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
    if (e.key === 'Escape') closeAdminLogin();
  });
  document.getElementById('modal-login')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAdminLogin();
  });

  // Sidebar navigation
  document.getElementById('nav-dashboard')?.addEventListener('click', () => loadPanel('dashboard'));
  document.getElementById('nav-products')?.addEventListener('click', () => loadPanel('products'));
  document.getElementById('nav-incomes')?.addEventListener('click', () => loadPanel('incomes'));
  document.getElementById('nav-sales')?.addEventListener('click', () => loadPanel('sales'));
  document.getElementById('nav-outofstock')?.addEventListener('click', () => loadPanel('outofstock'));
  document.getElementById('nav-logout')?.addEventListener('click', logoutAdmin);
});
