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
          <span>En Línea • Cifrado TLS 1.3</span>
        </div>
        <div class="admin-status-pill">
          <span class="material-symbols-outlined" style="font-size:14px;">verified_user</span>
          <span>Atelier Autenticado</span>
        </div>
      </div>
      <div class="admin-status-bottom">
        <h2 class="admin-status-title">Atelier AURA FIT — Panel Administrativo</h2>
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
          <h3 class="admin-feed-title">Pedidos WhatsApp Concierge</h3>
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
          <button class="order-feed-action-btn" title="Atender por WhatsApp" onclick="if(typeof showToast==='function')showToast('Abriendo conversación WhatsApp Concierge...')">
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
          <button class="order-feed-action-btn" title="Atender por WhatsApp" onclick="if(typeof showToast==='function')showToast('Abriendo conversación WhatsApp Concierge...')">
            <span class="material-symbols-outlined" style="font-size:16px;">send</span>
          </button>
        </div>
      </div>
    </div>
  `;
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
