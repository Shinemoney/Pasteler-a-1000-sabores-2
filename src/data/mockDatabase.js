// src/data/mockDatabase.js
export const productos = [
  {
    id: 1,
    codigo: "TC001",
    nombre: "Torta Cuadrada de Chocolate",
    categoria: "Tortas Cuadradas",
    precio: 45000,
    descripcion:
      "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.",
    imagen: "/1image.jpeg",
    oferta: true
  },
  {
    id: 2,
    codigo: "TC002",
    nombre: "Torta Cuadrada de Frutas",
    categoria: "Tortas Cuadradas",
    precio: 50000,
    descripcion:
      "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.",
    imagen: "/2image.jpeg"
  },
  {
    id: 3,
    codigo: "TT001",
    nombre: "Torta Circular de Vainilla",
    categoria: "Tortas Circulares",
    precio: 40000,
    descripcion:
      "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.",
    imagen: "/3image.jpeg"
  },
  {
    id: 4,
    codigo: "TT002",
    nombre: "Torta Circular de Manjar",
    categoria: "Tortas Circulares",
    precio: 42000,
    descripcion:
      "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.",
    imagen: "/4image.jpeg"
  },
  {
    id: 5,
    codigo: "PI001",
    nombre: "Mousse de Chocolate",
    categoria: "Postres Individuales",
    precio: 5000,
    descripcion:
      "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.",
    imagen: "/5image.jpeg"
  },
  {
    id: 6,
    codigo: "PI002",
    nombre: "Tiramisú Clásico",
    categoria: "Postres Individuales",
    precio: 5500,
    descripcion:
      "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.",
    imagen: "/6image.jpeg",
    oferta: true
  },
  {
    id: 7,
    codigo: "PSA001",
    nombre: "Torta Sin Azúcar de Naranja",
    categoria: "Productos Sin Azúcar",
    precio: 48000,
    descripcion:
      "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.",
    imagen: "/7image.jpeg"
  },
  {
    id: 8,
    codigo: "PSA002",
    nombre: "Cheesecake Sin Azúcar",
    categoria: "Productos Sin Azúcar",
    precio: 47000,
    descripcion:
      "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.",
    imagen: "/8image.jpeg"
  },
  {
    id: 9,
    codigo: "PT001",
    nombre: "Empanada de Manzana",
    categoria: "Pastelería Tradicional",
    precio: 3000,
    descripcion:
      "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.",
    imagen: "/9image.jpeg"
  },
  {
    id: 10,
    codigo: "PT002",
    nombre: "Tarta de Santiago",
    categoria: "Pastelería Tradicional",
    precio: 6000,
    descripcion:
      "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.",
    imagen: "/10image.jpeg"
  },
  {
    id: 11,
    codigo: "PG001",
    nombre: "Brownie Sin Gluten",
    categoria: "Productos Sin Gluten",
    precio: 4000,
    descripcion:
      "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.",
    imagen: "/11image.jpeg"
  },
  {
    id: 12,
    codigo: "PG002",
    nombre: "Pan Sin Gluten",
    categoria: "Productos Sin Gluten",
    precio: 3500,
    descripcion:
      "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.",
    imagen: "/12image.jpeg"
  },
  {
    id: 13,
    codigo: "PV001",
    nombre: "Torta Vegana de Chocolate",
    categoria: "Productos Vegana",
    precio: 50000,
    descripcion:
      "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.",
    imagen: "/13image.jpeg",
    oferta: true
  },
  {
    id: 14,
    codigo: "PV002",
    nombre: "Galletas Veganas de Avena",
    categoria: "Productos Vegana",
    precio: 4500,
    descripcion:
      "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.",
    imagen: "/14image.jpeg"
  },
  {
    id: 15,
    codigo: "TE001",
    nombre: "Torta Especial de Cumpleaños",
    categoria: "Tortas Especiales",
    precio: 55000,
    descripcion:
      "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.",
    imagen: "/15image.jpeg"
  },
  {
    id: 16,
    codigo: "TE002",
    nombre: "Torta Especial de Boda",
    categoria: "Tortas Especiales",
    precio: 60000,
    descripcion:
      "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.",
    imagen: "/16image.jpeg"
  }
];

export const eliminarProducto = (id) => {
  console.log("Eliminando producto con ID:", id);
};
