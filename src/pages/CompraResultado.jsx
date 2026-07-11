import React, { useContext, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './CompraResultado.css';

const CompraResultado = () => {
  const { estado } = useParams();
  const navigate = useNavigate();
  const { pedidoActual } = useContext(CartContext);

  const esExito = estado === 'exito';
  const esError = estado === 'error';

  const fallbackItems = [
    { id: 'f1', nombre: 'Fortnite', precioUnitario: 0, cantidad: 1, subtotal: 0, imagen: '' },
    { id: 'f2', nombre: 'Minecraft', precioUnitario: 2695, cantidad: 4, subtotal: 10780, imagen: '' },
    { id: 'f3', nombre: 'Red Dead Redemption 2', precioUnitario: 5999, cantidad: 1, subtotal: 5999, imagen: '' },
    { id: 'f4', nombre: 'Among Us', precioUnitario: 499, cantidad: 1, subtotal: 499, imagen: '' },
    { id: 'f5', nombre: 'The Witcher 3', precioUnitario: 3999, cantidad: 1, subtotal: 3999, imagen: '' },
    { id: 'f6', nombre: 'Hollow Knight', precioUnitario: 1499, cantidad: 1, subtotal: 1499, imagen: '' },
    { id: 'f7', nombre: 'Animal Crossing', precioUnitario: 5999, cantidad: 1, subtotal: 5999, imagen: '' },
  ];

  const viewData = useMemo(() => {
    const boleta = pedidoActual?.boleta;
    const items = boleta?.items || fallbackItems;
    const subtotal = boleta?.subtotal ?? fallbackItems.reduce((acc, i) => acc + i.subtotal, 0);
    const despacho = boleta?.despacho ?? 0;
    const total = boleta?.total ?? subtotal + despacho;

    return {
      orderNumber: pedidoActual?.id?.replace('PED-', '') || '2024705',
      orderCode: pedidoActual?.id || 'ORDER12345',
      cliente: {
        nombre: 'pedro',
        apellidos: 'hacker',
        correo: 'pedro.hazer20@example.com',
      },
      direccion: {
        calle: boleta?.direccionEntrega?.split(',')?.[0]?.trim() || 'Los crisantemos, Edificio Norte',
        departamento: 'Depto 603',
        region: 'Región Metropolitana de Santiago',
        comuna: 'Cerrillos',
        indicaciones: 'El martes estaremos en el depto, pero puede dejarlo con el conserje.',
      },
      items,
      total,
    };
  }, [pedidoActual]);

  if (!esExito && !esError) {
    navigate('/cart');
    return null;
  }

  return (
    <main className="compra-resultado-page">
      <section className="compra-resultado-card">
        <div className="compra-resultado-top">
          <div>
            <h1 className="compra-estado-title">
              <span className={`compra-estado-icon ${esExito ? 'exito' : 'error'}`}>{esExito ? '✅' : '❌'}</span>
              {esExito ? `Se ha realizado la compra. nro #${viewData.orderNumber}` : `No se pudo realizar el pago. nro #${viewData.orderNumber}`}
            </h1>
            <p className="compra-subtitle">{esExito ? 'Completa la siguiente información' : 'Detalle de compra'}</p>
          </div>

          {esExito && <div className="compra-order-code">Código orden: {viewData.orderCode}</div>}
        </div>

        {esError && (
          <div className="compra-retry-wrap">
            <Link to="/cart" className="btn-retry">
              VOLVER A REALIZAR EL PAGO
            </Link>
          </div>
        )}

        <div className="compra-form-grid">
          <div className="compra-field">
            <label>Nombre*</label>
            <div className="compra-readonly">{viewData.cliente.nombre}</div>
          </div>
          <div className="compra-field">
            <label>Apellidos*</label>
            <div className="compra-readonly">{viewData.cliente.apellidos}</div>
          </div>
          <div className="compra-field">
            <label>Correo*</label>
            <div className="compra-readonly">{viewData.cliente.correo}</div>
          </div>

          <h2 className="compra-section-title">Dirección de entrega de los productos</h2>

          <div className="compra-field">
            <label>Calle*</label>
            <div className="compra-readonly">{viewData.direccion.calle}</div>
          </div>
          <div className="compra-field">
            <label>Departamento (opcional)</label>
            <div className="compra-readonly">{viewData.direccion.departamento}</div>
          </div>
          <div className="compra-field">
            <label>Región*</label>
            <div className="compra-readonly">{viewData.direccion.region}</div>
          </div>
          <div className="compra-field">
            <label>Comuna*</label>
            <div className="compra-readonly">{viewData.direccion.comuna}</div>
          </div>
          <div className="compra-field full">
            <label>Indicaciones para la entrega (opcional)</label>
            <div className="compra-readonly">{viewData.direccion.indicaciones}</div>
          </div>
        </div>

        <div className="compra-table-wrapper">
          <table className="compra-table">
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
              {viewData.items.map((item, idx) => (
                <tr key={`${item.id}-${idx}`}>
                  <td>
                    <img className="compra-table-img" src={item.imagen || '/favicon.svg'} alt={item.nombre} />
                  </td>
                  <td>{item.nombre}</td>
                  <td>$ {Number(item.precioUnitario).toLocaleString()}</td>
                  <td>{item.cantidad}</td>
                  <td>$ {Number(item.subtotal).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="compra-total-box">Total pagado: $ {Number(viewData.total).toLocaleString()}</div>

        {esExito && (
          <div className="compra-actions">
            <button type="button" className="btn-boleta pdf">
              Imprimir boleta en PDF
            </button>
            <button type="button" className="btn-boleta email">
              Envíar boleta por email
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default CompraResultado;
