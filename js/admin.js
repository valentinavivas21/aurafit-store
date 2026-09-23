let adminLoggedIn = false;
let logoClickCount = 0;
let logoClickTimer = null;
let editingProductId = null;
let formColors = [];

let incomes = JSON.parse(localStorage.getItem('aurafit_incomes')) || [];
function saveIncomes() {
  localStorage.setItem('aurafit_incomes', JSON.stringify(incomes));
}

let sales = JSON.parse(localStorage.getItem('aurafit_sales')) || [];
let exchangeRate = parseFloat(localStorage.getItem('aurafit_rate')) || 36.5;
function saveSales() {
  localStorage.setItem('aurafit_sales', JSON.stringify(sales));
}

// ======== ADMIN LOGIN MODAL ========
const ADMIN_PASSWORD = typeof ADMIN_PASS !== 'undefined' ? ADMIN_PASS : 'aurafit2024';

function openAdminLogin() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) {
    modal.style.display = 'flex';
    const input = document.getElementById('admin-pin-display');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 100);
    }
    const err = document.getElementById('admin-pin-error');
    if (err) err.style.display = 'none';
    document.body.style.overflow = 'hidden';
  }
}

function closeAdminModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function closeAdminModalOutside(event) {
  if (event.target === document.getElementById('admin-login-modal')) {
    closeAdminModal();
  }
}

function togglePinVisibility() {
  const input = document.getElementById('admin-pin-display');
  const btn = document.getElementById('toggle-pin-visibility');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btn) btn.textContent = '🙈';
  } else {
    input.type = 'password';
    if (btn) btn.textContent = '👁';
  }
}

function submitAdminPin() {
  const input = document.getElementById('admin-pin-display');
  const err = document.getElementById('admin-pin-error');
  const val = input?.value || '';

  if (val === ADMIN_PASSWORD || (typeof ADMIN_PASS !== 'undefined' && val === ADMIN_PASS)) {
    adminLoggedIn = true;
    closeAdminModal();
    if (typeof showScreen === 'function') {
      showScreen('admin');
    }
    goTo('screen-admin');
    loadPanel('dashboard');
    showToast('¡Bienvenida al Panel de Control! 🛡️');
  } else {
    if (err) {
      err.style.display = 'block';
      err.style.animation = 'none';
      void err.offsetWidth; // reflow para reiniciar animación
      err.style.animation = '';
    }
    if (input) {
      input.value = '';
      input.style.outline = '2px solid #BA1A1A';
      setTimeout(() => { input.style.outline = ''; }, 1200);
      input.focus();
    }
  }
}

const closeAdminLogin = closeAdminModal;
const doLogin = submitAdminPin;
const openAdminModal = openAdminLogin;
window.openAdminModal = openAdminLogin;

// Permite presionar Enter / Escape para interactuar con el modal
document.addEventListener('keydown', function(e) {
  if (document.getElementById('admin-login-modal')?.style.display !== 'none' && document.getElementById('admin-login-modal')?.style.display !== '') {
    if (e.key === 'Enter') submitAdminPin();
    if (e.key === 'Escape') closeAdminModal();
  }
});

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
      renderIncomes();
      break;
    case 'sales':
      renderSales();
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
   INVENTORY INCOME MANAGEMENT (ADMIN)
   ========================================================================== */

function renderIncomes() {
  const content = document.getElementById('admin-content');
  if (!content) return;
  const activeProducts = products.filter(p => p.active);

  content.innerHTML = `
    <h2 style="font-family:var(--font-serif);font-size:28px;font-weight:400;margin-bottom:24px">Ingresos de Inventario</h2>

    <div style="background:var(--bg-card);border:1px solid var(--border);padding:24px;margin-bottom:32px;border-radius:var(--radius-lg)">
      <h3 style="font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:20px">Registrar Ingreso</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group">
          <label class="label">Fecha</label>
          <input type="date" id="inc-date" class="input" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label class="label">Producto</label>
          <select id="inc-product" class="input select" onchange="onIncomeProductChange()">
            <option value="">Seleccionar producto...</option>
            ${activeProducts.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="label">Color</label>
          <select id="inc-color" class="input select" onchange="onIncomeColorChange()">
            <option value="">Primero selecciona un producto</option>
          </select>
        </div>
        <div class="form-group">
          <label class="label">Talla</label>
          <select id="inc-size" class="input select">
            <option value="">Primero selecciona un color</option>
          </select>
        </div>
        <div class="form-group">
          <label class="label">Proveedor</label>
          <input type="text" id="inc-provider" class="input" placeholder="Nombre del proveedor">
        </div>
        <div class="form-group">
          <label class="label">N° Factura</label>
          <input type="text" id="inc-invoice" class="input" placeholder="FAC-001">
        </div>
        <div class="form-group">
          <label class="label">Costo Unitario (USD)</label>
          <input type="number" id="inc-cost-unit" class="input" min="0" step="0.01" placeholder="0.00"
            oninput="updateIncomeTotals()">
        </div>
        <div class="form-group">
          <label class="label">Unidades Ingresadas</label>
          <input type="number" id="inc-units" class="input" min="1" placeholder="0"
            oninput="updateIncomeTotals()">
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label class="label">Costo Total (calculado)</label>
          <input type="text" id="inc-total" class="input" readonly 
            style="background:var(--surface);color:var(--text-muted)" value="$0.00 USD">
        </div>
      </div>
      <button class="btn-primary" onclick="saveIncome()">Registrar Ingreso</button>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:500">Historial de Ingresos (${incomes.length})</h3>
      <button class="btn-outline" onclick="exportIncomesCSV()" style="font-size:12px;padding:8px 16px">⬇ Exportar CSV</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="border-bottom:2px solid var(--border)">
            ${['Fecha', 'Producto', 'Color', 'Talla', 'Proveedor', 'Factura', 'Costo Unit.', 'Unidades', 'Costo Total'].map(h =>
              `<th style="text-align:left;padding:10px 12px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted)">${h}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${incomes.length === 0
            ? `<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-muted)">Sin registros aún</td></tr>`
            : [...incomes].reverse().map(r => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:10px 12px">${r.date}</td>
                <td style="padding:10px 12px;font-weight:500">${r.productName}</td>
                <td style="padding:10px 12px">${r.color}</td>
                <td style="padding:10px 12px">${r.size}</td>
                <td style="padding:10px 12px;color:var(--text-muted)">${r.provider || '—'}</td>
                <td style="padding:10px 12px;color:var(--text-muted)">${r.invoice || '—'}</td>
                <td style="padding:10px 12px">$${r.costUnit}</td>
                <td style="padding:10px 12px;font-weight:500">${r.units}</td>
                <td style="padding:10px 12px;color:var(--champagne);font-weight:500">$${r.totalCost.toFixed(2)}</td>
              </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function onIncomeProductChange() {
  const productId = document.getElementById('inc-product').value;
  const colorSelect = document.getElementById('inc-color');
  const sizeSelect = document.getElementById('inc-size');
  const p = products.find(x => x.id === productId);
  if (!p) {
    colorSelect.innerHTML = '<option value="">Primero selecciona un producto</option>';
    sizeSelect.innerHTML = '<option value="">Primero selecciona un color</option>';
    return;
  }
  colorSelect.innerHTML = '<option value="">Seleccionar color...</option>' +
    p.colors.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  sizeSelect.innerHTML = '<option value="">Primero selecciona un color</option>';
}

function onIncomeColorChange() {
  const productId = document.getElementById('inc-product').value;
  const color = document.getElementById('inc-color').value;
  const sizeSelect = document.getElementById('inc-size');
  const p = products.find(x => x.id === productId);
  if (!p || !color) {
    sizeSelect.innerHTML = '<option value="">Primero selecciona un color</option>';
    return;
  }
  sizeSelect.innerHTML = '<option value="">Seleccionar talla...</option>' +
    p.sizes.map(s => `<option value="${s}">${s} (stock actual: ${getStock(p, color, s)})</option>`).join('');
}

function updateIncomeTotals() {
  const cost = parseFloat(document.getElementById('inc-cost-unit')?.value) || 0;
  const units = parseInt(document.getElementById('inc-units')?.value) || 0;
  const total = document.getElementById('inc-total');
  if (total) total.value = `$${(cost * units).toFixed(2)} USD`;
}

function saveIncome() {
  const date = document.getElementById('inc-date').value;
  const productId = document.getElementById('inc-product').value;
  const color = document.getElementById('inc-color').value;
  const size = document.getElementById('inc-size').value;
  const provider = document.getElementById('inc-provider').value.trim();
  const invoice = document.getElementById('inc-invoice').value.trim();
  const costUnit = parseFloat(document.getElementById('inc-cost-unit').value);
  const units = parseInt(document.getElementById('inc-units').value);

  if (!date || !productId || !color || !size || isNaN(costUnit) || isNaN(units) || units <= 0) {
    showToast('Completa todos los campos requeridos', 'warning');
    return;
  }

  const p = products.find(x => x.id === productId);
  if (!p) return;

  const income = {
    id: 'inc' + Date.now(),
    date,
    productId,
    productName: p.name,
    color,
    size,
    provider,
    invoice,
    costUnit,
    units,
    totalCost: costUnit * units,
    createdAt: new Date().toISOString()
  };

  incomes.push(income);
  saveIncomes();

  // Update stock
  if (!p.stock[color]) p.stock[color] = {};
  if (!p.stock[color][size]) p.stock[color][size] = 0;
  p.stock[color][size] += units;
  saveProducts();
  if (typeof renderProducts === 'function') renderProducts();

  renderIncomes();
  showToast(`✅ Ingreso registrado — +${units} unidades de ${p.name}`);
}

function exportIncomesCSV() {
  if (incomes.length === 0) {
    showToast('No hay ingresos para exportar', 'warning');
    return;
  }
  const headers = ['Fecha', 'Producto', 'Color', 'Talla', 'Proveedor', 'Factura', 'Costo Unitario', 'Unidades', 'Costo Total'];
  const rows = incomes.map(r => [
    r.date,
    r.productName,
    r.color,
    r.size,
    r.provider || '',
    r.invoice || '',
    r.costUnit,
    r.units,
    r.totalCost.toFixed(2)
  ]);
  downloadCSV(rows, headers, 'ingresos_aurafit.csv');
}

/* ==========================================================================
   SALES MANAGEMENT (ADMIN)
   ========================================================================== */

function renderSales() {
  const content = document.getElementById('admin-content');
  if (!content) return;
  const activeProducts = products.filter(p => p.active);

  content.innerHTML = `
    <h2 style="font-family:var(--font-serif);font-size:28px;font-weight:400;margin-bottom:24px">Registro de Ventas</h2>

    <div style="background:var(--bg-card);border:1px solid var(--border);padding:24px;margin-bottom:32px;border-radius:var(--radius-lg)">
      <h3 style="font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:20px">Registrar Venta</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group">
          <label class="label">Fecha</label>
          <input type="date" id="sale-date" class="input" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label class="label">Producto</label>
          <select id="sale-product" class="input select" onchange="onSaleProductChange()">
            <option value="">Seleccionar producto...</option>
            ${activeProducts.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="label">Color</label>
          <select id="sale-color" class="input select" onchange="onSaleColorChange()">
            <option value="">Primero selecciona un producto</option>
          </select>
        </div>
        <div class="form-group">
          <label class="label">Talla</label>
          <select id="sale-size" class="input select" onchange="onSaleSizeChange()">
            <option value="">Primero selecciona un color</option>
          </select>
        </div>
        <div class="form-group">
          <label class="label">Stock Disponible</label>
          <input type="text" id="sale-stock-display" class="input" readonly
            style="background:var(--surface);color:var(--text-muted)" value="—">
        </div>
        <div class="form-group">
          <label class="label">Cliente (opcional)</label>
          <input type="text" id="sale-client" class="input" placeholder="Nombre del cliente">
        </div>
        <div class="form-group">
          <label class="label">Cantidad</label>
          <input type="number" id="sale-qty" class="input" min="1" value="1" 
            oninput="updateSaleTotals()">
        </div>
        <div class="form-group">
          <label class="label">Precio de Venta (USD)</label>
          <input type="number" id="sale-price" class="input" min="0" step="0.01" placeholder="0.00"
            oninput="updateSaleTotals()">
        </div>
        <div class="form-group">
          <label class="label">Tasa de Cambio (Bs/USD)</label>
          <input type="number" id="sale-rate" class="input" min="1" step="0.1" value="${exchangeRate}"
            oninput="updateSaleTotals()">
        </div>
        <div class="form-group">
          <label class="label">Precio en Bs (calculado)</label>
          <input type="text" id="sale-price-bs" class="input" readonly
            style="background:var(--surface);color:var(--text-muted)" value="Bs 0.00">
        </div>
        <div class="form-group">
          <label class="label">Total USD (calculado)</label>
          <input type="text" id="sale-total-usd" class="input" readonly
            style="background:var(--surface);color:var(--text-muted)" value="$0.00">
        </div>
        <div class="form-group">
          <label class="label">Total Bs (calculado)</label>
          <input type="text" id="sale-total-bs" class="input" readonly
            style="background:var(--surface);color:var(--text-muted)" value="Bs 0.00">
        </div>
      </div>
      <button class="btn-primary" onclick="saveSale()">Registrar Venta</button>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:500">Historial de Ventas (${sales.length})</h3>
      <button class="btn-outline" onclick="exportSalesCSV()" style="font-size:12px;padding:8px 16px">⬇ Exportar CSV</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="border-bottom:2px solid var(--border)">
            ${['Fecha', 'Producto', 'Color', 'Talla', 'Cliente', 'Cant.', 'Precio USD', 'Total USD', 'Tasa Bs', 'Total Bs'].map(h =>
              `<th style="text-align:left;padding:10px 12px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted)">${h}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${sales.length === 0
            ? `<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-muted)">Sin ventas registradas aún</td></tr>`
            : [...sales].reverse().map(r => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:10px 12px">${r.date}</td>
                <td style="padding:10px 12px;font-weight:500">${r.productName}</td>
                <td style="padding:10px 12px">${r.color}</td>
                <td style="padding:10px 12px">${r.size}</td>
                <td style="padding:10px 12px;color:var(--text-muted)">${r.client || '—'}</td>
                <td style="padding:10px 12px;text-align:center">${r.qty}</td>
                <td style="padding:10px 12px">$${r.priceUSD}</td>
                <td style="padding:10px 12px;font-weight:500;color:var(--champagne)">$${r.totalUSD.toFixed(2)}</td>
                <td style="padding:10px 12px;color:var(--text-muted)">${r.priceBS.toFixed(2)}</td>
                <td style="padding:10px 12px;color:var(--champagne)">Bs ${r.totalBS.toFixed(2)}</td>
              </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function onSaleProductChange() {
  const productId = document.getElementById('sale-product').value;
  const p = products.find(x => x.id === productId);
  const colorSelect = document.getElementById('sale-color');
  const sizeSelect = document.getElementById('sale-size');
  const stockDisplay = document.getElementById('sale-stock-display');
  if (stockDisplay) stockDisplay.value = '—';

  if (!p) {
    colorSelect.innerHTML = '<option value="">Primero selecciona un producto</option>';
    sizeSelect.innerHTML = '<option value="">Primero selecciona un color</option>';
    return;
  }
  document.getElementById('sale-price').value = p.price;
  colorSelect.innerHTML = '<option value="">Seleccionar color...</option>' +
    p.colors.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  sizeSelect.innerHTML = '<option value="">Primero selecciona un color</option>';
  updateSaleTotals();
}

function onSaleColorChange() {
  const productId = document.getElementById('sale-product').value;
  const color = document.getElementById('sale-color').value;
  const p = products.find(x => x.id === productId);
  const sizeSelect = document.getElementById('sale-size');
  const stockDisplay = document.getElementById('sale-stock-display');
  if (stockDisplay) stockDisplay.value = '—';

  if (!p || !color) {
    sizeSelect.innerHTML = '<option value="">Primero selecciona un color</option>';
    return;
  }
  sizeSelect.innerHTML = '<option value="">Seleccionar talla...</option>' +
    p.sizes.map(s => {
      const stock = getStock(p, color, s);
      return `<option value="${s}" ${stock === 0 ? 'disabled' : ''}>${s} — ${stock} disponibles</option>`;
    }).join('');
}

function onSaleSizeChange() {
  const productId = document.getElementById('sale-product').value;
  const color = document.getElementById('sale-color').value;
  const size = document.getElementById('sale-size').value;
  const p = products.find(x => x.id === productId);
  if (!p || !color || !size) return;
  const stock = getStock(p, color, size);
  const stockDisplay = document.getElementById('sale-stock-display');
  const qtyInput = document.getElementById('sale-qty');
  if (stockDisplay) stockDisplay.value = `${stock} unidades disponibles`;
  if (qtyInput) qtyInput.max = stock;
  updateSaleTotals();
}

function updateSaleTotals() {
  const price = parseFloat(document.getElementById('sale-price')?.value) || 0;
  const qty = parseInt(document.getElementById('sale-qty')?.value) || 1;
  const rate = parseFloat(document.getElementById('sale-rate')?.value) || exchangeRate;
  const priceBS = price * rate;
  const totalUSD = price * qty;
  const totalBS = priceBS * qty;

  const priceBsInput = document.getElementById('sale-price-bs');
  const totalUsdInput = document.getElementById('sale-total-usd');
  const totalBsInput = document.getElementById('sale-total-bs');

  if (priceBsInput) priceBsInput.value = `Bs ${priceBS.toFixed(2)}`;
  if (totalUsdInput) totalUsdInput.value = `$${totalUSD.toFixed(2)}`;
  if (totalBsInput) totalBsInput.value = `Bs ${totalBS.toFixed(2)}`;
}

function saveSale() {
  const date = document.getElementById('sale-date').value;
  const productId = document.getElementById('sale-product').value;
  const color = document.getElementById('sale-color').value;
  const size = document.getElementById('sale-size').value;
  const client = document.getElementById('sale-client').value.trim();
  const qty = parseInt(document.getElementById('sale-qty').value);
  const priceUSD = parseFloat(document.getElementById('sale-price').value);
  const rate = parseFloat(document.getElementById('sale-rate').value) || exchangeRate;

  if (!date || !productId || !color || !size || isNaN(qty) || qty <= 0 || isNaN(priceUSD)) {
    showToast('Completa todos los campos requeridos', 'warning');
    return;
  }

  const p = products.find(x => x.id === productId);
  if (!p) return;

  const availableStock = getStock(p, color, size);
  if (qty > availableStock) {
    showToast(`Stock insuficiente — solo hay ${availableStock} unidades`, 'warning');
    return;
  }

  const priceBS = priceUSD * rate;
  const sale = {
    id: 'sale' + Date.now(),
    date,
    productId,
    productName: p.name,
    color,
    size,
    client,
    qty,
    priceUSD,
    priceBS,
    totalUSD: priceUSD * qty,
    totalBS: priceBS * qty,
    createdAt: new Date().toISOString()
  };

  sales.push(sale);
  saveSales();

  // Decrement stock
  if (!p.stock[color]) p.stock[color] = {};
  p.stock[color][size] -= qty;
  saveProducts();
  if (typeof renderProducts === 'function') renderProducts();

  // Save exchange rate
  exchangeRate = rate;
  localStorage.setItem('aurafit_rate', rate);

  if (p.stock[color][size] === 0) {
    showToast(`⚠️ ${p.name} (${color} / ${size}) quedó sin stock`, 'warning');
    setTimeout(() => {
      renderSales();
    }, 1800);
  } else {
    renderSales();
  }

  showToast(`✅ Venta registrada — $${(priceUSD * qty).toFixed(2)} USD`);
}

function exportSalesCSV() {
  if (sales.length === 0) {
    showToast('No hay ventas para exportar', 'warning');
    return;
  }
  const headers = ['Fecha', 'Producto', 'Color', 'Talla', 'Cliente', 'Cantidad', 'Precio USD', 'Total USD', 'Tasa Bs', 'Total Bs'];
  const rows = sales.map(r => [
    r.date,
    r.productName,
    r.color,
    r.size,
    r.client || '',
    r.qty,
    r.priceUSD,
    r.totalUSD.toFixed(2),
    r.priceBS.toFixed(2),
    r.totalBS.toFixed(2)
  ]);
  downloadCSV(rows, headers, 'ventas_aurafit.csv');
}

/* ==========================================================================
   OUT OF STOCK MANAGEMENT (ADMIN)
   ========================================================================== */

function renderOutOfStock() {
  const content = document.getElementById('admin-content');
  if (!content) return;
  const outOfStock = getOutOfStock();

  // Also find products with low stock (any SKU with 1-2 units)
  const lowStock = [];
  products.filter(p => p.active).forEach(p => {
    p.colors.forEach(c => {
      p.sizes.forEach(s => {
        const qty = getStock(p, c.name, s);
        if (qty > 0 && qty <= 2) {
          lowStock.push({ product: p, color: c.name, colorHex: c.hex, size: s, qty });
        }
      });
    });
  });

  content.innerHTML = `
    <h2 style="font-family:var(--font-serif);font-size:28px;font-weight:400;margin-bottom:24px">Sin Stock</h2>

    ${outOfStock.length === 0 && lowStock.length === 0 ? `
      <div style="text-align:center;padding:80px 20px;background:var(--bg-card);border:1px solid var(--border)">
        <div style="font-size:64px;margin-bottom:16px">✅</div>
        <h3 style="font-family:var(--font-serif);font-size:24px;font-weight:400;margin-bottom:8px">¡Todo en orden!</h3>
        <p style="color:var(--text-muted)">Todo tu inventario tiene stock disponible.</p>
      </div>
    ` : ''}

    ${outOfStock.length > 0 ? `
      <div style="margin-bottom:32px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
          <span style="font-size:20px">🚨</span>
          <h3 style="font-size:16px;font-weight:600;color:var(--danger)">Sin Stock Total (${outOfStock.length})</h3>
        </div>
        <div style="display:grid;gap:12px">
          ${outOfStock.map(p => `
            <div style="background:var(--bg-card);border:1px solid rgba(122,30,46,0.3);padding:20px;display:flex;align-items:center;justify-content:space-between;gap:16px">
              <div>
                <p style="font-weight:600;margin-bottom:4px">${p.name}</p>
                <p style="font-size:13px;color:var(--text-muted)">${p.category} • ${p.colors.map(c => c.name).join(', ')}</p>
                <div style="display:flex;gap:6px;margin-top:8px">
                  ${p.colors.map(c => `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${c.hex};border:1px solid var(--border)"></span>`).join('')}
                </div>
              </div>
              <div style="display:flex;gap:10px;flex-shrink:0">
                <button class="btn-primary" style="font-size:12px;padding:10px 16px" 
                  onclick="loadPanel('incomes')">📥 Registrar Ingreso</button>
                <button class="btn-outline" style="font-size:12px;padding:10px 16px"
                  onclick="openProductForm('${p.id}')">✏️ Editar</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${lowStock.length > 0 ? `
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
          <span style="font-size:20px">⚠️</span>
          <h3 style="font-size:16px;font-weight:600;color:#E65100">Stock Bajo — 1 a 2 unidades (${lowStock.length} SKUs)</h3>
        </div>
        <div style="overflow-x:auto;background:var(--bg-card);border:1px solid var(--border)">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="border-bottom:2px solid var(--border)">
                ${['Producto', 'Color', 'Talla', 'Stock', 'Acción'].map(h =>
                  `<th style="text-align:left;padding:12px 16px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted)">${h}</th>`
                ).join('')}
              </tr>
            </thead>
            <tbody>
              ${lowStock.map(item => `
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:12px 16px;font-weight:500">${item.product.name}</td>
                  <td style="padding:12px 16px">
                    <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${item.colorHex};margin-right:6px;vertical-align:middle"></span>
                    ${item.color}
                  </td>
                  <td style="padding:12px 16px">${item.size}</td>
                  <td style="padding:12px 16px">
                    <span style="background:#FFF3E0;color:#E65100;padding:4px 10px;border-radius:99px;font-size:12px;font-weight:600">${item.qty} ud${item.qty > 1 ? 's' : ''}.</span>
                  </td>
                  <td style="padding:12px 16px">
                    <button class="btn-ghost" style="font-size:12px;color:var(--champagne)" 
                      onclick="loadPanel('incomes')">📥 Reponer</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}`;
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

  // Mobile sidebar toggle
  document.getElementById('admin-menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.admin-sidebar')?.classList.toggle('open');
  });

  // Close sidebar when nav item clicked on mobile
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        document.querySelector('.admin-sidebar')?.classList.remove('open');
      }
    });
  });
});

