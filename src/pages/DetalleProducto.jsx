import React, { useState, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productos } from '../data/mockDatabase';
import { CartContext } from '../context/CartContext';
import './DetalleProducto.css';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const producto = productos.find(p => p.id === parseInt(id));
  const [mensaje, setMensaje] = useState('');
  const [tamano, setTamano] = useState('Pequeña (10p)');

  if (!producto) return <h2>Producto no encontrado</h2>;

  const origenPorCategoria = {
    "Tortas Cuadradas":
      "Nuestras tortas cuadradas nacen de la tradición pastelera de celebraciones familiares, adaptadas por estudiantes de gastronomía para mantener recetas clásicas con técnicas modernas.",
    "Tortas Circulares":
      "Inspiradas en la repostería tradicional chilena y europea, estas tortas circulares rescatan preparaciones artesanales transmitidas por generaciones.",
    "Postres Individuales":
      "Estos postres individuales combinan recetas internacionales clásicas con ingredientes locales seleccionados para lograr sabor y textura premium.",
    "Productos Sin Azúcar":
      "Desarrollados en talleres de nutrición y repostería saludable, mantienen el sabor tradicional con alternativas de endulzado responsable.",
    "Pastelería Tradicional":
      "Recetas patrimoniales que reflejan la historia de la pastelería casera, reinterpretadas por alumnos para conservar su esencia original.",
    "Productos Sin Gluten":
      "Elaboraciones creadas para inclusión alimentaria, con formulaciones probadas por estudiantes para asegurar textura, sabor y seguridad.",
    "Productos Vegana":
      "Recetas plant-based diseñadas en prácticas académicas, demostrando que es posible una pastelería deliciosa sin ingredientes de origen animal.",
    "Tortas Especiales":
      "Creaciones de autor para momentos importantes, inspiradas en técnicas de pastelería artística enseñadas en formación profesional."
  };

  const productosRecomendados = useMemo(() => {
    let historialIds = [];

    try {
      const cartRaw = localStorage.getItem('cart');
      const pedidosRaw = localStorage.getItem('pedidoActual');

      const cartParsed = cartRaw ? JSON.parse(cartRaw) : [];
      const pedidoParsed = pedidosRaw ? JSON.parse(pedidosRaw) : null;

      const idsCart = Array.isArray(cartParsed) ? cartParsed.map((p) => p.id) : [];
      const idsPedido = pedidoParsed?.items ? pedidoParsed.items.map((i) => i.id) : [];

      historialIds = [...idsCart, ...idsPedido].filter(Boolean);
    } catch (e) {
      historialIds = [];
    }

    const base = productos.filter((p) => p.id !== producto.id);

    const porCategoria = base.filter((p) => p.categoria === producto.categoria);
    const porHistorial = base.filter((p) => historialIds.includes(p.id));

    const combinados = [...porHistorial, ...porCategoria, ...base];
    const unicos = [];
    const vistos = new Set();

    for (const item of combinados) {
      if (!vistos.has(item.id)) {
        vistos.add(item.id);
        unicos.push(item);
      }
      if (unicos.length === 3) break;
    }

    return unicos;
  }, [producto]);

  const handleAgregarAlCarrito = () => {
    const precioBase = producto.precio;
    const descuentoPct = producto.oferta ? 20 : 0;
    const precioFinal = descuentoPct > 0 ? Math.round(precioBase * (1 - descuentoPct / 100)) : precioBase;

    addToCart({
      ...producto,
      tamano,
      mensajeEspecial: mensaje.trim(),
      precioOriginal: precioBase,
      descuentoPct,
      precio: precioFinal,
    });

    setMensaje('');
  };

  return (
    <div className="detalle-producto-container">
      {/* Botón para volver al catálogo */}
      <button className="btn-volver" onClick={() => navigate('/catalogo')}>
        ← Volver al Catálogo
      </button>

      <img src={producto.imagen} alt={producto.nombre} className="img-detalle" />
      
      <div className="detalle-info">
        <h1>{producto.nombre}</h1>
        <p><strong>Categoría:</strong> {producto.categoria}</p>

        <div className="detalle-descripcion">
          <h3>Descripción</h3>
          <p>{producto.descripcion}</p>
        </div>

        <div className="info-extra-card">
          <h3>Origen de la receta</h3>
          <p>{origenPorCategoria[producto.categoria] || "Producto elaborado con recetas artesanales cuidadosamente desarrolladas en nuestra escuela de gastronomía."}</p>
        </div>

        <div className="info-extra-card">
          <h3>Recomendaciones personalizadas</h3>
          <p>Basado en tus preferencias, también podría interesarte:</p>
          <ul className="recomendaciones-lista">
            {productosRecomendados.map((rec) => (
              <li key={rec.id}>
                <span>{rec.nombre}</span>
                <button type="button" onClick={() => navigate(`/producto/${rec.id}`)}>
                  Ver
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="info-extra-card impacto">
          <h3>Impacto comunitario</h3>
          <p>
            Cada compra apoya directamente la formación práctica de estudiantes de gastronomía
            y fortalece la economía local mediante proveedores y producción de cercanía.
          </p>
        </div>

        <select className="selector-tamano" value={tamano} onChange={(e) => setTamano(e.target.value)}>
          <option>Pequeña (10p)</option>
          <option>Mediana (20p)</option>
          <option>Grande (30p)</option>
        </select>

        <input 
          type="text" 
          placeholder="Mensaje especial..." 
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="input-mensaje"
        />

        <h2>${producto.precio.toLocaleString('es-CL')} CLP</h2>

        {/* Iconos de Redes Sociales */}
        <div className="redes-sociales">
          <a href="https://wa.me/" target="_blank" rel="noreferrer">
            <img src="/wp.png" alt="WhatsApp" className="icono-social" />
          </a>
          <a href="https://facebook.com/" target="_blank" rel="noreferrer">
            <img src="/fb.png" alt="Facebook" className="icono-social" />
          </a>
        </div>

        <button className="btn-agregar" onClick={handleAgregarAlCarrito}>
          🛒 Añadir al Carrito
        </button>
      </div>
    </div>
  );
};

export default DetalleProducto;