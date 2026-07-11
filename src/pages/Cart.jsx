import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './CartCheckout.css';

const estadoLabel = {
  preparacion: 'En preparación',
  despacho: 'En despacho',
  entrega: 'Entregado',
};

const regionesChile = [
  'Región de Arica y Parinacota',
  'Región de Tarapacá',
  'Región de Antofagasta',
  'Región de Atacama',
  'Región de Coquimbo',
  'Región de Valparaíso',
  'Región Metropolitana de Santiago',
  'Región del Libertador General Bernardo O’Higgins',
  'Región del Maule',
  'Región de Ñuble',
  'Región del Biobío',
  'Región de La Araucanía',
  'Región de Los Ríos',
  'Región de Los Lagos',
  'Región de Aysén del General Carlos Ibáñez del Campo',
  'Región de Magallanes y de la Antártica Chilena',
];

const comunasSugeridas = [
  'Cerrillos',
  'Cerro Navia',
  'Conchalí',
  'El Bosque',
  'Estación Central',
  'Huechuraba',
  'Independencia',
  'La Cisterna',
  'La Florida',
  'La Granja',
  'La Pintana',
  'La Reina',
  'Las Condes',
  'Lo Barnechea',
  'Lo Espejo',
  'Lo Prado',
  'Macul',
  'Maipú',
  'Ñuñoa',
  'Pedro Aguirre Cerda',
  'Peñalolén',
  'Providencia',
  'Pudahuel',
  'Quilicura',
  'Quinta Normal',
  'Recoleta',
  'Renca',
  'San Joaquín',
  'San Miguel',
  'San Ramón',
  'Santiago',
  'Vitacura',
];

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    resumen,
    pedidoActual,
    removeFromCart,
    updateCantidad,
    confirmarPedido,
    avanzarEstadoPedido,
    limpiarPedidoActual,
  } = useContext(CartContext);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Cerrillos',
    indicaciones: '',
  });

  const [errors, setErrors] = useState({});

  const total = useMemo(() => (resumen?.total ? resumen.total : 0), [resumen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) nuevosErrores.nombre = 'Ingresa tu nombre';
    if (!formData.apellidos.trim()) nuevosErrores.apellidos = 'Ingresa tus apellidos';

    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'Ingresa tu correo';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      nuevosErrores.correo = 'Correo inválido';
    }

    if (!formData.calle.trim()) nuevosErrores.calle = 'Ingresa tu calle';
    if (!formData.region.trim()) nuevosErrores.region = 'Selecciona una región';
    if (!formData.comuna.trim()) nuevosErrores.comuna = 'Selecciona una comuna';

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cart?.length) return;
    if (!validar()) return;

    const fechaDefault = new Date();
    fechaDefault.setDate(fechaDefault.getDate() + 1);

    const direccionCompleta = `${formData.calle}${formData.departamento ? `, Depto ${formData.departamento}` : ''}, ${formData.comuna}, ${formData.region}`;

    const resultado = confirmarPedido({
      fechaEntrega: fechaDefault.toISOString().split('T')[0],
      direccionEntrega: direccionCompleta,
      cliente: {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
      },
      notasEntrega: formData.indicaciones,
    });

    if (resultado?.ok) {
      navigate('/compra-resultado/exito');
    }
  };

  if (!cart.length) {
    return (
      <main className="cart-checkout-page">
        <div className="cart-checkout-card empty-cart-checkout">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos para completar tu pedido.</p>
        </div>
      </main>
    );
  }

  return (
<<<<<<< HEAD
    <div className="cart-container" style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h1>Tu Carrito</h1>

      {cart.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Tu carrito está vacío</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="cart-item"
              style={{
                borderBottom: '1px solid #ccc',
                padding: '10px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3>{item.nombre}</h3>
                {item.descuentoPct > 0 ? (
                  <>
                    <p style={{ margin: 0 }}>
                      <span style={{ textDecoration: 'line-through', color: '#777' }}>
                        ${item.precioOriginal.toLocaleString()} CLP
                      </span>{' '}
                      <span style={{ color: '#b12704', fontWeight: 700 }}>-{item.descuentoPct}%</span>
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 700 }}>
                      ${item.precio.toLocaleString()} CLP
                    </p>
                  </>
                ) : (
                  <p>${item.precio.toLocaleString()} CLP</p>
                )}
                <small>Subtotal: ${(item.precio * item.cantidad).toLocaleString()} CLP</small>
              </div>
              <div className="cart-controls">
                <button onClick={() => updateCantidad(item.id, -1)}>-</button>
                <span style={{ margin: '0 10px' }}>{item.cantidad}</span>
                <button onClick={() => updateCantidad(item.id, 1)}>+</button>
                <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '15px', color: 'red' }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <p>Productos: {resumen.cantidadTotal}</p>
            <p>Subtotal: ${resumen.subtotal.toLocaleString()} CLP</p>
            <p>Ahorro total: -${resumen.ahorroTotal.toLocaleString()} CLP</p>
            <p>Despacho: ${resumen.despacho.toLocaleString()} CLP</p>
            <h2>Total: ${resumen.total.toLocaleString()} CLP</h2>
            <button
              onClick={finalizarDirecto}
              style={{
                backgroundColor: '#8b4513',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Confirmar Pedido
            </button>
=======
    <main className="cart-checkout-page">
      <form className="cart-checkout-card" onSubmit={handleSubmit}>
        <header className="cart-checkout-header">
          <div>
            <h1>Carrito de compra</h1>
            <p>Completa la siguiente información</p>
>>>>>>> 2fa4808 (Modificar archivos)
          </div>
          <div className="cart-total-badge">
            <span>Total a pagar:</span>
            <strong>${total.toLocaleString()}</strong>
          </div>
        </header>

        <div className="cart-items-table-wrapper">
          <table className="cart-items-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
                  </td>
                  <td>{item.nombre}</td>
                  <td>${item.precio.toLocaleString()}</td>
                  <td>
                    <div className="qty-controls">
                      <button type="button" onClick={() => updateCantidad(item.id, -1)}>
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button type="button" onClick={() => updateCantidad(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                  <td>
                    <button type="button" className="btn-delete-inline" onClick={() => removeFromCart(item.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="checkout-section">
          <h2>Información del cliente</h2>
          <p>Completa la siguiente información</p>

          <div className="checkout-grid">
            <div className="checkout-field">
              <label htmlFor="nombre">Nombre*</label>
              <input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </div>

            <div className="checkout-field">
              <label htmlFor="apellidos">Apellidos*</label>
              <input id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} />
              {errors.apellidos && <span className="field-error">{errors.apellidos}</span>}
            </div>

            <div className="checkout-field full">
              <label htmlFor="correo">Correo*</label>
              <input id="correo" name="correo" type="email" value={formData.correo} onChange={handleChange} />
              {errors.correo && <span className="field-error">{errors.correo}</span>}
            </div>
          </div>
        </section>

        <section className="checkout-section">
          <h2>Dirección de entrega de los productos</h2>
          <p>Ingrese dirección de forma detallada</p>

          <div className="checkout-grid">
            <div className="checkout-field">
              <label htmlFor="calle">Calle*</label>
              <input id="calle" name="calle" value={formData.calle} onChange={handleChange} />
              {errors.calle && <span className="field-error">{errors.calle}</span>}
            </div>

            <div className="checkout-field">
              <label htmlFor="departamento">Departamento (opcional)</label>
              <input
                id="departamento"
                name="departamento"
                placeholder="Ej: 603"
                value={formData.departamento}
                onChange={handleChange}
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="region">Región*</label>
              <select id="region" name="region" value={formData.region} onChange={handleChange}>
                {regionesChile.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && <span className="field-error">{errors.region}</span>}
            </div>

            <div className="checkout-field">
              <label htmlFor="comuna">Comuna*</label>
              <select id="comuna" name="comuna" value={formData.comuna} onChange={handleChange}>
                {comunasSugeridas.map((comuna) => (
                  <option key={comuna} value={comuna}>
                    {comuna}
                  </option>
                ))}
              </select>
              {errors.comuna && <span className="field-error">{errors.comuna}</span>}
            </div>

            <div className="checkout-field full">
              <label htmlFor="indicaciones">Indicaciones para la entrega (opcional)</label>
              <textarea
                id="indicaciones"
                name="indicaciones"
                placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
                value={formData.indicaciones}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <footer className="checkout-footer" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="submit" className="btn-pay">
            Pagar ahora ${total.toLocaleString()}
          </button>
          <button type="button" className="btn-pay" onClick={() => navigate('/compra-resultado/error')}>
            Simular pago fallido
          </button>
        </footer>
      </form>

      {pedidoActual && (
        <section className="cart-checkout-card checkout-section" style={{ marginTop: '16px' }}>
          <h2>Seguimiento del pedido</h2>
          <p>
            <strong>ID Pedido:</strong> {pedidoActual.id}
          </p>
          <p>
            <strong>Estado:</strong> {estadoLabel[pedidoActual.estado] || pedidoActual.estado}
          </p>
          <p>
            <strong>Código de seguimiento:</strong> {pedidoActual.tracking.codigo}
          </p>
          <p>
            <strong>Fecha entrega preferida:</strong> {pedidoActual.boleta.fechaEntregaPreferida}
          </p>
          <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" className="btn-pay" onClick={avanzarEstadoPedido}>
              Actualizar estado
            </button>
            <button type="button" className="btn-pay" onClick={limpiarPedidoActual}>
              Limpiar seguimiento
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default Cart;
