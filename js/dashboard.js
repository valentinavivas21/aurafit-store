function renderDashboard() {
  const content = document.getElementById('admin-content');
  if (!content) return;

  // Format current date
  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let formattedDate = today.toLocaleDateString('es-ES', dateOptions);
  formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

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
      <button class="quick-action-btn secondary" onclick="exportSalesCSV()">
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
      <!-- Card 1 — Ingresos Totales -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">INGRESOS TOTALES</span>
          <span class="material-symbols-outlined kpi-card-icon">payments</span>
        </div>
        <div class="kpi-card-value">$24,850</div>
        <div class="kpi-card-sub">USD • Mes en curso</div>
        <div class="kpi-card-pill kpi-pill-champagne">
          <span class="material-symbols-outlined" style="font-size:14px;">trending_up</span>
          <span>+18.4%</span>
        </div>
      </div>

      <!-- Card 2 — Margen Bruto -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">MARGEN BRUTO</span>
          <span class="material-symbols-outlined kpi-card-icon">pie_chart</span>
        </div>
        <div class="kpi-card-value">68.2%</div>
        <div class="kpi-card-sub">Rentabilidad Neta</div>
        <div class="kpi-card-pill kpi-pill-gold">
          <span class="material-symbols-outlined" style="font-size:14px;">check_circle</span>
          <span>Saludable</span>
        </div>
      </div>

      <!-- Card 3 — Prendas -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">PRENDAS</span>
          <span class="material-symbols-outlined kpi-card-icon">styler</span>
        </div>
        <div class="kpi-card-value">312</div>
        <div class="kpi-card-sub">Unidades atelier</div>
        <div class="kpi-card-pill kpi-pill-brown">
          <span class="material-symbols-outlined" style="font-size:14px;">north_east</span>
          <span>+9.1%</span>
        </div>
      </div>

      <!-- Card 4 — Alerta de Stock -->
      <div class="kpi-card kpi-card-alert">
        <div class="kpi-card-header">
          <span class="kpi-card-label">SIN STOCK / ALERTA</span>
          <span class="material-symbols-outlined kpi-card-icon">warning</span>
        </div>
        <div class="kpi-card-value">2</div>
        <div class="kpi-card-sub">Variantes críticas</div>
        <button class="kpi-card-pill" onclick="loadPanel('outofstock')">
          <span>Reordenar</span>
        </button>
      </div>
    </div>

    <!-- 4. SECCIÓN GRÁFICO SVG — Rendimiento Semestral / Ventas Mensuales -->
    <div class="admin-chart-card">
      <div class="admin-chart-header">
        <div class="admin-chart-titles">
          <span class="admin-chart-label">RENDIMIENTO SEMESTRAL</span>
          <h3 class="admin-chart-title">Ventas Mensuales</h3>
        </div>
        <div class="admin-chart-chip">Mayo — Octubre</div>
      </div>
      <div class="admin-chart-svg-wrap">
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
          <rect fill="url(#barGoldGrad)" height="60" opacity="0.8" rx="4" width="22" x="25" y="90"/>
          <text fill="#807665" font-family="DM Sans" font-size="9" text-anchor="middle" x="36" y="166">MAY</text>
          <text fill="#27180a" font-family="DM Sans" font-size="8" font-weight="600" text-anchor="middle" x="36" y="82">$14k</text>
          <rect fill="url(#barGoldGrad)" height="72" opacity="0.85" rx="4" width="22" x="75" y="78"/>
          <text fill="#807665" font-family="DM Sans" font-size="9" text-anchor="middle" x="86" y="166">JUN</text>
          <text fill="#27180a" font-family="DM Sans" font-size="8" font-weight="600" text-anchor="middle" x="86" y="70">$16.2k</text>
          <rect fill="url(#barGoldGrad)" height="85" opacity="0.9" rx="4" width="22" x="125" y="65"/>
          <text fill="#807665" font-family="DM Sans" font-size="9" text-anchor="middle" x="136" y="166">JUL</text>
          <text fill="#27180a" font-family="DM Sans" font-size="8" font-weight="600" text-anchor="middle" x="136" y="57">$18.9k</text>
          <rect fill="url(#barGoldGrad)" height="95" opacity="0.9" rx="4" width="22" x="175" y="55"/>
          <text fill="#807665" font-family="DM Sans" font-size="9" text-anchor="middle" x="186" y="166">AGO</text>
          <text fill="#27180a" font-family="DM Sans" font-size="8" font-weight="600" text-anchor="middle" x="186" y="47">$20.5k</text>
          <rect fill="url(#barGoldGrad)" height="102" opacity="0.95" rx="4" width="22" x="225" y="48"/>
          <text fill="#807665" font-family="DM Sans" font-size="9" text-anchor="middle" x="236" y="166">SEP</text>
          <text fill="#27180a" font-family="DM Sans" font-size="8" font-weight="600" text-anchor="middle" x="236" y="40">$22.1k</text>
          <rect fill="url(#barGoldGrad)" height="116" rx="4" width="22" x="275" y="34"/>
          <text fill="#6f5100" font-family="DM Sans" font-size="9" font-weight="700" text-anchor="middle" x="286" y="166">OCT</text>
          <text fill="#9c404e" font-family="DM Sans" font-size="9" font-weight="700" text-anchor="middle" x="286" y="24">$24.8k</text>
          <path d="M 36 88 Q 86 76 136 62 T 236 44 T 286 28" fill="none" stroke="url(#trendGlow)" stroke-linecap="round" stroke-width="2.5"/>
          <circle cx="286" cy="28" fill="#9c404e" r="4" stroke="#fff8f5" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="admin-trend-note">
        <div class="admin-trend-left">
          <span class="material-symbols-outlined admin-trend-icon">auto_graph</span>
          <span>Proyección cierre Q4: Superando meta en +12%</span>
        </div>
        <span class="admin-trend-badge">SÓLIDO</span>
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

      <!-- Item 1 -->
      <div class="order-feed-item">
        <div class="order-feed-thumb">
          <span class="material-symbols-outlined">checkroom</span>
        </div>
        <div class="order-feed-info">
          <div class="order-feed-header-line">
            <span class="order-feed-id">ORD-20241028-9412</span>
            <span class="order-feed-dot">•</span>
            <span class="order-feed-badge order-badge-pending">Pendiente de Envío</span>
          </div>
          <p class="order-feed-desc">Legging Escultor Seda • Talla M • $185</p>
        </div>
        <div class="order-feed-right">
          <span class="order-feed-time">11:42 AM</span>
          <button class="order-feed-action-btn" title="Atender por WhatsApp" onclick="if(typeof showToast==='function')showToast('Abriendo conversación de WhatsApp...')">
            <span class="material-symbols-outlined" style="font-size:16px;">send</span>
          </button>
        </div>
      </div>

      <!-- Item 2 -->
      <div class="order-feed-item">
        <div class="order-feed-thumb">
          <span class="material-symbols-outlined">shopping_bag</span>
        </div>
        <div class="order-feed-info">
          <div class="order-feed-header-line">
            <span class="order-feed-id">ORD-20241028-8801</span>
            <span class="order-feed-dot">•</span>
            <span class="order-feed-badge order-badge-confirmed">Confirmado</span>
          </div>
          <p class="order-feed-desc">Set Deportivo Café • Talla S • $210</p>
        </div>
        <div class="order-feed-right">
          <span class="order-feed-time">09:15 AM</span>
          <button class="order-feed-action-btn" title="Atender por WhatsApp" onclick="if(typeof showToast==='function')showToast('Abriendo conversación de WhatsApp...')">
            <span class="material-symbols-outlined" style="font-size:16px;">send</span>
          </button>
        </div>
      </div>
    </div>

    <!-- SECCIÓN INVENTARIO & MATRIZ DE STOCK -->
    <section class="inv-section" id="inv-section">
      <!-- 1. STRIP DE ACCESO VERIFICADO -->
      <div class="inv-access-strip">
        <div class="inv-access-left">
          <span class="material-symbols-outlined inv-access-icon">verified_user</span>
          <span>Acceso seguro verificado: aurafit2024</span>
        </div>
        <span class="inv-live-pill">EN VIVO</span>
      </div>

      <!-- 2. TÍTULO DE SECCIÓN -->
      <div class="inv-section-header">
        <h2 class="inv-title">Inventario & Matriz</h2>
        <p class="inv-subtitle">Control de Existencias por Color y Talla & Gestión de Catálogo</p>
      </div>

      <!-- 3. MINI KPIs BENTO (3 columnas) -->
      <div class="inv-kpi-bento">
        <!-- Mini KPI 1 -->
        <div class="inv-kpi-mini">
          <span class="inv-kpi-label" style="color:#6a5220;">UNIDADES</span>
          <div class="inv-kpi-value">95</div>
          <div class="inv-kpi-sub" style="color:var(--brown);">
            <span class="material-symbols-outlined">check_circle</span>
            <span>6 Lotes</span>
          </div>
        </div>

        <!-- Mini KPI 2 -->
        <div class="inv-kpi-mini">
          <span class="inv-kpi-label" style="color:var(--wine);">BAJO STOCK</span>
          <div class="inv-kpi-value" style="color:var(--wine);">2</div>
          <div class="inv-kpi-sub" style="color:var(--wine);">
            <span class="material-symbols-outlined">warning</span>
            <span>Crítico</span>
          </div>
        </div>

        <!-- Mini KPI 3 -->
        <div class="inv-kpi-mini">
          <span class="inv-kpi-label" style="color:var(--brown);">ÓPTIMOS</span>
          <div class="inv-kpi-value">3</div>
          <div class="inv-kpi-sub" style="color:#6a5220;">
            <span class="material-symbols-outlined">spa</span>
            <span>Estable</span>
          </div>
        </div>
      </div>

      <!-- 4. CONTROLES DE FILTRO + ACCIONES -->
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

      <!-- 5. TABLA MATRIZ DE EXISTENCIAS -->
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
                <th>Producto</th>
                <th>Color</th>
                <th>XS</th>
                <th>S</th>
                <th>M</th>
                <th>L</th>
                <th>XL</th>
                <th>Total</th>
                <th>Estado/Alerta</th>
              </tr>
            </thead>
            <tbody>
              <!-- Fila 1 -->
              <tr class="inv-stock-row" data-status="optimal" data-name="Legging Sculpt Pro" data-color="Negro Obsidiana" data-total="25">
                <td>Legging Sculpt Pro</td>
                <td>
                  <div class="inv-color-cell">
                    <span class="inv-color-dot" style="background:#27180a;"></span>
                    <span>Negro Obsidiana</span>
                  </div>
                </td>
                <td>4</td>
                <td>8</td>
                <td>6</td>
                <td>5</td>
                <td>2</td>
                <td class="inv-total-cell">25</td>
                <td><span class="inv-badge inv-badge-optimal">Óptimo</span></td>
              </tr>

              <!-- Fila 2 -->
              <tr class="inv-stock-row inv-row-low" data-status="low" data-name="Legging Sculpt Pro" data-color="Vino Intenso" data-total="4">
                <td>Legging Sculpt Pro</td>
                <td>
                  <div class="inv-color-cell">
                    <span class="inv-color-dot inv-color-dot-pulse"></span>
                    <span>Vino Intenso</span>
                  </div>
                </td>
                <td>1</td>
                <td class="inv-zero-cell">0</td>
                <td>2</td>
                <td>1</td>
                <td class="inv-zero-cell">0</td>
                <td class="inv-total-cell">4</td>
                <td><span class="inv-badge inv-badge-low">BAJO STOCK</span></td>
              </tr>

              <!-- Fila 3 -->
              <tr class="inv-stock-row" data-status="optimal" data-name="Top Elevation" data-color="Crema Suave" data-total="29">
                <td>Top Elevation</td>
                <td>
                  <div class="inv-color-cell">
                    <span class="inv-color-dot" style="background:#fff8f5;border:1px solid #d1c5b2;"></span>
                    <span>Crema Suave</span>
                  </div>
                </td>
                <td>5</td>
                <td>7</td>
                <td>10</td>
                <td>4</td>
                <td>3</td>
                <td class="inv-total-cell">29</td>
                <td><span class="inv-badge inv-badge-optimal">Óptimo</span></td>
              </tr>

              <!-- Fila 4 -->
              <tr class="inv-stock-row inv-row-reorder" data-status="low" data-name="Top Elevation" data-color="Champagne" data-total="6">
                <td>Top Elevation</td>
                <td>
                  <div class="inv-color-cell">
                    <span class="inv-color-dot" style="background:#ffeada;border:1px solid #e4c285;"></span>
                    <span>Champagne</span>
                  </div>
                </td>
                <td>2</td>
                <td>1</td>
                <td class="inv-zero-cell">0</td>
                <td>2</td>
                <td>1</td>
                <td class="inv-total-cell">6</td>
                <td><span class="inv-badge inv-badge-low">REABASTECER</span></td>
              </tr>

              <!-- Fila 5 -->
              <tr class="inv-stock-row" data-status="optimal" data-name="Set Aura Completo" data-color="Negro Obsidiana" data-total="17">
                <td>Set Aura Completo</td>
                <td>
                  <div class="inv-color-cell">
                    <span class="inv-color-dot" style="background:#27180a;"></span>
                    <span>Negro Obsidiana</span>
                  </div>
                </td>
                <td style="color:#4e4637;">-</td>
                <td>6</td>
                <td>5</td>
                <td>4</td>
                <td>2</td>
                <td class="inv-total-cell">17</td>
                <td><span class="inv-badge inv-badge-regular">Regular</span></td>
              </tr>

              <!-- Fila 6 -->
              <tr class="inv-stock-row" data-status="optimal" data-name="Bolso Mesh" data-color="Negro Obsidiana" data-total="14">
                <td>Bolso Mesh</td>
                <td>
                  <div class="inv-color-cell">
                    <span class="inv-color-dot" style="background:#27180a;"></span>
                    <span>Negro Obsidiana</span>
                  </div>
                </td>
                <td colspan="5" style="font-style:italic;color:#6B5E52;">Talla Única: 14</td>
                <td class="inv-total-cell">14</td>
                <td><span class="inv-badge inv-badge-optimal">Óptimo</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="inv-table-footer">
          <span>Mostrando 6 variantes activas</span>
          <button class="inv-footer-action-btn" type="button" onclick="document.querySelector('.inv-stock-row')?.click()">
            <span>Toca una fila para editar</span>
            <span class="material-symbols-outlined" style="font-size:14px;">edit</span>
          </button>
        </div>
      </div>

      <!-- 6. BANNER EDITORIAL -->
      <div class="inv-editorial-banner">
        <div class="inv-editorial-thumb">
          <span class="material-symbols-outlined" style="font-size:32px;">styler</span>
        </div>
        <div class="inv-editorial-content">
          <p class="inv-editorial-label">AURA ATELIER STUDIO</p>
          <h4 class="inv-editorial-title">Colección Silueta '26</h4>
          <p class="inv-editorial-body">Nuevas reposiciones programadas para el fin de semana.</p>
        </div>
        <span class="material-symbols-outlined inv-editorial-arrow">arrow_forward</span>
      </div>
    </section>

    <!-- 7. DRAWER DESLIZANTE (Bottom Sheet) -->
    <div id="inventory-drawer" class="inv-drawer-overlay">
      <div class="inv-drawer-panel" id="inv-drawer-panel">
        <!-- Header -->
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

        <!-- Toggle Activo / Inactivo -->
        <div class="inv-drawer-toggle-card">
          <div>
            <p class="inv-drawer-toggle-label">Estado del Producto</p>
            <p class="inv-drawer-toggle-sub">Visible en la boutique digital</p>
          </div>
          <label class="inv-switch" aria-label="Estado activo del producto">
            <input type="checkbox" id="inv-product-active-toggle" checked>
            <span class="inv-slider"></span>
          </label>
        </div>

        <!-- Input Stock -->
        <div class="inv-stock-control-group">
          <label for="inv-stock-input" class="inv-stock-control-label">Actualizar Stock / Inyección de Lote</label>
          <div class="inv-stock-stepper-row">
            <button type="button" class="inv-step-btn" id="inv-dec-btn" aria-label="Disminuir stock">−</button>
            <input type="number" id="inv-stock-input" class="inv-stock-input" value="25" min="0" step="1">
            <button type="button" class="inv-step-btn" id="inv-inc-btn" aria-label="Aumentar stock">＋</button>
          </div>
        </div>

        <p class="inv-drawer-hint">El ajuste recalculará automáticamente la alerta de stock y sincronizará con la boutique.</p>

        <!-- Botones -->
        <div class="inv-drawer-actions">
          <button type="button" class="inv-drawer-save-btn" id="inv-save-btn">Guardar Cambios</button>
          <button type="button" class="inv-drawer-cancel-btn" id="inv-cancel-btn">Descartar</button>
        </div>
      </div>
    </div>

    <!-- 8. TOAST DE FEEDBACK -->
    <div id="inv-toast" role="alert" aria-live="polite">
      <span class="material-symbols-outlined" id="inv-toast-icon" style="font-size:18px;">check_circle</span>
      <span id="inv-toast-msg">Stock actualizado correctamente</span>
    </div>
  `;

  if (typeof initInventory === 'function') {
    initInventory();
  }
}

function exportStockCSV() {
  const activeProducts = products.filter(p => p.active);
  const headers = ['Producto', 'Categoría', 'Color', 'Talla', 'Stock'];
  const rows = [];
  activeProducts.forEach(p => {
    p.colors.forEach(c => {
      p.sizes.forEach(s => {
        rows.push([p.name, p.category, c.name, s, getStock(p, c.name, s)]);
      });
    });
  });
  if (rows.length === 0) {
    showToast('No hay datos de stock', 'warning');
    return;
  }
  downloadCSV(rows, headers, 'stock_aurafit.csv');
}

function renderOutOfStock() {
  const content = document.getElementById('admin-content');
  if (!content) return;

  const outOfStockProducts = getOutOfStock();
  const zeroStockVariants = [];

  products.filter(p => p.active).forEach(p => {
    p.colors.forEach(c => {
      p.sizes.forEach(s => {
        const stock = getStock(p, c.name, s);
        if (stock === 0) {
          zeroStockVariants.push({ product: p, color: c, size: s });
        }
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

    <!-- Alert Banner -->
    ${zeroStockVariants.length > 0 ? `
      <div style="background:rgba(122, 30, 46, 0.08);border:1px solid var(--danger);padding:16px 20px;border-radius:var(--radius);margin-bottom:24px;display:flex;align-items:center;gap:12px">
        <span style="font-size:20px">⚠️</span>
        <div style="font-size:13px;color:var(--text)">
          Hay <strong>${zeroStockVariants.length} variante(s)</strong> y <strong>${outOfStockProducts.length} producto(s) totalmente agotados</strong>.
        </div>
      </div>
    ` : `
      <div style="background:rgba(46, 125, 50, 0.08);border:1px solid #2E7D32;padding:16px 20px;border-radius:var(--radius);margin-bottom:24px;display:flex;align-items:center;gap:12px">
        <span style="font-size:20px">✅</span>
        <div style="font-size:13px;color:var(--text)">¡Excelente! Todas las variantes tienen inventario disponible.</div>
      </div>
    `}

    <!-- Zero stock variants table -->
    <div style="background:var(--bg-card);border:1px solid var(--border);padding:24px;border-radius:var(--radius-lg);margin-bottom:24px">
      <h3 style="font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:16px">Variantes Agotadas (${zeroStockVariants.length})</h3>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="border-bottom:2px solid var(--border)">
              ${['Producto', 'Categoría', 'Color', 'Talla', 'Precio', 'Acción'].map(h =>
                `<th style="text-align:left;padding:10px 12px;color:var(--text-muted);font-size:11px;text-transform:uppercase">${h}</th>`
              ).join('')}
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
                    <button class="btn-ghost" style="font-size:12px;color:var(--champagne)" onclick="loadPanel('incomes')">Reponer</button>
                    <button class="btn-ghost" style="font-size:12px;margin-left:8px" onclick="openProductForm('${v.product.id}')">Editar</button>
                  </td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}
