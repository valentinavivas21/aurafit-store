// Genera un ID de orden único
function generateOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${date}-${rand}`;
}

let currentOrderId = generateOrderId();

function getCartItems() {
  return cart;
}

function saveCartItems(items) {
  cart = items;
  saveCart();
  updateCartBadge();
}

function updateCartBadge() {
  const items = getCartItems();
  const total = items.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
  const navBadge = document.getElementById('nav-cart-count');
  if (navBadge) {
    navBadge.textContent = total;
    navBadge.style.display = total > 0 ? 'flex' : 'none';
  }
  const pillCount = document.getElementById('cart-item-count');
  if (pillCount) {
    pillCount.textContent = total;
  }
}

function addToCart(product, color, size, qty) {
  const existing = cart.find(i => i.productId === product.id && i.color === color && i.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      color,
      size,
      qty,
      price: product.price,
      image: product.image || 'img/placeholder.jpg'
    });
  }
  saveCartItems(cart);
  showToast('¡Producto agregado a la bolsa! 🛍️');
}

// Muestra el carrito con los items actuales
function renderCart() {
  const items = getCartItems();
  const list = document.getElementById('cart-items-list');
  const empty = document.getElementById('cart-empty');
  const sections = ['cart-order-id-section', 'cart-summary', 'cart-form', 'wa-preview', 'cart-cta', 'cart-perks'];

  // Actualizar contador
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const countEl = document.getElementById('cart-item-count');
  if (countEl) countEl.textContent = count;
  const navBadge = document.getElementById('nav-cart-count');
  if (navBadge) navBadge.textContent = count;
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  if (!items || items.length === 0) {
    if (empty) empty.style.display = 'flex';
    if (list) {
      list.innerHTML = '';
      if (empty) list.appendChild(empty);
    }
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    return;
  }

  // Mostrar secciones
  if (empty) empty.style.display = 'none';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });

  // Render items
  if (list) {
    list.innerHTML = items.map((item, idx) => `
      <div class="cart-item-card" id="cart-item-${idx}">
        <div class="cart-item-img-wrap">
          <img src="${item.image || 'img/placeholder.jpg'}" alt="${item.name}" class="cart-item-img" loading="lazy" onerror="this.onerror=null;this.src='img/placeholder.svg';">
          <span class="cart-item-size-badge">${item.size || 'M'}</span>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-top">
            <div>
              <p class="cart-item-name">${item.name}</p>
              <p class="cart-item-color">${item.color || ''}</p>
            </div>
            <button class="btn-remove-item" onclick="removeFromCart(${idx})" aria-label="Eliminar prenda">✕</button>
          </div>
          <div class="cart-item-bottom">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="updateCartQty(${idx}, -1)" aria-label="Disminuir">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty(${idx}, 1)" aria-label="Aumentar">+</button>
            </div>
            <span class="cart-item-price">$${(item.price * item.qty).toFixed(0)} USD</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Order ID
  const orderEl = document.getElementById('order-id-display');
  if (orderEl) orderEl.textContent = currentOrderId;

  // Totals
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(0)} USD`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(0)}`;

  updateWhatsAppPreview();
}

function updateCartQty(idx, delta) {
  const items = getCartItems();
  if (!items[idx]) return;
  items[idx].qty = Math.max(1, Math.min(10, items[idx].qty + delta));
  saveCartItems(items);
  renderCart();
}

function removeFromCart(idx) {
  const items = getCartItems();
  items.splice(idx, 1);
  saveCartItems(items);
  renderCart();
  showToast('Prenda eliminada de la bolsa');
}

function copyOrderId() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(currentOrderId);
  }
  const btn = document.querySelector('.btn-copy-order');
  if (btn) {
    btn.textContent = '¡Copiado!';
    setTimeout(() => (btn.textContent = 'Copiar'), 1500);
  }
  showToast('ID de reserva copiado 📋');
}

let selectedDelivery = null;
let selectedAgency = null;

function selectDelivery(type) {
  selectedDelivery = type;
  selectedAgency = null;

  // Estilos de botones
  const btnRetiro = document.getElementById('btn-retiro');
  const btnEnvio = document.getElementById('btn-envio');
  const panel = document.getElementById('shipping-panel');
  const label = document.getElementById('delivery-label');

  if (btnRetiro) btnRetiro.style.background = type === 'retiro' ? '#27180a' : '#fff8f5';
  if (btnRetiro) btnRetiro.style.color = type === 'retiro' ? '#fff8f5' : '#27180a';
  if (btnEnvio) btnEnvio.style.background = type === 'envio' ? '#27180a' : '#fff8f5';
  if (btnEnvio) btnEnvio.style.color = type === 'envio' ? '#fff8f5' : '#27180a';

  if (panel) panel.style.display = type === 'envio' ? 'block' : 'none';
  if (label) label.textContent = type === 'retiro' ? 'Retiro en tienda' : 'Envío — elige agencia';

  // Resetear agencias
  ['Domesa','MRW','Tealca'].forEach(a => {
    const el = document.getElementById('agency-' + a);
    if (el) { el.style.background = '#fff8f5'; el.style.color = '#27180a'; }
  });

  updateWhatsAppPreview();
}

function selectAgency(name) {
  selectedAgency = name;
  ['Domesa','MRW','Tealca'].forEach(a => {
    const el = document.getElementById('agency-' + a);
    if (el) {
      el.style.background = a === name ? '#9c404e' : '#fff8f5';
      el.style.color = a === name ? '#fff8f5' : '#27180a';
      el.style.borderColor = a === name ? '#9c404e' : '#e4c285';
    }
  });
  const label = document.getElementById('delivery-label');
  if (label) label.textContent = `Envío por ${name}`;
  updateWhatsAppPreview();
}

window.selectDelivery = selectDelivery;
window.selectAgency = selectAgency;

function updateWhatsAppPreview() {
  const items = getCartItems();
  const name = document.getElementById('cust-name')?.value || 'Cliente';
  const city = document.getElementById('cust-city')?.value || 'No especificada';
  const address = document.getElementById('cust-address')?.value || '';
  const notes = document.getElementById('cust-notes')?.value || 'Ninguna';
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const deliveryInfo = selectedDelivery === 'retiro' ? 'Retiro en tienda' : selectedAgency ? `Envío por ${selectedAgency}` : 'Envío (agencia por confirmar)';
  const itemLines = items.map(i => `  - ${i.qty}x ${i.name} (${i.color || ''}, Talla ${i.size || 'M'})`).join('\n');

  const text = `Hola AURA FIT ✨ Quisiera confirmar mi pedido:\n• ID: ${currentOrderId}\n• Cliente: ${name}\n• Ciudad: ${city}${address ? '\n• Dirección: ' + address : ''}\n• Entrega: ${deliveryInfo}\n• Prendas:\n${itemLines}\n• Total: $${subtotal.toFixed(0)} USD\n• Nota: ${notes}\n¿Podrían confirmarme los métodos de pago y tiempo de entrega?`;

  const preview = document.getElementById('whatsapp-preview-text');
  if (preview) preview.textContent = text;
}

function sendOrderToWhatsApp() {
  updateWhatsAppPreview();
  const preview = document.getElementById('whatsapp-preview-text');
  const msg = preview?.textContent || 'Hola AURA FIT, quisiera confirmar mi pedido.';
  const waNumber = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : '584120000000';
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  showToast('¡Redirigiendo a WhatsApp! 💬');
}

// Wire up events
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  document.getElementById('btn-cart')?.addEventListener('click', () => {
    renderCart();
    goTo('screen-cart');
  });
});
