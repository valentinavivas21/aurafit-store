function updateCartBadge() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
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
}

function addToCart(product, color, size, qty) {
  const existing = cart.find(i => i.productId === product.id && i.color === color && i.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId: product.id, name: product.name, color, size, qty, price: product.price });
  }
  saveCart();
  updateCartBadge();
  showToast('¡Producto agregado al carrito! 🛍️');
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  if (!container || !summary) return;
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:80px 20px">
        <div style="font-size:64px;margin-bottom:16px">🛍️</div>
        <h3 style="font-family:var(--font-serif);font-size:24px;font-weight:400;margin-bottom:8px">Tu carrito está vacío</h3>
        <p style="color:var(--text-muted);margin-bottom:24px">Explora nuestro catálogo y encuentra algo que te encante</p>
        <button class="btn-primary" onclick="goTo('screen-store')">Explorar Catálogo</button>
      </div>`;
    summary.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div style="display:flex;align-items:center;gap:16px;padding:20px 0;border-bottom:1px solid var(--border)">
      <div style="width:64px;height:64px;background:var(--surface);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <span style="font-family:var(--font-serif);font-size:24px;opacity:0.5">${item.name.charAt(0)}</span>
      </div>
      <div style="flex:1">
        <p style="font-weight:500;margin-bottom:2px">${item.name}</p>
        <p style="font-size:13px;color:var(--text-muted)">${item.color} / ${item.size}</p>
        <p style="font-size:14px;color:var(--champagne);margin-top:4px">$${item.price} USD c/u</p>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn-ghost" style="font-size:18px;padding:4px 10px" onclick="updateQuantity(${index}, -1)">−</button>
        <span style="font-size:16px;font-weight:500;min-width:20px;text-align:center">${item.qty}</span>
        <button class="btn-ghost" style="font-size:18px;padding:4px 10px" onclick="updateQuantity(${index}, 1)">+</button>
      </div>
      <div style="text-align:right;min-width:80px">
        <p style="font-weight:600">$${(item.price * item.qty).toFixed(2)}</p>
        <button class="btn-ghost" style="font-size:12px;color:var(--danger);margin-top:4px" onclick="removeFromCart(${index})">Eliminar</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  summary.innerHTML = `
    <div style="border-top:2px solid var(--border);padding-top:20px;margin-top:8px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;color:var(--text-muted)">
        <span>Subtotal</span><span>$${total.toFixed(2)} USD</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:20px;font-family:var(--font-serif)">
        <span>Total</span><span style="font-weight:600">$${total.toFixed(2)} USD</span>
      </div>
      <p style="font-size:12px;color:var(--text-muted);margin-top:8px">* Pago y envío se coordinan por WhatsApp</p>
      <div class="cart-actions" style="margin-top:20px;display:flex;flex-direction:column;gap:12px">
        <button id="btn-whatsapp" class="btn-primary btn-checkout" onclick="confirmWhatsApp()">
          Confirmar por WhatsApp 💬
        </button>
        <button class="btn-ghost btn-continue" onclick="goTo('screen-store')">
          Seguir Comprando
        </button>
      </div>
    </div>`;
}

function updateQuantity(index, delta) {
  const item = cart[index];
  const product = products.find(p => p.id === item.productId);
  const maxStock = product ? getStock(product, item.color, item.size) : 99;
  item.qty = Math.max(1, Math.min(maxStock, item.qty + delta));
  saveCart();
  updateCartBadge();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCart();
  showToast('Producto eliminado');
}

function generateOrderId() {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const rand = Math.random().toString(36).substr(2,4).toUpperCase();
  return `ORD-${date}-${rand}`;
}

function confirmWhatsApp() {
  if (cart.length === 0) {
    showToast('Tu carrito está vacío', 'warning');
    return;
  }
  const orderId = generateOrderId();
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemLines = cart.map(i =>
    `• ${i.name} (${i.color} / ${i.size}) × ${i.qty} — $${(i.price * i.qty).toFixed(2)} USD`
  ).join('\n');
  const msg = `*AURA FIT — Nuevo Pedido* 🛍️\n\n*N° de Orden:* ${orderId}\n\n*Productos:*\n${itemLines}\n\n*Total: $${total.toFixed(2)} USD*\n\n_Estoy lista para coordinar el pago y envío_ ✨`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  cart = [];
  saveCart();
  updateCartBadge();
  showToast('¡Pedido enviado por WhatsApp! 🎉');
  setTimeout(() => goTo('screen-store'), 1500);
}

// Wire up cart screen buttons
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  // "Confirmar por WhatsApp" button
  document.getElementById('btn-whatsapp')?.addEventListener('click', confirmWhatsApp);
  // Navigate to cart
  document.getElementById('btn-cart')?.addEventListener('click', () => {
    renderCart();
    goTo('screen-cart');
  });
});
