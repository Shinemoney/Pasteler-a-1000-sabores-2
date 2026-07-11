import React from 'react';
import './CartModal.css';

const estadoLabel = {
  preparacion: 'En preparación',
  despacho: 'En despacho',
  entrega: 'Entregado',
};

const formatTrackingDate = (timestamp) =>
  new Date(timestamp).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

const TrackingSimulationModal = ({ isOpen, pedidoActual, onClose, onUpdateEstado }) => {
  if (!isOpen || !pedidoActual) return null;

  const ultimoEstado = pedidoActual.estado === 'entrega';
  const historial = pedidoActual.tracking?.historial || [];

  return (
    <div className="modal-overlay" style={{ zIndex: 100000 }}>
      <div className="modal-content tracking-modal" style={{ zIndex: 100000 }}>
        <button onClick={onClose} className="btn-close-tracking" aria-label="Cerrar simulación">
          ✕
        </button>

        <h2>Simulación de Envío</h2>
        <p className="tracking-subtitle">Sigue y actualiza el estado de tu pedido en tiempo real.</p>

        <div className="tracking-card">
          <p>
            <strong>ID Pedido:</strong> {pedidoActual.id}
          </p>
          <p>
            <strong>Código de seguimiento:</strong> {pedidoActual.tracking?.codigo}
          </p>
          <p>
            <strong>Estado actual:</strong>{' '}
            <span className={`tracking-status status-${pedidoActual.estado}`}>
              {estadoLabel[pedidoActual.estado] || pedidoActual.estado}
            </span>
          </p>
        </div>

        <div className="tracking-history">
          <h3>Historial de estados</h3>
          {historial.length === 0 ? (
            <p>No hay eventos de seguimiento aún.</p>
          ) : (
            historial.map((h, idx) => (
              <div key={`${h.timestamp}-${idx}`} className="tracking-history-item">
                <strong>{estadoLabel[h.estado] || h.estado}</strong>
                <span>{formatTrackingDate(h.timestamp)}</span>
                <small>{h.descripcion}</small>
              </div>
            ))
          )}
        </div>

        <div className="tracking-actions">
          <button className="btn-finalizar" onClick={onUpdateEstado} disabled={ultimoEstado}>
            {ultimoEstado ? 'Pedido entregado' : 'Actualizar estado'}
          </button>
          <button className="btn-volver" onClick={onClose}>
            Cerrar simulación
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingSimulationModal;
