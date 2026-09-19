let adminLoggedIn = false;
let logoClickCount = 0;
let logoClickTimer = null;
let editingProductId = null;
let formColors = [];

function openAdminLogin() {
  const modal = document.getElementById('modal-login');
  if (!modal) return;
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
      renderProducts_admin();
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

/* ==========================================================================
   PRODUCT MANAGEMENT (ADMIN)
   ========================================================================== */

function renderProducts_admin() {
  const content = document.getElementById('admin-content');
  if (!content) return;

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <h2 style="font-family:var(--font-serif);font-size:28px;font-weight:400">Productos</h2>
      <button class="btn-primary" onclick="openProductForm()">＋ Nuevo Producto</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:2px solid var(--border)">
            ${['Nombre', 'Categoría', 'Precio', 'Costo', 'Stock Total', 'Estado', 'Acciones'].map(h =>
              `<th style="text-align:left;padding:12px 16px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted)">${h}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${products.map(p => {
            const totalStock = p.colors.reduce((sum, c) => sum + getTotalStock(p, c.name), 0);
            return `<tr style="border-bottom:1px solid var(--border)">
              <td style="padding:14px 16px;font-weight:500">${p.name}</td>
              <td style="padding:14px 16px;color:var(--text-muted)">${p.category}</td>
              <td style="padding:14px 16px">$${p.price}</td>
              <td style="padding:14px 16px;color:var(--text-muted)">$${p.cost}</td>
              <td style="padding:14px 16px">
                <span style="font-weight:600;color:${totalStock === 0 ? 'var(--danger)' : 'inherit'}">${totalStock}</span>
              </td>
              <td style="padding:14px 16px">
                <span class="badge ${p.active ? 'badge-active' : 'badge-inactive'}">${p.active ? 'Activo' : 'Inactivo'}</span>
              </td>
              <td style="padding:14px 16px">
                <button class="btn-ghost" style="font-size:13px;margin-right:8px" onclick="openProductForm('${p.id}')">Editar</button>
                <button class="btn-ghost" style="font-size:13px;color:${p.active ? 'var(--danger)' : 'var(--champagne)'}" 
                  onclick="toggleProduct('${p.id}')">${p.active ? 'Desactivar' : 'Activar'}</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

function toggleProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  p.active = !p.active;
  saveProducts();
  renderProducts_admin();
  if (typeof renderProducts === 'function') renderProducts();
  showToast(p.active ? '✅ Producto activado' : 'Producto desactivado');
}

function openProductForm(productId = null) {
  editingProductId = productId;
  const p = productId ? products.find(x => x.id === productId) : null;
  const modal = document.getElementById('modal-product');
  if (!modal) return;

  document.getElementById('modal-product-title').textContent = p ? 'Editar Producto' : 'Nuevo Producto';
  document.getElementById('prod-name').value = p?.name || '';
  document.getElementById('prod-category').value = p?.category || 'Tops';
  document.getElementById('prod-price').value = p?.price !== undefined ? p.price : '';
  document.getElementById('prod-cost').value = p?.cost !== undefined ? p.cost : '';
  document.getElementById('prod-description').value = p?.description || '';

  // Initialize colors
  formColors = p?.colors ? JSON.parse(JSON.stringify(p.colors)) : [{ name: '', hex: '#000000' }];
  renderColorsEditor(formColors);

  // Render size checkboxes
  SIZES_ORDER.forEach(s => {
    const cb = document.getElementById('size-' + s);
    if (cb) cb.checked = p ? p.sizes.includes(s) : false;
  });

  // Render stock grid
  renderStockGrid(p);

  modal.style.display = 'flex';
}

function renderColorsEditor(colors) {
  const list = document.getElementById('colors-list');
  if (!list) return;

  list.innerHTML = colors.map((c, i) => `
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px" data-color-index="${i}">
      <input type="color" value="${c.hex}" class="color-picker" data-index="${i}" 
        style="width:40px;height:40px;border:1px solid var(--border);cursor:pointer;border-radius:var(--radius)"
        onchange="updateColorHex(${i}, this.value)">
      <input type="text" class="input" placeholder="Nombre del color (ej: Negro Obsidiana)" 
        value="${c.name}" data-index="${i}" style="flex:1"
        oninput="updateColorName(${i}, this.value)">
      <button type="button" class="btn-ghost" style="color:var(--danger);font-size:18px" onclick="removeColor(${i})">×</button>
    </div>
  `).join('');
}

function updateColorHex(i, val) {
  if (formColors[i]) formColors[i].hex = val;
}

function updateColorName(i, val) {
  if (formColors[i]) formColors[i].name = val;
  renderStockGrid(null);
}

function removeColor(i) {
  formColors.splice(i, 1);
  renderColorsEditor(formColors);
  renderStockGrid(null);
}

function addColor() {
  formColors.push({ name: '', hex: '#C9A96E' });
  renderColorsEditor(formColors);
}

function renderStockGrid(product) {
  const colorRows = Array.from(document.querySelectorAll('#colors-list [data-color-index]'));
  if (colorRows.length > 0) {
    formColors = colorRows.map(row => ({
      hex: row.querySelector('input[type=color]').value,
      name: row.querySelector('input[type=text]').value
    }));
  }

  const checkedSizes = SIZES_ORDER.filter(s => document.getElementById('size-' + s)?.checked);
  const grid = document.getElementById('stock-grid');
  if (!grid) return;

  const validColors = formColors.filter(c => c.name.trim());
  if (validColors.length === 0 || checkedSizes.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);font-size:13px">Agrega colores y selecciona tallas para configurar el stock inicial.</p>';
    return;
  }

  grid.innerHTML = `
    <label class="label" style="margin-top:8px">Stock inicial por color y talla</label>
    <div style="overflow-x:auto">
      <table style="border-collapse:collapse;width:100%">
        <thead>
          <tr>
            <th style="padding:8px;font-size:11px;text-align:left;color:var(--text-muted)">Color</th>
            ${checkedSizes.map(s => `<th style="padding:8px;font-size:11px;color:var(--text-muted);text-align:center">${s}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${validColors.map(c => `
            <tr>
              <td style="padding:8px;font-size:13px">
                <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c.hex};margin-right:6px"></span>
                ${c.name}
              </td>
              ${checkedSizes.map(s => {
                const existing = product ? getStock(product, c.name, s) : 0;
                return `<td style="padding:4px"><input type="number" min="0" value="${existing}" 
                  class="input" style="width:60px;padding:6px;text-align:center"
                  data-stock-color="${c.name}" data-stock-size="${s}"></td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function saveProduct() {
  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const price = parseFloat(document.getElementById('prod-price').value);
  const cost = parseFloat(document.getElementById('prod-cost').value);
  const description = document.getElementById('prod-description').value.trim();

  if (!name || isNaN(price) || isNaN(cost)) {
    showToast('Completa los campos requeridos', 'warning');
    return;
  }

  const colors = formColors.filter(c => c.name.trim());
  if (colors.length === 0) {
    showToast('Agrega al menos un color', 'warning');
    return;
  }

  const sizes = SIZES_ORDER.filter(s => document.getElementById('size-' + s)?.checked);
  if (sizes.length === 0) {
    showToast('Selecciona al menos una talla', 'warning');
    return;
  }

  // Build stock object from grid inputs
  const stock = {};
  document.querySelectorAll('#stock-grid [data-stock-color]').forEach(input => {
    const color = input.dataset.stockColor;
    const size = input.dataset.stockSize;
    if (!stock[color]) stock[color] = {};
    stock[color][size] = parseInt(input.value) || 0;
  });

  if (editingProductId) {
    const p = products.find(x => x.id === editingProductId);
    if (p) {
      Object.assign(p, { name, category, price, cost, description, colors, sizes, stock });
    }
  } else {
    products.push({
      id: 'p' + Date.now(),
      name,
      category,
      price,
      cost,
      description,
      colors,
      sizes,
      stock,
      active: true
    });
  }

  saveProducts();
  document.getElementById('modal-product').style.display = 'none';
  renderProducts_admin();
  if (typeof renderProducts === 'function') renderProducts(); // refresh store catalog
  showToast(editingProductId ? '✅ Producto actualizado' : '✅ Producto creado');
  editingProductId = null;
}

/* ==========================================================================
   INITIALIZATION & EVENT LISTENERS
   ========================================================================== */

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

  // Product modal events
  document.getElementById('btn-save-product')?.addEventListener('click', saveProduct);
  document.getElementById('btn-add-color')?.addEventListener('click', addColor);
  document.getElementById('modal-product')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) document.getElementById('modal-product').style.display = 'none';
  });

  // Re-render stock grid when sizes change
  SIZES_ORDER.forEach(s => {
    document.getElementById('size-' + s)?.addEventListener('change', () => renderStockGrid(null));
  });
});
