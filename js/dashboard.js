/* ─── dashboard.js — KPIs y gráfico desde datos reales ─── */

/* ── Helpers ── */
function _getTotalStock() {
  let t = 0;
  (products || []).forEach(p => {
    if (!p.active) return;
    (p.colors || []).forEach(c => {
      (p.sizes || []).forEach(s => {
        t += (getStock ? getStock(p, c.name, s) : 0);
      });
    });
  });
  return t;
}

function _getZeroVariants() {
  let count = 0;
  (products || []).forEach(p => {
    if (!p.active) return;
    (p.colors || []).forEach(c => {
      (p.sizes || []).forEach(s => {
        if ((getStock ? getStock(p, c.name, s) : 0) === 0) count++;
      });
    });
  });
  return count;
}

function _getLowStockCount() {
  let count = 0;
  (products || []).forEach(p => {
    if (!p.active) return;
    (p.colors || []).forEach(c => {
      (p.sizes || []).forEach(s => {
        const st = getStock ? getStock(p, c.name, s) : 0;
        if (st > 0 && st <= 2) count++;
      });
    });
  });
  return count;
}

function _getOptimalCount() {
  let count = 0;
  (products || []).forEach(p => {
    if (!p.active) return;
    (p.colors || []).forEach(c => {
      (p.sizes || []).forEach(s => {
        if ((getStock ? getStock(p, c.name, s) : 0) > 5) count++;
      });
    });
  });
  return count;
}

function _getSales() {
  try { return JSON.parse(localStorage.getItem('aurafit_sales') || '[]'); } catch(e) { return []; }
}

function _getIncomes() {
  try { return JSON.parse(localStorage.getItem('aurafit_incomes') || '[]'); } catch(e) { return []; }
}

function _monthIncomeTotals() {
  const sales = _getSales();
  const incomes = _getIncomes();
  const map = {};
  [...sales, ...incomes].forEach(r => {
    const d = new Date(r.date || r.createdAt || r.timestamp || Date.now());
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    map[key] = (map[key] || 0) + (parseFloat(r.total || r.amount || 0));
  });
  return map;
}

function _last6Months() {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`,
      label: d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.','')
    });
  }
  return months;
}

function _currentMonthIncome() {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  return _monthIncomeTotals()[key] || 0;
}

function _currentMonthCosts() {
  const sales = _getSales();
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  let cost = 0;
  sales.forEach(r => {
    const d = new Date(r.date || r.createdAt || r.timestamp || Date.now());
    if (isNaN(d)) return;
    const rKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (rKey === key) cost += (parseFloat(r.cost || 0));
  });
  return cost;
}

function _buildChartSVG(months, totals) {
  const maxVal = Math.max(...months.map(m => totals[m.key] || 0), 1);
  const H = 150, W = 340, barW = 22, gap = 50;
  const startX = 25;
  const baseY = 150;
  const chartH = 116;

  let bars = '', labels = '', values = '', trendPts = [];

  months.forEach((m, i) => {
    const x = startX + i * gap;
    const val = totals[m.key] || 0;
    const barH = Math.max(4, Math.round((val / maxVal) * chartH));
    const y = baseY - barH;
    const opacity = 0.7 + (i / months.length) * 0.3;
    const isLast = i === months.length - 1;
    const labelColor = isLast ? '#6f5100' : '#807665';
    const labelWeight = isLast ? '700' : '400';
    const valColor = isLast ? '#9c404e' : '#27180a';
    const valWeight = isLast ? '700' : '600';
    const label = val >= 1000 ? `$${(val/1000).toFixed(1)}k` : val > 0 ? `$${val}` : '—';

    bars += `<rect fill="url(#barGoldGrad)" height="${barH}" opacity="${opacity}" rx="4" width="${barW}" x="${x}" y="${y}"/>`;
    labels += `<text fill="${labelColor}" font-family="DM Sans" font-size="9" font-weight="${labelWeight}" text-anchor="middle" x="${x+barW/2}" y="166">${m.label}</text>`;
    values += `<text fill="${valColor}" font-family="DM Sans" font-size="8" font-weight="${valWeight}" text-anchor="middle" x="${x+barW/2}" y="${y-4}">${label}</text>`;
    trendPts.push({ x: x + barW/2, y: y });
  });

  const path = trendPts.length < 2 ? '' : (() => {
    let d = `M ${trendPts[0].x} ${trendPts[0].y}`;
    for (let i = 1; i < trendPts.length; i++) {
      const cp1x = (trendPts[i-1].x + trendPts[i].x) / 2;
      d += ` C ${cp1x} ${trendPts[i-1].y}, ${cp1x} ${trendPts[i].y}, ${trendPts[i].x} ${trendPts[i].y}`;
    }
    return `<path d="${d}" fill="none" stroke="url(#trendGlow)" stroke-linecap="round" stroke-width="2.5"/>`;
  })();

  const lastPt = trendPts[trendPts.length - 1];
  const dot = lastPt ? `<circle cx="${lastPt.x}" cy="${lastPt.y}" fill="#9c404e" r="4" stroke="#fff8f5" stroke-width="1.5"/>` : '';

  return `
    <svg viewBox="0 0 340 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;overflow:visible">
      <defs>
        <linearGradient id="barGoldGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#ecc165"/>
          <stop offset="100%" stop-color="#8b6914"/>
        </linearGradient>
        <linearGradient id="trendGlow" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="#9c404e" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#9c404e" stop-opacity="0.9"/>
        </linearGradient>
      </defs>
      <line stroke="#d1c5b2" stroke-dasharray="3 3" stroke-opacity="0.35" x1="10" x2="330" y1="30" y2="30"/>
      <line stroke="#d1c5b2" stroke-dasharray="3 3" stroke-opacity="0.35" x1="10" x2="330" y1="75" y2="75"/>
      <line stroke="#d1c5b2" stroke-dasharray="3 3" stroke-opacity="0.35" x1="10" x2="330" y1="120" y2="120"/>
      <line stroke="#807665" stroke-opacity="0.25" x1="10" x2="330" y1="150" y2="150"/>
      ${bars}${labels}${values}${path}${dot}
    </svg>`;
}

function _buildMatrixRows() {
  const active = (products || []).filter(p => p.active);
  if (!active.length) return `<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--text-muted)">Sin productos activos</td></tr>`;

  let rows = '';
  let count = 0;
  for (let i = 0; i < active.length && count < 6; i++) {
    const p = active[i];
    for (let j = 0; j < (p.colors || []).length && count < 6; j++) {
      const c = p.colors[j];
      const sizes = ['XS','S','M','L','XL'];
      let total = 0;
      let cells = sizes.map(sz => {
        const st = getStock ? getStock(p, c.name, sz) : 0;
        total += st;
        return st === 0 ? `<td class="inv-zero-cell">0</td>` : `<td>${st}</td>`;
      }).join('');

      const status = total === 0 ? 'out' : total <= 2 ? 'low' : 'optimal';
      const badgeClass = status === 'out' ? 'inv-badge-out' : status === 'low' ? 'inv-badge-low' : 'inv-badge-optimal';
      const badgeText = status === 'out' ? 'AGOTADO' : status === 'low' ? 'BAJO STOCK' : 'Óptimo';
      const rowClass = status === 'low' ? 'inv-stock-row inv-row-low' : status === 'out' ? 'inv-stock-row' : 'inv-stock-row';
      const hex = c.hex || '#888';

      rows += `
        <tr class="${rowClass}" data-status="${status}" data-name="${p.name}" data-color="${c.name}" data-total="${total}">
          <td>${p.name}</td>
          <td>
            <div class="inv-color-cell">
              <span class="inv-color-dot" style="background:${hex};${hex === '#ffffff' || hex === '#fff' || hex === '#FFFFFF' ? 'border:1px solid #d1c5b2;' : ''}"></span>
              <span>${c.name}</span>
            </div>
          </td>
          ${cells}
          <td class="inv-total-cell">${total}</td>
          <td><span class="inv-badge ${badgeClass}">${badgeText}</span></td>
        </tr>`;
      count++;
    }
  }
  return rows;
}

function _buildOrdersFeed() {
  const sales = _getSales().slice(-3).reverse();
  if (!sales.length) return `
    <div class="order-feed-item">
      <div class="order-feed-thumb"><span class="material-symbols-outlined">inbox</span></div>
      <div class="order-feed-info">
        <div class="order-feed-header-line"><span class="order-feed-id">Sin ventas registradas</span></div>
        <p class="order-feed-desc">Registra tu primera venta desde "+ Registrar Venta Manual"</p>
      </div>
    </div>`;

  return sales.map((s, i) => {
    const icons = ['checkroom','shopping_bag','local_mall'];
    const badges = ['order-badge-pending','order-badge-confirmed','order-badge-pending'];
    const statuses = ['Pendiente de Envío','Confirmado','En proceso'];
    const d = new Date(s.date || s.createdAt || s.timestamp || Date.now());
    const timeStr = isNaN(d) ? '' : d.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
    const desc = s.productName ? `${s.productName}${s.color ? ' • ' + s.color : ''}${s.size ? ' • Talla ' + s.size : ''}${s.total ? ' • $' + s.total : ''}` : `Venta #${s.id || i+1}`;
    return `
      <div class="order-feed-item">
        <div class="order-feed-thumb"><span class="material-symbols-outlined">${icons[i % 3]}</span></div>
        <div class="order-feed-info">
          <div class="order-feed-header-line">
            <span class="order-feed-id">${s.id ? 'VTA-' + s.id : 'VTA-' + String(Date.now()).slice(-4)}</span>
            <span class="order-feed-dot">•</span>
            <span class="order-feed-badge ${badges[i % 3]}">${statuses[i % 3]}</span>
          </div>
          <p class="order-feed-desc">${desc}</p>
        </div>
        <div class="order-feed-right">
          <span class="order-feed-time">${timeStr}</span>
          <button class="order-feed-action-btn" onclick="if(typeof showToast==='function')showToast('Abriendo conversación de WhatsApp...')">
            <span class="material-symbols-outlined" style="font-size:16px;">send</span>
          </button>
        </div>
      </div>`;
  }).join('');
}

/* ── renderDashboard: función principal ── */
function renderDashboard() {
  const content = document.getElementById('admin-content');
  if (!content) return;

  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let formattedDate = today.toLocaleDateString('es-ES', dateOptions);
  formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // KPIs
  const totalStock     = _getTotalStock();
  const zeroVariants   = _getZeroVariants();
  const lowStock       = _getLowStockCount();
  const optimalCount   = _getOptimalCount();
  const monthIncome    = _currentMonthIncome();
  const monthCosts     = _currentMonthCosts();
  const grossMargin    = monthIncome > 0 && monthCosts > 0
    ? ((monthIncome - monthCosts) / monthIncome * 100).toFixed(1) + '%'
    : monthIncome > 0 ? '—' : '$0';

  const incomeDisplay  = monthIncome > 0
    ? (monthIncome >= 1000 ? `$${(monthIncome/1000).toFixed(1)}k` : `$${monthIncome.toFixed(0)}`)
    : '$0';

  // Gráfico
  const months6   = _last6Months();
  const totalsMap  = _monthIncomeTotals();
  const chartSVG   = _buildChartSVG(months6, totalsMap);
  const monthRange = `${months6[0].label} — ${months6[5].label}`;

  // Matriz
  const matrixRows   = _buildMatrixRows();
  const activeCount  = (products || []).filter(p => p.active).length;

  // Feed
  const ordersFeed = _buildOrdersFeed();

  content.innerHTML = `
    <!-- 1. STRIP DE ESTADO -->
    <div class="admin-status-strip">
      <div class="admin-status-top">
        <div class="admin-status-online">
          <span class="admin-pulse-dot"></span>
          <span>En Línea</span>
        </div>
        <div class="admin-status-pill">
          <span class="material-symbols-outlined" style="font-size:14px;">verified_user</span>
          <span>Autenticado</span>
        </div>
      </div>
      <div class="admin-status-bottom">
        <h2 class="admin-status-title">AURA FIT — Panel Administrativo</h2>
        <p class="admin-status-date">
          <span class="material-symbols-outlined" style="font-size:16px;">calendar_today</span>
          <span id="admin-current-date">${formattedDate}</span>
        </p>
      </div>
    </div>

    <!-- 2. ACCIONES RÁPIDAS -->
    <div class="admin-quick-actions">
      <button class="quick-action-btn primary" onclick="loadPanel('sales')">
        <span class="material-symbols-outlined" style="font-size:18px;">add_circle</span>
        <span>+ Registrar Venta Manual</span>
      </button>
      <button class="quick-action-btn secondary" onclick="loadPanel('incomes')">
        <span class="material-symbols-outlined" style="font-size:18px;">add_box</span>
        <span>+ Registrar Ingreso</span>
      </button>
      <button class="quick-action-btn secondary" onclick="if(typeof exportSalesCSV==='function')exportSalesCSV()">
        <span class="material-symbols-outlined" style="font-size:18px;">download</span>
        <span>Exportar CSV</span>
      </button>
      <button class="quick-action-btn secondary" onclick="if(typeof showToast==='function')showToast('Configuración del Atelier ✨')">
        <span class="material-symbols-outlined" style="font-size:18px;">settings</span>
        <span>Configuración</span>
      </button>
    </div>

    <!-- 3. GRID 2×2 DE KPI CARDS -->
    <div class="admin-kpi-grid">
      <div class="kpi-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">INGRESOS DEL MES</span>
          <span class="material-symbols-outlined kpi-card-icon">payments</span>
        </div>
        <div class="kpi-card-value">${incomeDisplay}</div>
        <div class="kpi-card-sub">USD • Mes en curso</div>
        <div class="kpi-card-pill kpi-pill-champagne">
          <span class="material-symbols-outlined" style="font-size:14px;">trending_up</span>
          <span>Acumulado</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">MARGEN BRUTO</span>
          <span class="material-symbols-outlined kpi-card-icon">pie_chart</span>
        </div>
        <div class="kpi-card-value">${grossMargin}</div>
        <div class="kpi-card-sub">Rentabilidad Neta</div>
        <div class="kpi-card-pill kpi-pill-gold">
          <span class="material-symbols-outlined" style="font-size:14px;">check_circle</span>
          <span>${monthCosts > 0 ? 'Calculado' : 'Sin costos aún'}</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">PRENDAS EN STOCK</span>
          <span class="material-symbols-outlined kpi-card-icon">styler</span>
        </div>
        <div class="kpi-card-value">${totalStock}</div>
        <div class="kpi-card-sub">${activeCount} productos activos</div>
        <div class="kpi-card-pill kpi-pill-brown">
          <span class="material-symbols-outlined" style="font-size:14px;">north_east</span>
          <span>Inventario real</span>
        </div>
      </div>

      <div class="kpi-card kpi-card-alert">
        <div class="kpi-card-header">
          <span class="kpi-card-label">SIN STOCK / ALERTA</span>
          <span class="material-symbols-outlined kpi-card-icon">warning</span>
        </div>
        <div class="kpi-card-value">${zeroVariants}</div>
        <div class="kpi-card-sub">Variantes agotadas</div>
        <button class="kpi-card-pill" onclick="loadPanel('outofstock')">
          <span>Ver listado</span>
        </button>
      </div>
    </div>

    <!-- 4. GRÁFICO VENTAS/INGRESOS -->
    <div class="admin-chart-card">
      <div class="admin-chart-header">
        <div class="admin-chart-titles">
          <span class="admin-chart-label">RENDIMIENTO SEMESTRAL</span>
          <h3 class="admin-chart-title">Ingresos Mensuales</h3>
        </div>
        <div class="admin-chart-chip">${monthRange}</div>
      </div>
      <div class="admin-chart-svg-wrap">${chartSVG}</div>
      <div class="admin-trend-note">
        <div class="admin-trend-left">
          <span class="material-symbols-outlined admin-trend-icon">auto_graph</span>
          <span>Datos reales desde ventas e ingresos registrados</span>
        </div>
        <span class="admin-trend-badge">EN VIVO</span>
      </div>
    </div>

    <!-- 5. FEED DE PEDIDOS RECIENTES -->
    <div class="admin-orders-feed-section">
      <div class="admin-orders-feed-header">
        <div>
          <span class="admin-feed-label">CANAL EXCLUSIVO</span>
          <h3 class="admin-feed-title">Pedidos Recientes por WhatsApp</h3>
        </div>
        <button class="admin-feed-view-all" onclick="loadPanel('sales')">Ver Todos ›</button>
      </div>
      ${ordersFeed}
    </div>

    <!-- SECCIÓN INVENTARIO & MATRIZ DE STOCK -->
    <section class="inv-section" id="inv-section">
      <div class="inv-access-strip">
        <div class="inv-access-left">
          <span class="material-symbols-outlined inv-access-icon">verified_user</span>
          <span>Acceso seguro verificado ✓</span>
        </div>
        <span class="inv-live-pill">EN VIVO</span>
      </div>

      <div class="inv-section-header">
        <h2 class="inv-title">Inventario & Matriz</h2>
        <p class="inv-subtitle">Control de Existencias por Color y Talla & Gestión de Catálogo</p>
      </div>

      <div class="inv-kpi-bento">
        <div class="inv-kpi-mini">
          <span class="inv-kpi-label" style="color:#6a5220;">UNIDADES</span>
          <div class="inv-kpi-value">${totalStock}</div>
          <div class="inv-kpi-sub" style="color:var(--brown);">
            <span class="material-symbols-outlined">check_circle</span>
            <span>${activeCount} productos</span>
          </div>
        </div>
        <div class="inv-kpi-mini">
          <span class="inv-kpi-label" style="color:var(--wine);">BAJO STOCK</span>
          <div class="inv-kpi-value" style="color:var(--wine);">${lowStock}</div>
          <div class="inv-kpi-sub" style="color:var(--wine);">
            <span class="material-symbols-outlined">warning</span>
            <span>${lowStock > 0 ? 'Crítico' : 'OK'}</span>
          </div>
        </div>
        <div class="inv-kpi-mini">
          <span class="inv-kpi-label" style="color:var(--brown);">ÓPTIMOS</span>
          <div class="inv-kpi-value">${optimalCount}</div>
          <div class="inv-kpi-sub" style="color:#6a5220;">
            <span class="material-symbols-outlined">spa</span>
            <span>Estable</span>
          </div>
        </div>
      </div>

      <div class="inv-controls-wrap">
        <div class="inv-filter-track">
          <button type="button" class="inv-filter-tab inv-filter-tab-active" data-filter="all">Todos los productos</button>
          <button type="button" class="inv-filter-tab" data-filter="low">Bajo stock (&lt; 3)</button>
          <button type="button" class="inv-filter-tab" data-filter="out">Agotados</button>
        </div>
        <div class="inv-actions-row">
          <button type="button" class="inv-btn-primary" id="inv-add-btn">
            <span class="material-symbols-outlined">add_circle</span>
            <span>+ Agregar Nuevo</span>
          </button>
          <button type="button" class="inv-btn-secondary" id="inv-export-btn">
            <span class="material-symbols-outlined" style="color:var(--brown)">file_download</span>
            <span>Exportar Reporte CSV</span>
          </button>
        </div>
      </div>

      <div class="inv-matrix-card">
        <div class="inv-matrix-header-strip">
          <div class="inv-matrix-header-left">
            <span class="material-symbols-outlined">grid_view</span>
            <span>MATRIZ DE EXISTENCIAS</span>
          </div>
          <span class="inv-matrix-header-right">Desliza para ver tallas →</span>
        </div>
        <div class="inv-table-wrap">
          <table class="inv-table">
            <thead>
              <tr>
                <th>Producto</th><th>Color</th>
                <th>XS</th><th>S</th><th>M</th><th>L</th><th>XL</th>
                <th>Total</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>${matrixRows}</tbody>
          </table>
        </div>
        <div class="inv-table-footer">
          <span>Mostrando primeras variantes activas (${activeCount} productos)</span>
          <button class="inv-footer-action-btn" type="button" onclick="loadPanel('products')">
            <span>Ver todos los productos</span>
            <span class="material-symbols-outlined" style="font-size:14px;">open_in_new</span>
          </button>
        </div>
      </div>

      <div class="inv-editorial-banner">
        <div class="inv-editorial-thumb">
          <span class="material-symbols-outlined" style="font-size:32px;">styler</span>
        </div>
        <div class="inv-editorial-content">
          <p class="inv-editorial-label">AURA ATELIER STUDIO</p>
          <h4 class="inv-editorial-title">Colección Silueta '26</h4>
          <p class="inv-editorial-body">Verifica y completa el inventario producto por producto.</p>
        </div>
        <span class="material-symbols-outlined inv-editorial-arrow">arrow_forward</span>
      </div>
    </section>

    <!-- DRAWER -->
    <div id="inventory-drawer" class="inv-drawer-overlay">
      <div class="inv-drawer-panel" id="inv-drawer-panel">
        <div class="inv-drawer-header">
          <div class="inv-drawer-header-icon">
            <span class="material-symbols-outlined" style="font-size:20px;">edit</span>
          </div>
          <div class="inv-drawer-header-text">
            <h3 class="inv-drawer-title" id="inv-drawer-title">Edición Rápida de Producto</h3>
            <p class="inv-drawer-subtitle" id="inv-drawer-subtitle">Ajuste de inventario</p>
          </div>
          <button type="button" class="inv-drawer-close-btn" id="inv-close-btn" aria-label="Cerrar">&times;</button>
        </div>
        <div class="inv-drawer-toggle-card">
          <div>
            <p class="inv-drawer-toggle-label">Estado del Producto</p>
            <p class="inv-drawer-toggle-sub">Visible en la tienda digital</p>
          </div>
          <label class="inv-switch" aria-label="Estado activo del producto">
            <input type="checkbox" id="inv-product-active-toggle" checked>
            <span class="inv-slider"></span>
          </label>
        </div>
        <div class="inv-stock-control-group">
          <label for="inv-stock-input" class="inv-stock-control-label">Actualizar Stock / Inyección de Lote</label>
          <div class="inv-stock-stepper-row">
            <button type="button" class="inv-step-btn" id="inv-dec-btn" aria-label="Disminuir stock">−</button>
            <input type="number" id="inv-stock-input" class="inv-stock-input" value="0" min="0" step="1">
            <button type="button" class="inv-step-btn" id="inv-inc-btn" aria-label="Aumentar stock">＋</button>
          </div>
        </div>
        <p class="inv-drawer-hint">El ajuste recalculará automáticamente la alerta de stock.</p>
        <div class="inv-drawer-actions">
          <button type="button" class="inv-drawer-save-btn" id="inv-save-btn">Guardar Cambios</button>
          <button type="button" class="inv-drawer-cancel-btn" id="inv-cancel-btn">Descartar</button>
        </div>
      </div>
    </div>

    <!-- TOAST -->
    <div id="inv-toast" role="alert" aria-live="polite">
      <span class="material-symbols-outlined" id="inv-toast-icon" style="font-size:18px;">check_circle</span>
      <span id="inv-toast-msg">Stock actualizado correctamente</span>
    </div>
  `;

  if (typeof initInventory === 'function') initInventory();
}

function exportStockCSV() {
  const activeProducts = (products || []).filter(p => p.active);
  const headers = ['Producto', 'Categoría', 'Color', 'Talla', 'Stock'];
  const rows = [];
  activeProducts.forEach(p => {
    (p.colors || []).forEach(c => {
      (p.sizes || []).forEach(s => {
        rows.push([p.name, p.category, c.name, s, getStock ? getStock(p, c.name, s) : 0]);
      });
    });
  });
  if (rows.length === 0) { if(typeof showToast==='function') showToast('No hay datos de stock', 'warning'); return; }
  if(typeof downloadCSV==='function') downloadCSV(rows, headers, 'stock_aurafit.csv');
}

function renderOutOfStock() {
  const content = document.getElementById('admin-content');
  if (!content) return;
  const outOfStockProducts = typeof getOutOfStock === 'function' ? getOutOfStock() : [];
  const zeroStockVariants = [];
  (products || []).filter(p => p.active).forEach(p => {
    (p.colors || []).forEach(c => {
      (p.sizes || []).forEach(s => {
        const stock = getStock ? getStock(p, c.name, s) : 0;
        if (stock === 0) zeroStockVariants.push({ product: p, color: c, size: s });
      });
    });
  });

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <div>
        <h2 style="font-family:var(--font-serif);font-size:28px;font-weight:400">Productos Sin Stock</h2>
        <p style="color:var(--text-muted);font-size:13px;margin-top:4px">Artículos y variantes que requieren reposición inmediata</p>
      </div>
      <button class="btn-primary" onclick="loadPanel('incomes')">📥 Registrar Ingreso</button>
    </div>
    ${zeroStockVariants.length > 0 ? `
      <div style="background:rgba(122,30,46,0.08);border:1px solid var(--danger);padding:16px 20px;border-radius:var(--radius);margin-bottom:24px;display:flex;align-items:center;gap:12px">
        <span style="font-size:20px">⚠️</span>
        <div style="font-size:13px;color:var(--text)">
          Hay <strong>${zeroStockVariants.length} variante(s)</strong> y <strong>${outOfStockProducts.length} producto(s) totalmente agotados</strong>.
        </div>
      </div>` : `
      <div style="background:rgba(46,125,50,0.08);border:1px solid #2E7D32;padding:16px 20px;border-radius:var(--radius);margin-bottom:24px;display:flex;align-items:center;gap:12px">
        <span style="font-size:20px">✅</span>
        <div style="font-size:13px;color:var(--text)">¡Todas las variantes tienen inventario disponible!</div>
      </div>`}
    <div style="background:var(--cream,#fff8f5);border:1px solid var(--border);padding:24px;border-radius:var(--radius-lg);margin-bottom:24px">
      <h3 style="font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:16px">Variantes Agotadas (${zeroStockVariants.length})</h3>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="border-bottom:2px solid var(--border)">
              ${['Producto','Categoría','Color','Talla','Precio','Acción'].map(h=>`<th style="text-align:left;padding:10px 12px;color:var(--text-muted);font-size:11px;text-transform:uppercase">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${zeroStockVariants.length === 0
              ? `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-muted)">No hay variantes agotadas</td></tr>`
              : zeroStockVariants.map(v => `
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:10px 12px;font-weight:500">${v.product.name}</td>
                  <td style="padding:10px 12px;color:var(--text-muted)">${v.product.category}</td>
                  <td style="padding:10px 12px">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${v.color.hex};margin-right:6px"></span>
                    ${v.color.name}
                  </td>
                  <td style="padding:10px 12px;font-weight:600;color:var(--danger)">${v.size}</td>
                  <td style="padding:10px 12px">$${v.product.price} USD</td>
                  <td style="padding:10px 12px">
                    <button class="btn-ghost btn-reponer" style="font-size:12px;" onclick="loadPanel('incomes')">Reponer</button>
                    <button class="btn-ghost" style="font-size:12px;margin-left:8px" onclick="openProductForm('${v.product.id}')">Editar</button>
                  </td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}
