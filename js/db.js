const DEMO_PRODUCTS = [
  {
    id: 'p1',
    name: 'Legging Sculpt Pro',
    category: 'Leggings',
    price: 45,
    cost: 18,
    description: 'Control total con tela de compresión 4-way stretch. Cintura alta que moldea y sostiene.',
    colors: [
      { name: 'Negro Obsidiana', hex: '#1C1410' },
      { name: 'Vino Intenso', hex: '#7A1E2E' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: {
      'Negro Obsidiana': { XS: 3, S: 5, M: 4, L: 2, XL: 1 },
      'Vino Intenso': { XS: 2, S: 3, M: 5, L: 3, XL: 0 }
    },
    active: true
  },
  {
    id: 'p2',
    name: 'Top Elevation',
    category: 'Tops',
    price: 28,
    cost: 11,
    description: 'Top deportivo con espalda abierta y soporte integrado. Perfecto para entrenamientos de alta intensidad.',
    colors: [
      { name: 'Crema Suave', hex: '#F5F0E8' },
      { name: 'Champagne', hex: '#C9A96E' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: {
      'Crema Suave': { XS: 4, S: 6, M: 3, L: 1, XL: 0 },
      'Champagne': { XS: 2, S: 4, M: 4, L: 2, XL: 1 }
    },
    active: true
  },
  {
    id: 'p3',
    name: 'Set Aura Completo',
    category: 'Sets',
    price: 68,
    cost: 27,
    description: 'Conjunto top + legging en tela sin costuras. Comodidad y estilo en un solo look.',
    colors: [
      { name: 'Negro Obsidiana', hex: '#1C1410' },
      { name: 'Marrón Cacao', hex: '#5C3825' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: {
      'Negro Obsidiana': { S: 3, M: 5, L: 4, XL: 2 },
      'Marrón Cacao': { S: 2, M: 3, L: 2, XL: 1 }
    },
    active: true
  },
  {
    id: 'p4',
    name: 'Bolso Mesh',
    category: 'Accesorios',
    price: 22,
    cost: 8,
    description: 'Bolso deportivo en malla transpirable. Ideal para llevar al gym con estilo.',
    colors: [
      { name: 'Negro Obsidiana', hex: '#1C1410' },
      { name: 'Champagne', hex: '#C9A96E' }
    ],
    sizes: ['ÚNICO'],
    stock: {
      'Negro Obsidiana': { ÚNICO: 8 },
      'Champagne': { ÚNICO: 5 }
    },
    active: true
  }
];

let products = JSON.parse(localStorage.getItem('aurafit_products')) || [...DEMO_PRODUCTS];
let cart = JSON.parse(localStorage.getItem('aurafit_cart')) || [];

function saveProducts() {
  localStorage.setItem('aurafit_products', JSON.stringify(products));
}

function saveCart() {
  localStorage.setItem('aurafit_cart', JSON.stringify(cart));
}

function getStock(product, color, size) {
  return product.stock?.[color]?.[size] ?? 0;
}

function getTotalStock(product, color) {
  return Object.values(product.stock?.[color] || {}).reduce((a, b) => a + b, 0);
}

function hasAnyStock(product) {
  return product.colors.some(c => getTotalStock(product, c.name) > 0);
}

function getOutOfStock() {
  return products.filter(p => p.active && !hasAnyStock(p));
}
