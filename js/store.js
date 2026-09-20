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
      (currentFilter === 'Todos' || currentFilter === 'Todas' || p.category === currentFilter)
    );
    if (list.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">No hay productos disponibles en esta categoría.</div>';
      return;
    }
    grid.innerHTML = list.map(p => productCardHTML(p)).join('');
  }, 50);
}

function productCardHTML(product) {
  const defaultImg = 'img/placeholder.jpg';
  const imgSrc = product.image || defaultImg;
  const sizes = (product.sizes && product.sizes.length > 0) ? product.sizes : ['XS', 'S', 'M', 'L', 'XL'];

  return `
<article class="product-card" data-category="${product.category}" data-id="${product.id}">
  <div class="product-card-img-wrap">
    <img src="${imgSrc}" alt="${product.name}" class="product-card-img" loading="lazy" onerror="this.onerror=null;this.src='img/placeholder.svg';">
    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
    <button class="product-fav-btn" onclick="toggleFavorite(this)" aria-label="Favorito">♡</button>
  </div>
  <div class="product-card-body">
    <div class="product-card-header">
      <h2 class="product-name">${product.name}</h2>
      <span class="product-price">$${product.price} USD</span>
    </div>
    <p class="product-desc">${product.description || ''}</p>
    <div class="product-selectors">
      <div class="size-group">
        <span class="selector-label">Talla</span>
        <div class="size-btns">
          ${sizes.map((s, i) =>
            `<button type="button" class="size-btn${i === 1 || (sizes.length === 1 && i === 0) ? ' size-btn-active' : ''}" onclick="selectSize(this,'${s}')">${s}</button>`
          ).join('')}
        </div>
      </div>
    </div>
    <div class="product-actions">
      <button type="button" class="btn-whatsapp" onclick="openCartModal('${product.name}', ${product.price})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.139.565 4.147 1.547 5.887L0 24l6.267-1.521C7.935 23.47 9.918 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.92 0-3.726-.5-5.29-1.375l-.368-.213-3.72.902.944-3.619-.235-.381C2.533 15.756 2 13.938 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        Comprar vía WhatsApp
      </button>
      <button type="button" class="btn-detail" onclick="showProductDetail('${product.id}')" aria-label="Ver detalle">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
      </button>
    </div>
  </div>
</article>`;
}

function toggleFavorite(btn) {
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    btn.textContent = '♥';
    showToast('Guardado en favoritos ❤️');
  } else {
    btn.textContent = '♡';
  }
}

function selectSize(btn, size) {
  const parent = btn.closest('.size-btns');
  if (parent) {
    parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('size-btn-active'));
  }
  btn.classList.add('size-btn-active');
}

function showProductDetail(productId) {
  openProductDetail(productId);
}

function openCartModal(productName, price) {
  const p = products.find(x => x.name === productName);
  let selectedSize = 'S';
  if (p && p.sizes && p.sizes.length > 0) {
    selectedSize = p.sizes.includes('S') ? 'S' : p.sizes[0];
  }
  
  if (window.event && window.event.target) {
    const card = window.event.target.closest('.product-card');
    const activeSizeBtn = card?.querySelector('.size-btn-active');
    if (activeSizeBtn) {
      selectedSize = activeSizeBtn.textContent.trim();
    }
  }

  const color = (p && p.colors && p.colors[0]) ? p.colors[0].name : '';
  const msg = `*AURA FIT — Compra Directa* 🛍️\n\nHola, me interesa comprar:\n• *Producto:* ${productName}\n• *Talla:* ${selectedSize}${color ? `\n• *Color:* ${color}` : ''}\n• *Precio:* $${price} USD\n\n¿Tienen disponibilidad para coordinar el pago y envío? ✨`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function filterCategory(category) {
  currentFilter = (category === 'Todas' || category === 'Todos') ? 'Todos' : category;

  // Update pills UI
  document.querySelectorAll('.category-pills .pill').forEach(pill => {
    const text = pill.textContent.trim();
    if ((category === 'Todas' || category === 'Todos') && (text === 'Todas' || text === 'Todos')) {
      pill.classList.add('pill-active');
    } else if (text.toLowerCase() === category.toLowerCase()) {
      pill.classList.add('pill-active');
    } else {
      pill.classList.remove('pill-active');
    }
  });

  // Update bottom nav active state if needed
  if (category === 'Leggings') {
    document.querySelectorAll('.bottom-nav-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById('nav-cats')?.classList.add('active');
  }

  if (!document.getElementById('screen-store')?.classList.contains('active')) {
    showScreen('store');
  }

  renderProducts();

  const catSection = document.getElementById('catalog');
  if (catSection && category !== 'Todas' && category !== 'Todos') {
    setTimeout(() => catSection.scrollIntoView({ behavior: 'smooth' }), 100);
  }
}

function showScreen(screen) {
  document.querySelectorAll('.bottom-nav-item').forEach(btn => btn.classList.remove('active'));
  const navBtn = document.getElementById(`nav-${screen}`);
  if (navBtn) navBtn.classList.add('active');

  if (screen === 'store') {
    goTo('screen-store');
  } else if (screen === 'cart') {
    if (typeof renderCart === 'function') renderCart();
    goTo('screen-cart');
  } else if (screen === 'about') {
    goTo('screen-store');
    setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
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
        onclick="event.stopPropagation();${isAvailable ? `window._selectSize('${s}')` : ''}">${s}</span>`;
    }).join('');

    const availableStock = selectedSize ? getStock(p, selectedColor, selectedSize) : 0;
    const currentColorObj = p.colors.find(c => c.name === selectedColor) || p.colors[0];

    overlay.innerHTML = `
      <div class="modal-card" onclick="event.stopPropagation()" style="max-width:500px;width:90%">
        <button class="btn-ghost" style="float:right;font-size:20px;padding:4px 12px" aria-label="Cerrar modal" onclick="document.getElementById('product-detail-modal').remove()">×</button>
        <div style="height:200px;background:linear-gradient(135deg,${currentColorObj.hex}22,${currentColorObj.hex}55);display:flex;align-items:center;justify-content:center;margin:-32px -32px 24px;position:relative;overflow:hidden">
          <img src="${p.image || 'img/placeholder.jpg'}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;opacity:0.85" onerror="this.style.display='none'">
          <span style="position:absolute;font-family:var(--font-serif);font-size:72px;opacity:0.25;color:${currentColorObj.hex}">${p.name.charAt(0)}</span>
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
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">
            <button class="btn-primary" style="width:100%" onclick="event.stopPropagation();window._addToCart()">Agregar a la Bolsa 🛍️</button>
            <button class="btn-whatsapp" style="width:100%" onclick="event.stopPropagation();window._buyWhatsApp()">Comprar vía WhatsApp 💬</button>
          </div>
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
  window._buyWhatsApp = () => {
    const msg = `*AURA FIT — Compra Directa* 🛍️\n\nHola, me interesa comprar:\n• *Producto:* ${p.name}\n• *Color:* ${selectedColor}\n• *Talla:* ${selectedSize}\n• *Cantidad:* ${qty}\n• *Total:* $${(p.price * qty).toFixed(2)} USD\n\n¿Podemos coordinar el pago y envío? ✨`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    overlay.remove();
  };

  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
  renderDetail();
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  document.getElementById('category-filter')?.addEventListener('change', e => {
    filterCategory(e.target.value);
  });
  // Dark mode toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  });
  // Cart button
  document.querySelector('[onclick*="screen-cart"]')?.addEventListener('click', () => {
    if (typeof renderCart === 'function') renderCart();
    goTo('screen-cart');
  });
});
