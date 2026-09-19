let currentFilter = 'Todos';
let activeModal = null;

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  // Show 4 skeleton cards before rendering
  grid.innerHTML = Array(4).fill('<div class="product-card skeleton product-card-skeleton"></div>').join('');

  setTimeout(() => {
    const list = products.filter(p =>
      p.active && hasAnyStock(p) &&
      (currentFilter === 'Todos' || p.category === currentFilter)
    );
    if (list.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">No hay productos disponibles en esta categoría.</div>';
      return;
    }
    grid.innerHTML = list.map(p => productCardHTML(p)).join('');
  }, 50);
}

function productCardHTML(p) {
  const firstColor = p.colors[0];
  const colorDots = p.colors.map(c =>
    `<span class="color-dot" role="radio" aria-checked="false" aria-label="${c.name}" style="background:${c.hex}" data-color="${c.name}" title="${c.name}"></span>`
  ).join('');
  return `
    <div class="product-card" style="cursor:pointer" onclick="openProductDetail('${p.id}')">
      <div class="card-image" style="height:280px;background:linear-gradient(135deg,${firstColor.hex}22,${firstColor.hex}44);display:flex;align-items:center;justify-content:center">
        <span style="font-family:var(--font-serif);font-size:48px;opacity:0.3;color:${firstColor.hex}">${p.name.charAt(0)}</span>
      </div>
      <div style="padding:20px">
        <div style="display:flex;gap:8px;margin-bottom:10px" role="radiogroup" aria-label="Colores">${colorDots}</div>
        <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--champagne);margin-bottom:4px">${p.category}</p>
        <h3 style="font-family:var(--font-serif);font-size:20px;font-weight:400;margin-bottom:8px">${p.name}</h3>
        <p style="font-size:16px;font-weight:500">$${p.price} USD</p>
      </div>
    </div>`;
}

function openProductDetail(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;
  
  let selectedColor = p.colors[0].name;
  let selectedSize = null;
  let qty = 1;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  overlay.id = 'product-detail-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  function renderDetail() {
    const colorDots = p.colors.map(c =>
      `<span class="color-dot ${c.name === selectedColor ? 'selected' : ''}"
        role="radio"
        aria-checked="${c.name === selectedColor}"
        aria-label="${c.name}"
        style="background:${c.hex};width:32px;height:32px"
        onclick="event.stopPropagation();window._selectColor('${c.name}')"
        title="${c.name}"></span>`
    ).join('');

    const sizePills = p.sizes.map(s => {
      const stock = getStock(p, selectedColor, s);
      const isAvailable = stock > 0;
      const isSelected = s === selectedSize;
      return `<span class="size-pill ${isSelected ? 'active' : ''} ${!isAvailable ? 'unavailable' : ''}"
        onclick="event.stopPropagation();${isAvailable ? `window._selectSize('${s}')` : ''}">${s}${isAvailable ? '' : ''}</span>`;
    }).join('');

    const availableStock = selectedSize ? getStock(p, selectedColor, selectedSize) : 0;
    const currentColorObj = p.colors.find(c => c.name === selectedColor) || p.colors[0];

    overlay.innerHTML = `
      <div class="modal-card" onclick="event.stopPropagation()" style="max-width:500px;width:90%">
        <button class="btn-ghost" style="float:right;font-size:20px" aria-label="Cerrar modal" onclick="document.getElementById('product-detail-modal').remove()">×</button>
        <div style="height:200px;background:linear-gradient(135deg,${currentColorObj.hex}22,${currentColorObj.hex}55);display:flex;align-items:center;justify-content:center;margin:-32px -32px 24px">
          <span style="font-family:var(--font-serif);font-size:72px;opacity:0.3">${p.name.charAt(0)}</span>
        </div>
        <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--champagne)">${p.category}</p>
        <h2 style="font-family:var(--font-serif);font-size:28px;font-weight:400;margin:8px 0">${p.name}</h2>
        <p style="color:var(--text-muted);font-size:14px;margin-bottom:20px">${p.description}</p>
        <p style="font-size:22px;font-weight:500;margin-bottom:20px">$${p.price} USD</p>
        <div class="form-group">
          <label class="label">Color: ${selectedColor}</label>
          <div style="display:flex;gap:10px" role="radiogroup" aria-label="Colores disponibles">${colorDots}</div>
        </div>
        <div class="form-group">
          <label class="label">Talla</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap">${sizePills}</div>
        </div>
        ${selectedSize ? `
          <div class="form-group">
            <label class="label">Cantidad (${availableStock} disponibles)</label>
            <div style="display:flex;align-items:center;gap:12px">
              <button class="btn-ghost" aria-label="Disminuir cantidad" onclick="event.stopPropagation();window._changeQty(-1)">−</button>
              <span id="qty-display" style="font-size:18px;min-width:24px;text-align:center">${qty}</span>
              <button class="btn-ghost" aria-label="Aumentar cantidad" onclick="event.stopPropagation();window._changeQty(1)">+</button>
            </div>
          </div>
          <button class="btn-primary" style="width:100%" onclick="event.stopPropagation();window._addToCart()">Agregar al Carrito</button>
        ` : '<p style="color:var(--text-muted);font-size:13px">Selecciona una talla para continuar</p>'}
      </div>`;
  }

  window._selectColor = (colorName) => {
    selectedColor = colorName;
    selectedSize = null;
    qty = 1;
    renderDetail();
  };
  window._selectSize = (size) => {
    selectedSize = size;
    qty = 1;
    renderDetail();
  };
  window._changeQty = (delta) => {
    const max = getStock(p, selectedColor, selectedSize);
    qty = Math.max(1, Math.min(max, qty + delta));
    const qtyDisplay = document.getElementById('qty-display');
    if (qtyDisplay) qtyDisplay.textContent = qty;
  };
  window._addToCart = () => {
    if (typeof addToCart === 'function') {
      addToCart(p, selectedColor, selectedSize, qty);
    }
    overlay.remove();
  };

  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
  renderDetail();
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  document.getElementById('category-filter')?.addEventListener('change', e => {
    currentFilter = e.target.value;
    renderProducts();
  });
  // Dark mode toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  });
  // Cart button
  document.querySelector('[onclick*="screen-cart"]')?.addEventListener('click', () => goTo('screen-cart'));

  // Hero CTA button smooth scroll
  document.querySelector('.hero-cta')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  });
});
