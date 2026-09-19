function renderDashboard() {
  const content = document.getElementById('admin-content');
  if (!content) return;

  // Compute KPIs
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalUSD, 0);
  const totalCost = incomes.reduce((sum, i) => sum + i.totalCost, 0);
  const grossMargin = totalRevenue - totalCost;
  const marginPct = totalRevenue > 0 ? (grossMargin / totalRevenue * 100) : 0;
  const totalUnitsSold = sales.reduce((sum, s) => sum + s.qty, 0);
  const activeProductsCount = products.filter(p => p.active).length;
  const outOfStockCount = getOutOfStock().length;

  // Monthly sales (last 6 months)
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('es-VE', { month: 'short', year: '2-digit' }),
      total: 0
    });
  }
  sales.forEach(s => {
    const key = s.date.substring(0, 7);
    const month = months.find(m => m.key === key);
    if (month) month.total += s.totalUSD;
  });
  const maxMonthly = Math.max(...months.map(m => m.total), 1);

  // Stock table data
  const activeProducts = products.filter(p => p.active);

  // Rotation table
  const rotation = activeProducts.map(p => {
    const totalSold = sales.filter(s => s.productId === p.id).reduce((sum, s) => sum + s.qty, 0);
    const totalIn = incomes.filter(i => i.productId === p.id).reduce((sum, i) => sum + i.units, 0);
    const lastSale = sales.filter(s => s.productId === p.id).sort((a, b) => b.date.localeCompare(a.date))[0];
    const rotationRate = totalIn > 0 ? (totalSold / totalIn * 100).toFixed(1) + '%' : '—';
    return { name: p.name, category: p.category, totalSold, totalIn, rotationRate, lastSale: lastSale?.date || '—' };
  }).sort((a, b) => b.totalSold - a.totalSold);

  content.innerHTML = `
    <h2 style="font-family:var(--font-serif);font-size:28px;font-weight:400;margin-bottom:24px">Dashboard</h2>

    <!-- KPI Cards -->
    <div class="kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px">
      ${[
        { label: 'Ingresos Totales', value: '$' + totalRevenue.toFixed(2), sub: 'USD', icon: '💰', color: 'var(--champagne)' },
        { label: 'Margen Bruto', value: '$' + grossMargin.toFixed(2), sub: marginPct.toFixed(1) + '% del total', icon: '📈', color: grossMargin >= 0 ? '#2E7D32' : 'var(--danger)' },
        { label: 'Unidades Vendidas', value: totalUnitsSold, sub: activeProductsCount + ' productos activos', icon: '📦', color: 'var(--text)' },
        { label: 'Sin Stock', value: outOfStockCount, sub: outOfStockCount > 0 ? 'requieren reposición' : 'todo disponible ✓', icon: '⚠️', color: outOfStockCount > 0 ? 'var(--danger)' : '#2E7D32' }
      ].map(kpi => `
        <div style="background:var(--bg-card);border:1px solid var(--border);padding:20px;border-radius:var(--radius)">
          <div style="font-size:24px;margin-bottom:8px">${kpi.icon}</div>
          <p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:6px">${kpi.label}</p>
          <p style="font-size:28px;font-family:var(--font-serif);font-weight:400;color:${kpi.color}">${kpi.value}</p>
          <p style="font-size:12px;color:var(--text-muted);margin-top:4px">${kpi.sub}</p>
        </div>
      `).join('')}
    </div>

    <!-- Monthly Chart -->
    <div style="background:var(--bg-card);border:1px solid var(--border);padding:24px;margin-bottom:24px;border-radius:var(--radius-lg)">
      <h3 style="font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:20px">Ventas Mensuales (USD)</h3>
      <div style="display:flex;align-items:flex-end;gap:12px;height:160px">
        ${months.map(m => `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%">
            <span style="font-size:11px;color:var(--champagne);font-weight:500">${m.total > 0 ? '$' + m.total.toFixed(0) : ''}</span>
            <div style="flex:1;width:100%;display:flex;align-items:flex-end">
              <div style="width:100%;background:var(--champagne);border-radius:2px 2px 0 0;height:${Math.max(4, (m.total / maxMonthly) * 100)}%;min-height:4px;opacity:${m.total > 0 ? 1 : 0.2}"></div>
            </div>
            <span style="font-size:11px;color:var(--text-muted)">${m.label}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Stock Table -->
    <div style="background:var(--bg-card);border:1px solid var(--border);padding:24px;margin-bottom:24px;border-radius:var(--radius-lg)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted)">Estado de Inventario</h3>
        <button class="btn-outline" onclick="exportStockCSV()" style="font-size:12px;padding:8px 16px">⬇ Exportar Stock</button>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="border-bottom:2px solid var(--border)">
              <th style="text-align:left;padding:10px 12px;color:var(--text-muted);font-size:11px;text-transform:uppercase">Producto</th>
              <th style="text-align:left;padding:10px 12px;color:var(--text-muted);font-size:11px;text-transform:uppercase">Color</th>
              ${SIZES_ORDER.map(s => `<th style="text-align:center;padding:10px 8px;color:var(--text-muted);font-size:11px">${s}</th>`).join('')}
              <th style="text-align:center;padding:10px 12px;color:var(--text-muted);font-size:11px;text-transform:uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            ${activeProducts.flatMap(p =>
              p.colors.map(c => {
                const colorTotal = getTotalStock(p, c.name);
                return `<tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:10px 12px;font-weight:500">${p.name}</td>
                  <td style="padding:10px 12px">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c.hex};margin-right:6px"></span>
                    ${c.name}
                  </td>
                  ${SIZES_ORDER.map(s => {
                    if (!p.sizes.includes(s)) return `<td style="padding:10px 8px;text-align:center;color:var(--border)">—</td>`;
                    const qty = getStock(p, c.name, s);
                    return `<td style="padding:10px 8px;text-align:center;font-weight:${qty === 0 ? '400' : '500'};color:${qty === 0 ? 'var(--danger)' : qty <= 2 ? '#E65100' : 'inherit'}">${qty}</td>`;
                  }).join('')}
                  <td style="padding:10px 12px;text-align:center;font-weight:600;color:${colorTotal === 0 ? 'var(--danger)' : 'var(--champagne)'}">${colorTotal}</td>
                </tr>`;
              })
            ).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Rotation Table -->
    <div style="background:var(--bg-card);border:1px solid var(--border);padding:24px;margin-bottom:24px;border-radius:var(--radius-lg)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted)">Rotación de Productos</h3>
        <button class="btn-outline" onclick="exportSalesCSV()" style="font-size:12px;padding:8px 16px">⬇ Exportar Ventas</button>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="border-bottom:2px solid var(--border)">
              ${['Producto', 'Categoría', 'Unid. Ingresadas', 'Unid. Vendidas', 'Rotación', 'Última Venta'].map(h =>
                `<th style="text-align:left;padding:10px 12px;color:var(--text-muted);font-size:11px;text-transform:uppercase">${h}</th>`
              ).join('')}
            </tr>
          </thead>
          <tbody>
            ${rotation.length === 0
              ? `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-muted)">Sin datos de ventas aún</td></tr>`
              : rotation.map(r => `
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:10px 12px;font-weight:500">${r.name}</td>
                  <td style="padding:10px 12px;color:var(--text-muted)">${r.category}</td>
                  <td style="padding:10px 12px;text-align:center">${r.totalIn}</td>
                  <td style="padding:10px 12px;text-align:center;font-weight:500">${r.totalSold}</td>
                  <td style="padding:10px 12px;text-align:center">
                    <span style="color:${r.rotationRate === '—' ? 'var(--text-muted)' : parseFloat(r.rotationRate) >= 50 ? '#2E7D32' : 'var(--champagne)'};font-weight:500">${r.rotationRate}</span>
                  </td>
                  <td style="padding:10px 12px;color:var(--text-muted)">${r.lastSale}</td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Export buttons row -->
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <button class="btn-outline" onclick="exportStockCSV()" style="font-size:13px">⬇ Exportar Stock CSV</button>
      <button class="btn-outline" onclick="exportSalesCSV()" style="font-size:13px">⬇ Exportar Ventas CSV</button>
      <button class="btn-outline" onclick="exportIncomesCSV()" style="font-size:13px">⬇ Exportar Ingresos CSV</button>
    </div>`;
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
