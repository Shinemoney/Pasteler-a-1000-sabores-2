import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

const STOCK_STORAGE_KEY = 'admin_productos';

const obtenerStockTotal = () => {
  try {
    const raw = localStorage.getItem(STOCK_STORAGE_KEY);
    if (!raw) return 500;
    const productos = JSON.parse(raw);
    if (!Array.isArray(productos)) return 500;
    return productos.reduce((acc, p) => acc + Number(p.stock || 0), 0);
  } catch {
    return 500;
  }
};

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stockActual, setStockActual] = useState(obtenerStockTotal());

  useEffect(() => {
    const actualizar = () => setStockActual(obtenerStockTotal());
    actualizar();
    const onStorage = (e) => {
      if (e.key === STOCK_STORAGE_KEY) actualizar();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('admin-stock-updated', actualizar);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('admin-stock-updated', actualizar);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <h1>Resumen de las actividades diarias</h1>

      <div className="metrics-grid">
        <Link to="/admin/ordenes" className="metric-card metric-link blue" aria-label="Ir a Órdenes">
          <h3>Compras</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1,234</p>
          <small>Probabilidad de aumento: 20%</small>
        </Link>
        <Link to="/admin/stock" className="metric-card metric-link green" aria-label="Ir a Stock">
          <h3>Stock</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stockActual}</p>
          <small>Stock actual: {stockActual}</small>
        </Link>
        <Link to="/admin/usuarios" className="metric-card metric-link yellow" aria-label="Ir a Usuarios">
          <h3>Usuarios</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>890</p>
          <small>Nuevos usuarios este mes: 120</small>
        </Link>
      </div>

      <div className="nav-grid">
        <Link to="/admin/ordenes" className="nav-card">
          <h3>Órdenes</h3>
          <p>Gestión y seguimiento de todas las órdenes de compra.</p>
        </Link>
        <Link to="/admin/productos" className="nav-card">
          <h3>Productos</h3>
          <p>Administrar inventario y detalles de productos disponibles.</p>
        </Link>
        <Link to="/admin/categorias" className="nav-card">
          <h3>Categorías</h3>
          <p>Organizar los productos por categorías para facilitar su navegación.</p>
        </Link>
        <Link to="/admin/usuarios" className="nav-card">
          <h3>Usuarios</h3>
          <p>Gestión de cuentas de usuario y sus roles.</p>
        </Link>
        <Link to="/admin/reportes" className="nav-card">
          <h3>Reportes</h3>
          <p>Generación de informes detallados sobre las operaciones.</p>
        </Link>
        <Link to="/admin/perfil" className="nav-card">
          <h3>Perfil</h3>
          <p>Administración de la información personal y ajustes.</p>
        </Link>
        <Link to="/admin/tienda" className="nav-card">
          <h3>Tienda</h3>
          <p>Visualiza la tienda en tiempo real y reportes públicos.</p>
        </Link>
        <button
          type="button"
          className="nav-card nav-card-logout"
          onClick={handleLogout}
          aria-label="Cerrar sesión segura de administrador"
        >
          <div className="logout-visual">
            <span className="power-icon" aria-hidden="true">⏻</span>
          </div>
          <h3>Cerrar Sesión</h3>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
