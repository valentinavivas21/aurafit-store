// AURA FIT - Inventario real (conteo físico INV 22/2026). Generado automáticamente.
// Formato admin: stock[color][talla]. Todos los productos llevan needsReview:true hasta verificarlos uno por uno.
const INVENTORY_SEED_VERSION = '2026-10-24-v1';
const INVENTORY_SEED = [
 {
  "id": "inv-baggys",
  "name": "Baggys",
  "category": "Leggings",
  "price": 12,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Azul Marino",
    "hex": "#1B2A4A"
   },
   {
    "name": "Rojo",
    "hex": "#C0392B"
   },
   {
    "name": "Vinotinto",
    "hex": "#6B1426"
   },
   {
    "name": "Azul",
    "hex": "#2E6FD8"
   },
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "S",
   "L",
   "S-XL",
   "M",
   "M-L",
   "U-S-M"
  ],
  "stock": {
   "Azul Marino": {
    "S": 1
   },
   "Rojo": {
    "L": 2
   },
   "Vinotinto": {
    "S-XL": 2
   },
   "Azul": {
    "M": 1
   },
   "Blanco": {
    "M-L": 1
   },
   "Negro": {
    "U-S-M": 2
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "baggys"
 },
 {
  "id": "inv-biker-cruzado-ullu",
  "name": "Biker Cruzado Ullu",
  "category": "Leggings",
  "price": 8,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Morado",
    "hex": "#7B3FA0"
   },
   {
    "name": "Verde",
    "hex": "#3E9B5A"
   }
  ],
  "sizes": [
   "L/XL"
  ],
  "stock": {
   "Morado": {
    "L/XL": 1
   },
   "Verde": {
    "L/XL": 1
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "biker-cruzado"
 },
 {
  "id": "inv-biker-cruzado-ullu-con-ralla",
  "name": "Biker Cruzado Ullu Con Ralla",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "L/XL",
   "S/M-L/XL"
  ],
  "stock": {
   "Gris": {
    "L/XL": 3
   },
   "Negro": {
    "S/M-L/XL": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-bikers",
  "name": "Bikers",
  "category": "Leggings",
  "price": 7,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Amarillo",
    "hex": "#F2C94C"
   },
   {
    "name": "Azul Electrico",
    "hex": "#0057FF"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Amarillo": {
    "U": 1
   },
   "Azul Electrico": {
    "U": 1
   },
   "Negro": {
    "U": 2
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "bikers"
 },
 {
  "id": "inv-bikers-by-color",
  "name": "Bikers By Color",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "By Color",
    "hex": "#C9A96E"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "By Color": {
    "U": 3
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-bikers-v",
  "name": "Bikers V",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   },
   {
    "name": "Morado",
    "hex": "#7B3FA0"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Gris": {
    "U": 1
   },
   "Morado": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-bolso-running",
  "name": "Bolso Running",
  "category": "Accesorios",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Negro": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-bolsos",
  "name": "Bolsos",
  "category": "Accesorios",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "By Color",
    "hex": "#C9A96E"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "By Color": {
    "U": 10
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-colas",
  "name": "Colas",
  "category": "Accesorios",
  "price": 0.7,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "By Color",
    "hex": "#C9A96E"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "By Color": {
    "U": 20
   },
   "Negro": {
    "U": 20
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "colas"
 },
 {
  "id": "inv-colas-de-seda",
  "name": "Colas De Seda",
  "category": "Accesorios",
  "price": 1.2,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "By Color",
    "hex": "#C9A96E"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "By Color": {
    "U": 5
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "colas-seda"
 },
 {
  "id": "inv-conjunto-floyd-biker",
  "name": "Conjunto Floyd Biker",
  "category": "Sets",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   },
   {
    "name": "Marron",
    "hex": "#6B4226"
   }
  ],
  "sizes": [
   "L/XL"
  ],
  "stock": {
   "Gris": {
    "L/XL": 1
   },
   "Marron": {
    "L/XL": 0
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-conjunto-floyd-cierre",
  "name": "Conjunto Floyd Cierre",
  "category": "Sets",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   },
   {
    "name": "Rosado",
    "hex": "#F4A6B8"
   }
  ],
  "sizes": [
   "L/XL",
   "S/M"
  ],
  "stock": {
   "Gris": {
    "L/XL": 1
   },
   "Negro": {
    "S/M": 1
   },
   "Rosado": {
    "L/XL": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-conjunto-jacket-licra-ancha",
  "name": "Conjunto Jacket Licra Ancha",
  "category": "Sets",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Vinotinto",
    "hex": "#6B1426"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Vinotinto": {
    "U": 1
   },
   "Negro": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-conjunto-shein",
  "name": "Conjunto Shein",
  "category": "Sets",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Negro": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-enterizo-corto",
  "name": "Enterizo Corto",
  "category": "Sets",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Azul Marino",
    "hex": "#1B2A4A"
   },
   {
    "name": "Marron",
    "hex": "#6B4226"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "M/L",
   "S/M"
  ],
  "stock": {
   "Azul Marino": {
    "M/L": 1
   },
   "Marron": {
    "S/M": 1
   },
   "Negro": {
    "M/L": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-enterizo-cruzado",
  "name": "Enterizo Cruzado",
  "category": "Sets",
  "price": 20,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Azul Marino",
    "hex": "#1B2A4A"
   },
   {
    "name": "Rojo",
    "hex": "#C0392B"
   },
   {
    "name": "Rosado",
    "hex": "#F4A6B8"
   }
  ],
  "sizes": [
   "S",
   "M"
  ],
  "stock": {
   "Azul Marino": {
    "S": 1
   },
   "Rojo": {
    "S": 1
   },
   "Rosado": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "enterizo"
 },
 {
  "id": "inv-falda-short-kirios",
  "name": "Falda Short Kirios",
  "category": "Leggings",
  "price": 10,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Verde",
    "hex": "#3E9B5A"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Verde": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "falda-short"
 },
 {
  "id": "inv-franela-adidas-p",
  "name": "Franela Adidas P",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "XL",
   "M"
  ],
  "stock": {
   "Blanco": {
    "XL": 1
   },
   "Negro": {
    "M": 0
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-franela-de-compresion-spiderman",
  "name": "Franela De Compresion Spiderman",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Negro",
    "hex": "#1C1410"
   },
   {
    "name": "Rojo",
    "hex": "#C0392B"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Negro": {
    "U": 2
   },
   "Rojo": {
    "U": 0
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-franela-de-compresion-underarmund",
  "name": "Franela De Compresion Underarmund",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Blanco": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-franela-nike-p",
  "name": "Franela Nike P",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "XL",
   "M"
  ],
  "stock": {
   "Blanco": {
    "XL": 1
   },
   "Negro": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-franela-terry",
  "name": "Franela Terry",
  "category": "Tops",
  "price": 6,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Fucsia",
    "hex": "#D81B8C"
   },
   {
    "name": "Rosado",
    "hex": "#F4A6B8"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Fucsia": {
    "U": 1
   },
   "Rosado": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "franela-terry"
 },
 {
  "id": "inv-franelas-deportivas-cuello-abierto",
  "name": "Franelas Deportivas Cuello Abierto",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Blanco": {
    "U": 2
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-guardacamisa-manga-gruesa",
  "name": "Guardacamisa Manga Gruesa",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Gris": {
    "M": 1
   },
   "Negro": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-guardacamisa-tirantes-caballero",
  "name": "Guardacamisa Tirantes Caballero",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Blanco": {
    "M": 1
   },
   "Negro": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-jackets",
  "name": "Jackets",
  "category": "Tops",
  "price": 15,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Negro",
    "hex": "#1C1410"
   },
   {
    "name": "Rosado Viejo",
    "hex": "#C99AA2"
   }
  ],
  "sizes": [
   "M",
   "L",
   "XL"
  ],
  "stock": {
   "Negro": {
    "M": 1,
    "L": 1,
    "XL": 1
   },
   "Rosado Viejo": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "jacket"
 },
 {
  "id": "inv-joggets-gymshark",
  "name": "Joggets Gymshark",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Gris": {
    "U": 2
   },
   "Negro": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-juego-de-ligas-5-niveles",
  "name": "Juego De Ligas 5 Niveles",
  "category": "Accesorios",
  "price": 12,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Azul",
    "hex": "#2E6FD8"
   },
   {
    "name": "Rosado",
    "hex": "#F4A6B8"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Azul": {
    "U": 1
   },
   "Rosado": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "bandas-resistencia"
 },
 {
  "id": "inv-lentes-running",
  "name": "Lentes Running",
  "category": "Accesorios",
  "price": 10,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "By Color",
    "hex": "#C9A96E"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "By Color": {
    "U": 2
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "lentes"
 },
 {
  "id": "inv-licra",
  "name": "Licra",
  "category": "Leggings",
  "price": 8,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Azul Electrico",
    "hex": "#0057FF"
   },
   {
    "name": "Beige",
    "hex": "#D8C3A5"
   },
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   },
   {
    "name": "Fucsia",
    "hex": "#D81B8C"
   },
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   },
   {
    "name": "Marron",
    "hex": "#6B4226"
   },
   {
    "name": "By Color",
    "hex": "#C9A96E"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Azul Electrico": {
    "U": 1
   },
   "Beige": {
    "U": 1
   },
   "Blanco": {
    "U": 1
   },
   "Fucsia": {
    "U": 1
   },
   "Gris": {
    "U": 1
   },
   "Marron": {
    "U": 1
   },
   "By Color": {
    "U": 4
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "licra-unicolor"
 },
 {
  "id": "inv-licra-alo",
  "name": "Licra Alo",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   },
   {
    "name": "Rosado",
    "hex": "#F4A6B8"
   }
  ],
  "sizes": [
   "L"
  ],
  "stock": {
   "Gris": {
    "L": 1
   },
   "Rosado": {
    "L": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-licra-ancha-shein",
  "name": "Licra Ancha Shein",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   }
  ],
  "sizes": [
   "S"
  ],
  "stock": {
   "Gris": {
    "S": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-licra-strech",
  "name": "Licra Strech",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   }
  ],
  "sizes": [
   "S"
  ],
  "stock": {
   "Gris": {
    "S": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-medias-alo",
  "name": "Medias Alo",
  "category": "Accesorios",
  "price": 3,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "By Color",
    "hex": "#C9A96E"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "By Color": {
    "U": 9
   }
  },
  "active": true,
  "needsReview": true,
  "storeId": "medias"
 },
 {
  "id": "inv-oversize",
  "name": "Oversize",
  "category": "Tops",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Beige",
    "hex": "#D8C3A5"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Beige": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-short-adidas",
  "name": "Short Adidas",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Azul Marino",
    "hex": "#1B2A4A"
   },
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Azul Marino": {
    "M": 1
   },
   "Blanco": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-short-adidas-playero",
  "name": "Short Adidas Playero",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   }
  ],
  "sizes": [
   "S"
  ],
  "stock": {
   "Gris": {
    "S": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-short-liga",
  "name": "Short Liga",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Vinotinto",
    "hex": "#6B1426"
   }
  ],
  "sizes": [
   "L"
  ],
  "stock": {
   "Vinotinto": {
    "L": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-short-performance",
  "name": "Short Performance",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Azul Marino",
    "hex": "#1B2A4A"
   },
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Azul Marino": {
    "M": 1
   },
   "Gris": {
    "M": 1
   },
   "Negro": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-short-running-con-tira",
  "name": "Short Running Con Tira",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Beige",
    "hex": "#D8C3A5"
   },
   {
    "name": "Fucsia",
    "hex": "#D81B8C"
   },
   {
    "name": "Verde Agua",
    "hex": "#7FD1C0"
   }
  ],
  "sizes": [
   "S"
  ],
  "stock": {
   "Beige": {
    "S": 1
   },
   "Fucsia": {
    "S": 1
   },
   "Verde Agua": {
    "S": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-short-uderarmour",
  "name": "Short Uderarmour",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Verde Militar",
    "hex": "#4B5320"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Verde Militar": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-shrot-running-alo",
  "name": "Shrot Running Alo",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Azul Bebe",
    "hex": "#A9D0F5"
   },
   {
    "name": "Beige",
    "hex": "#D8C3A5"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   },
   {
    "name": "Vinotinto",
    "hex": "#6B1426"
   }
  ],
  "sizes": [
   "L",
   "S"
  ],
  "stock": {
   "Azul Bebe": {
    "L": 1
   },
   "Beige": {
    "L": 1
   },
   "Negro": {
    "S": 1
   },
   "Vinotinto": {
    "S": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-shrot-running-bolsillo-cierre",
  "name": "Shrot Running Bolsillo Cierre",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Negro": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-shrot-running-mallita",
  "name": "Shrot Running Mallita",
  "category": "Leggings",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Negro",
    "hex": "#1C1410"
   },
   {
    "name": "Verde",
    "hex": "#3E9B5A"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Negro": {
    "M": 1
   },
   "Verde": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-sudadera-nke-p",
  "name": "Sudadera Nke P",
  "category": "Sudaderas",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Blanco": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-sudadera-ny-p",
  "name": "Sudadera Ny P",
  "category": "Sudaderas",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   }
  ],
  "sizes": [
   "L"
  ],
  "stock": {
   "Blanco": {
    "L": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-sudadera-shein",
  "name": "Sudadera Shein",
  "category": "Sudaderas",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   }
  ],
  "sizes": [
   "S"
  ],
  "stock": {
   "Blanco": {
    "S": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-susadera-adidas",
  "name": "Susadera Adidas",
  "category": "Sudaderas",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Azul Marino",
    "hex": "#1B2A4A"
   },
   {
    "name": "Gris",
    "hex": "#9A9A9A"
   }
  ],
  "sizes": [
   "L",
   "M"
  ],
  "stock": {
   "Azul Marino": {
    "L": 1
   },
   "Gris": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-top-de-malla",
  "name": "Top De Malla",
  "category": "Tops",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Blanco": {
    "U": 1
   },
   "Negro": {
    "U": 2
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-top-de-una-manga",
  "name": "Top De Una Manga",
  "category": "Tops",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Amarillo",
    "hex": "#F2C94C"
   },
   {
    "name": "Azul Electrico",
    "hex": "#0057FF"
   },
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Amarillo": {
    "U": 1
   },
   "Azul Electrico": {
    "U": 1
   },
   "Blanco": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-top-gymshark",
  "name": "Top Gymshark",
  "category": "Tops",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Negro",
    "hex": "#1C1410"
   },
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   }
  ],
  "sizes": [
   "U"
  ],
  "stock": {
   "Negro": {
    "U": 2
   },
   "Blanco": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-top-nike",
  "name": "Top Nike",
  "category": "Tops",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Blanco": {
    "M": 1
   },
   "Negro": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-top-sin-mangas",
  "name": "Top Sin Mangas",
  "category": "Tops",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Beige",
    "hex": "#D8C3A5"
   },
   {
    "name": "Marron",
    "hex": "#6B4226"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Beige": {
    "M": 1
   },
   "Marron": {
    "M": 1
   },
   "Negro": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-top-sosten",
  "name": "Top Sosten",
  "category": "Tops",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Borbogna",
    "hex": "#5A0F24"
   },
   {
    "name": "Rojo",
    "hex": "#C0392B"
   }
  ],
  "sizes": [
   "S"
  ],
  "stock": {
   "Borbogna": {
    "S": 1
   },
   "Rojo": {
    "S": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-top-tirantes",
  "name": "Top Tirantes",
  "category": "Tops",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   }
  ],
  "sizes": [
   "S-M"
  ],
  "stock": {
   "Blanco": {
    "S-M": 2
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-track-pants-adidas",
  "name": "Track Pants Adidas",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Negro",
    "hex": "#1C1410"
   }
  ],
  "sizes": [
   "M"
  ],
  "stock": {
   "Negro": {
    "M": 1
   }
  },
  "active": true,
  "needsReview": true
 },
 {
  "id": "inv-track-pants-nike",
  "name": "Track Pants Nike",
  "category": "Caballero",
  "price": 0,
  "cost": 0,
  "description": "",
  "colors": [
   {
    "name": "Azul Marino",
    "hex": "#1B2A4A"
   },
   {
    "name": "Blanco",
    "hex": "#FFFFFF"
   },
   {
    "name": "Negro",
    "hex": "#1C1410"
   },
   {
    "name": "Rojo",
    "hex": "#C0392B"
   }
  ],
  "sizes": [
   "U",
   "M"
  ],
  "stock": {
   "Azul Marino": {
    "U": 1
   },
   "Blanco": {
    "U": 1
   },
   "Negro": {
    "M": 1
   },
   "Rojo": {
    "U": 1
   }
  },
  "active": true,
  "needsReview": true
 }
];

// Carga el inventario real una sola vez por versión (no pisa ventas/ingresos, solo reemplaza el catálogo del admin).
function applyInventorySeed() {
  if (localStorage.getItem('aurafit_seed_version') === INVENTORY_SEED_VERSION) return;
  products = JSON.parse(JSON.stringify(INVENTORY_SEED));
  saveProducts();
  localStorage.setItem('aurafit_seed_version', INVENTORY_SEED_VERSION);
}
