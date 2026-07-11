import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './CartCheckout.css';

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

const defaultForm = {
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  departamento: '',
  region: 'Región Metropolitana de Santiago',
  comuna: 'Cerrillos',
  indicaciones: '',
  fechaEntregaPreferida: '',
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, resumen, confirmarPedido, checkoutDraft, guardarCheckoutDraft } = useContext(CartContext);
  const { currentUser, isAdmin } = useContext(AuthContext);

  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const total = useMemo(() => (resumen?.total ? resumen.total : 0), [resumen]);

  useEffect(() => {
    if (checkoutDraft) {
      setFormData((prev) => ({ ...prev, ...checkoutDraft }));
    }
  }, [checkoutDraft]);

  useEffect(() => {
    if (!currentUser || isAdmin) return;

    setFormData((prev) => ({
      ...prev,
      nombre: prev.nombre || currentUser.nombre || '',
      apellidos: prev.apellidos || currentUser.apellidos || '',
      correo: prev.correo || currentUser.correo || currentUser.email || '',
    }));
  }, [currentUser, isAdmin]);

  useEffect(() => {
    guardarCheckoutDraft(formData);
  }, [formData, guardarCheckoutDraft]);

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

  const confirmarPago = () => {
    const fechaEntrega = formData.fechaEntregaPreferida || new Date().toISOString().split('T')[0];
    const direccionCompleta = `${formData.calle}${formData.departamento ? `, Depto ${formData.departamento}` : ''}, ${formData.comuna}, ${formData.region}`;

    const resultado = confirmarPedido({
      fechaEntrega,
      direccionEntrega: direccionCompleta,
      cliente: {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
      },
      direccionDetalle: {
        calle: formData.calle,
        departamento: formData.departamento,
        region: formData.region,
        comuna: formData.comuna,
        indicaciones: formData.indicaciones,
      },
      notasEntrega: formData.indicaciones,
      limpiarCarrito: true,
    });

    if (resultado?.ok) {
      setShowConfirmModal(false);
      navigate('/compra-resultado/exito');
      return;
    }

    navigate('/compra-resultado/error');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cart?.length) return;
    if (!validar()) return;
    setShowConfirmModal(true);
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
    <main className="cart-checkout-page">
      <form className="cart-compact-layout" onSubmit={handleSubmit}>
        <section className="cart-products-panel">
          <header className="panel-header">
            <h2>Detalle de productos</h2>
            <p>Resumen de artículos incluidos en tu compra.</p>
          </header>

          <div className="cart-items-table-wrapper">
            <table className="cart-items-table compact">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img src={item.imagen || '/favicon.svg'} alt={item.nombre} className="cart-item-image" />
                    </td>
                    <td>{item.nombre}</td>
                    <td>$ {item.precio.toLocaleString()}</td>
                    <td>{item.cantidad}</td>
                    <td>$ {(item.precio * item.cantidad).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="summary-total-row">
            <span>Total</span>
            <strong>$ {total.toLocaleString()}</strong>
          </div>
        </section>

        <section className="cart-summary-panel">
          <header className="panel-header">
            <h2>Información del cliente</h2>
          </header>

          <section className="checkout-section compact">
            <h3>Datos para finalizar compra</h3>
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

              <h3 className="full">Dirección de entrega</h3>

              <div className="checkout-field">
                <label htmlFor="calle">Calle*</label>
                <input id="calle" name="calle" value={formData.calle} onChange={handleChange} />
                {errors.calle && <span className="field-error">{errors.calle}</span>}
              </div>

              <div className="checkout-field">
                <label htmlFor="departamento">Número de departamento</label>
                <input id="departamento" name="departamento" value={formData.departamento} onChange={handleChange} />
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
                <label htmlFor="indicaciones">Indicaciones especiales</label>
                <textarea id="indicaciones" name="indicaciones" value={formData.indicaciones} onChange={handleChange} rows={3} />
              </div>
            </div>
          </section>

          <footer className="checkout-footer compact-actions">
            <button type="button" className="btn-clear" onClick={() => navigate('/cart')}>
              Volver al carrito
            </button>
            <button type="submit" className="btn-pay">
              Finalizar pedido
            </button>
          </footer>
        </section>
      </form>

      {showConfirmModal && (
        <div className="checkout-modal-overlay" role="dialog" aria-modal="true">
          <div className="checkout-modal">
            <h3>Confirmar datos del cliente</h3>
            <p>Revisa la información antes de finalizar el pedido.</p>

            <div className="checkout-modal-grid">
              <div>
                <span>Nombre</span>
                <strong>{formData.nombre || '-'}</strong>
              </div>
              <div>
                <span>Apellidos</span>
                <strong>{formData.apellidos || '-'}</strong>
              </div>
              <div className="full">
                <span>Correo</span>
                <strong>{formData.correo || '-'}</strong>
              </div>
              <div className="full">
                <span>Dirección</span>
                <strong>
                  {formData.calle || '-'}
                  {formData.departamento ? `, Depto ${formData.departamento}` : ''}
                  {formData.comuna ? `, ${formData.comuna}` : ''}
                  {formData.region ? `, ${formData.region}` : ''}
                </strong>
              </div>
            </div>

            <div className="checkout-modal-actions">
              <button type="button" className="btn-modal-secondary" onClick={() => setShowConfirmModal(false)}>
                Editar
              </button>
              <button type="button" className="btn-modal-primary" onClick={confirmarPago}>
                Confirmar pago
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;
