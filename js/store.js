/**
 * AURA FIT Activewear Studio - Store Module
 * Vanilla HTML/CSS/JS Catalog & Card Renderer
 */

// 1. Categoría activa para filtrar
let activeCategory = 'all';

// 2. Fallback de getProducts si no existe en el scope global
if (typeof window.getProducts !== 'function') {
  window.getProducts = function() {
    return (typeof products !== 'undefined' && Array.isArray(products)) ? products : [];
  };
}

// Inyección de estilos dedicados para las tarjetas de la boutique
function injectStoreStyles() {
  if (document.getElementById('store-styles')) return;

  const styleEl = document.createElement('style');
  styleEl.id = 'store-styles';
  styleEl.textContent = `
    #products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }
    @media (max-width: 640px) {
      #products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
    }
    .product-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(156, 64, 78, 0.07);
      position: relative;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(111, 81, 0, 0.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(156, 64, 78, 0.12);
    }
    .product-card-img-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 3/4;
      overflow: hidden;
      background: var(--champagne, #ffeada);
    }
    .product-card-img {
      width: 100%;
      height: 100%;
      aspect-ratio: 3/4;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;
    }
    .product-card:hover .product-card-img {
      transform: scale(1.03);
    }
    .badge-category {
      position: absolute;
      top: 10px;
      left: 10px;
      background: #fff8f5;
      color: var(--brown, #6f5100);
      font: 600 9px 'DM Sans', sans-serif;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 20px;
      z-index: 2;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }
    .product-card-body {
      padding: 12px;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 8px;
    }
    .product-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--ink, #27180a);
      margin: 0;
      line-height: 1.2;
    }
    .product-price {
      font-family: 'Cormorant Garamond', Georgia, serif;
      color: var(--wine, #9c404e);
      font-weight: 600;
      font-size: 1.15rem;
      margin: 0;
      line-height: 1;
    }
    .product-selectors-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: auto;
    }
    .color-selector-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .color-dot {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.15s, transform 0.15s;
      box-sizing: border-box;
    }
    .color-dot:hover {
      transform: scale(1.1);
    }
    .color-dot.active {
      border-color: var(--wine, #9c404e);
      outline: 1px solid #fff;
      outline-offset: -3px;
    }
    .size-selector-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }
    .size-pill {
      font: 11px/1 'DM Sans', system-ui, sans-serif;
      padding: 4px 10px;
      border-radius: 20px;
      border: 1px solid var(--wine, #9c404e);
      cursor: pointer;
      color: var(--wine, #9c404e);
      background: transparent;
      transition: all 0.15s ease;
      user-select: none;
    }
    .size-pill:hover {
      background: rgba(156, 64, 78, 0.08);
    }
    .size-pill.active {
      background: var(--wine, #9c404e);
      color: #fff;
    }
    .btn-add-cart {
      width: 100%;
      background: var(--wine, #9c404e);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px;
      font: 600 11px/1 'DM Sans', system-ui, sans-serif;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .btn-add-cart:hover {
      background: #7d3140;
    }
    .btn-add-cart:active {
      transform: scale(0.97);
    }
  `;
  document.head.appendChild(styleEl);
}

// Helper para obtener nombre y color hexadecimal
function getColorInfo(c) {
  if (typeof c === 'object' && c !== null) {
    return {
      name: c.name || 'Negro',
      hex: c.hex || colorNameToHex(c.name)
    };
  }
  const name = String(c || 'Negro');
  return {
    name: name,
    hex: colorNameToHex(name)
  };
}

function colorNameToHex(name) {
  if (!name) return '#1C1410';
  const n = name.toLowerCase().trim();
  const map = {
    'negro obsidiana': '#1C1410',
    'negro': '#1C1410',
    'black': '#1C1410',
    'vino intenso': '#7A1E2E',
    'vino': '#9C404E',
    'wine': '#9C404E',
    'crema suave': '#F5F0E8',
    'crema': '#F5F0E8',
    'cream': '#F5F0E8',
    'champagne': '#C9A96E',
    'marrón cacao': '#5C3825',
    'marrón': '#5C3825',
    'marron': '#5C3825',
    'brown': '#5C3825',
    'blanco': '#FFFFFF',
    'white': '#FFFFFF',
    'uva': '#581845',
    'rosa': '#E08594',
    'pink': '#E08594',
    'azul': '#2A4D69',
    'blue': '#2A4D69',
    'gris': '#807665',
    'gray': '#807665',
    'grey': '#807665'
  };
  return map[n] || '#C9A96E';
}

// 3. Renderizado de tarjetas de producto
function renderProducts(filter) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  if (filter !== undefined) {
    activeCategory = filter;
  }

  const allProducts = typeof getProducts === 'function' ? getProducts() : (typeof products !== 'undefined' ? products : []);

  const filtered = allProducts.filter(p => {
    if (p.active === false) return false;
    if (!activeCategory || activeCategory === 'all' || activeCategory === 'Todas' || activeCategory === 'Todos') {
      return true;
    }
    return p.category && p.category.toLowerCase() === activeCategory.toLowerCase();
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted,#6B5E52);font-family:\'DM Sans\',sans-serif;">No hay productos disponibles en esta categoría.</div>';
    return;
  }

  grid.innerHTML = '';

  filtered.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category || '';

    // Colores
    let colors = [];
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      colors = product.colors.map(getColorInfo);
    } else {
      colors = [getColorInfo('Negro')];
    }
    const defaultColor = colors[0].name;

    // Tallas
    let sizes = ['XS', 'S', 'M', 'L', 'XL'];
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      sizes = product.sizes;
    }
    const defaultSize = sizes[0];

    // 4. Estado local por tarjeta
    card.dataset.selectedColor = defaultColor;
    card.dataset.selectedSize = defaultSize;

    const imgSrc = product.image || 'img/placeholder.jpg';
    const badgeText = product.badge || product.category || 'AURA FIT';

    card.innerHTML = `
      <div class="product-card-img-wrap">
        <span class="badge-category">${badgeText}</span>
        <img src="${imgSrc}" alt="${product.name}" class="product-card-img" loading="lazy" onerror="this.onerror=null;this.src='img/placeholder.svg';">
      </div>
      <div class="product-card-body">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price} USD</p>
        
        <div class="product-selectors-group">
          <!-- Selector de Color -->
          <div class="color-selector-wrap" role="radiogroup" aria-label="Colores disponibles">
            ${colors.map((c, idx) => `
              <span class="color-dot ${idx === 0 ? 'active' : ''}" 
                    data-color="${c.name}" 
                    style="background:${c.hex};" 
                    title="${c.name}"
                    aria-label="${c.name}"></span>
            `).join('')}
          </div>

          <!-- Selector de Talla -->
          <div class="size-selector-wrap" role="radiogroup" aria-label="Tallas disponibles">
            ${sizes.map((s, idx) => `
              <button type="button" class="size-pill ${idx === 0 ? 'active' : ''}" 
                      data-size="${s}">${s}</button>
            `).join('')}
          </div>

          <!-- Botón Agregar al Carrito -->
          <div class="product-actions">
            <button type="button" class="btn-add-bag" onclick="showProductDetail('${product.id}')">
              🛒 Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    `;

    // Event listeners para dots de color
    const colorDots = card.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        card.dataset.selectedColor = dot.dataset.color;
      });
    });

    // Event listeners para pills de talla
    const sizePills = card.querySelectorAll('.size-pill');
    sizePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        sizePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        card.dataset.selectedSize = pill.dataset.size;
      });
    });

    grid.appendChild(card);
  });
}

function showProductDetail(productId) {
  const allProducts = typeof getProducts === 'function' ? getProducts() : (typeof products !== 'undefined' ? products : []);
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  let selectedColor = (product.colors && product.colors[0]) ? (product.colors[0].name || product.colors[0]) : 'Negro';
  let selectedSize = (product.sizes && product.sizes[0]) ? product.sizes[0] : 'S';

  const card = document.querySelector(`.product-card[data-id="${productId}"]`);
  if (card) {
    selectedColor = card.dataset.selectedColor || selectedColor;
    selectedSize = card.dataset.selectedSize || selectedSize;
  }

  if (typeof addToCart === 'function') {
    addToCart(product, selectedColor, selectedSize, 1);
  }
}
window.showProductDetail = showProductDetail;

// 5. Filtrado por categoría
function filterByCategory(cat) {
  activeCategory = cat || 'all';
  renderProducts(activeCategory);

  // Actualización visual de pills activas
  const allPills = document.querySelectorAll('[data-category], .category-pills .pill');
  allPills.forEach(pill => {
    const pillCat = pill.dataset.category || pill.textContent.trim();
    const isAll = (activeCategory === 'all' || activeCategory === 'Todas' || activeCategory === 'Todos') &&
                  (pillCat === 'all' || pillCat === 'Todas' || pillCat === 'Todos');
    const isMatch = pillCat.toLowerCase() === activeCategory.toLowerCase();

    if (isAll || isMatch) {
      pill.classList.add('active');
      pill.classList.add('pill-active');
    } else {
      pill.classList.remove('active');
      pill.classList.remove('pill-active');
    }
  });
}

// Compatibilidad con llamadas onclick="filterCategory(...)"
window.filterCategory = filterByCategory;
window.filterByCategory = filterByCategory;

// 6. Inicialización de la tienda
function initStore() {
  injectStoreStyles();
  renderProducts('all');

  // Listeners para pills de categorías
  const categoryPills = document.querySelectorAll('[data-category], .category-pills .pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.category || pill.textContent.trim();
      filterByCategory(cat);
    });
  });

  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }
}

// 7. Evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', initStore);
