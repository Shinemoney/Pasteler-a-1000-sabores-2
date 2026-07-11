import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './AdminPanel.css';

const estadoOrdenes = ['pendiente', 'preparacion', 'despacho', 'entregado'];
const STOCK_STORAGE_KEY = 'admin_productos';

const AdminPanel = () => {
  const { seccion } = useParams();
  const seccionActiva = seccion || 'productos';

  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'María González', email: 'maria@1000sabores.cl', rol: 'Administrador', estado: 'activo' },
    { id: 2, nombre: 'Pedro Soto', email: 'pedro@1000sabores.cl', rol: 'Operador', estado: 'activo' },
    { id: 3, nombre: 'Cliente Demo', email: 'cliente@test.com', rol: 'Cliente', estado: 'inactivo' },
  ]);

  const productosIniciales = [
    { id: 1, nombre: 'Torta Tres Leches', categoria: 'Tortas', precio: 25990, stock: 12 },
    { id: 2, nombre: 'Cheesecake Frutos Rojos', categoria: 'Cheesecake', precio: 22990, stock: 7 },
    { id: 3, nombre: 'Cupcake Vainilla', categoria: 'Cupcakes', precio: 2990, stock: 40 },
  ];

  const [productos, setProductos] = useState(() => {
    try {
      const saved = localStorage.getItem(STOCK_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const saneados = parsed
            .filter((p) => p && typeof p === 'object')
            .map((p, i) => ({
              id: p.id ?? Date.now() + i,
              nombre: p.nombre ?? `Producto ${i + 1}`,
              categoria: p.categoria ?? 'General',
              precio: Number.isFinite(Number(p.precio)) ? Number(p.precio) : 0,
              stock: Number.isFinite(Number(p.stock)) ? Number(p.stock) : 0,
            }));
          if (saneados.length > 0) return saneados;
        }
      }
    } catch {
      // fallback a data inicial
    }
    return productosIniciales;
  });

  const [categorias, setCategorias] = useState([
    { id: 1, nombre: 'Tortas' },
    { id: 2, nombre: 'Cheesecake' },
    { id: 3, nombre: 'Cupcakes' },
    { id: 4, nombre: 'Galletas' },
  ]);

  const [ordenes, setOrdenes] = useState([
    { id: 1001, cliente: 'Ana López', total: 45980, estado: 'pendiente', fecha: '2026-01-10' },
    { id: 1002, cliente: 'Luis Peña', total: 12990, estado: 'despacho', fecha: '2026-01-10' },
    { id: 1003, cliente: 'Carla Díaz', total: 25990, estado: 'preparacion', fecha: '2026-01-11' },
  ]);

  const [filtroOrden, setFiltroOrden] = useState('todos');
  const [nuevoNombreCategoria, setNuevoNombreCategoria] = useState('');
  const [perfil, setPerfil] = useState({
    nombre: 'Administrador Principal',
    email: 'admin.pasteleria@gmail.cl',
    telefono: '+56 9 1234 5678',
    passwordActual: '',
    nuevaPassword: '',
    confirmarPassword: '',
  });

  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', rol: 'Cliente' });
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', categoria: 'Tortas', precio: '', stock: '' });

  useEffect(() => {
    localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(productos));
    window.dispatchEvent(new Event('admin-stock-updated'));
  }, [productos]);

  const reportes = useMemo(() => {
    const ventasTotales = ordenes.reduce((acc, o) => acc + o.total, 0);
    const ordenesActivas = ordenes.filter((o) => o.estado !== 'entregado').length;
    const stockBajo = productos.filter((p) => p.stock <= 10).length;
    const ticketPromedio = ordenes.length ? Math.round(ventasTotales / ordenes.length) : 0;

    return { ventasTotales, ordenesActivas, stockBajo, ticketPromedio };
  }, [ordenes, productos]);

  const ordenesFiltradas = useMemo(() => {
    if (filtroOrden === 'todos') return ordenes;
    return ordenes.filter((o) => o.estado === filtroOrden);
  }, [ordenes, filtroOrden]);

  const agregarUsuario = () => {
    if (!nuevoUsuario.nombre.trim() || !nuevoUsuario.email.trim()) return;
    setUsuarios((prev) => [
      ...prev,
      { id: Date.now(), ...nuevoUsuario, estado: 'activo' },
    ]);
    setNuevoUsuario({ nombre: '', email: '', rol: 'Cliente' });
  };

  const cambiarRolUsuario = (id, rol) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol } : u)));
  };

  const toggleEstadoUsuario = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' } : u)),
    );
  };

  const eliminarUsuario = (id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const agregarCategoria = () => {
    if (!nuevoNombreCategoria.trim()) return;
    setCategorias((prev) => [...prev, { id: Date.now(), nombre: nuevoNombreCategoria.trim() }]);
    setNuevoNombreCategoria('');
  };

  const editarCategoria = (id) => {
    const nuevoNombre = window.prompt('Nuevo nombre de categoría');
    if (!nuevoNombre || !nuevoNombre.trim()) return;
    setCategorias((prev) => prev.map((c) => (c.id === id ? { ...c, nombre: nuevoNombre.trim() } : c)));
  };

  const eliminarCategoria = (id) => {
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  };

  const agregarProducto = () => {
    const precio = Number(nuevoProducto.precio);
    const stock = Number(nuevoProducto.stock);
    const nombre = nuevoProducto.nombre.trim();

    if (!nombre) {
      alert('Debes ingresar el nombre del producto.');
      return;
    }
    if (Number.isNaN(precio) || precio < 0) {
      alert('El precio debe ser un número válido mayor o igual a 0.');
      return;
    }
    if (Number.isNaN(stock) || stock < 0) {
      alert('El stock debe ser un número válido mayor o igual a 0.');
      return;
    }

    setProductos((prev) => [
      ...prev,
      {
        id: Date.now(),
        nombre,
        categoria: nuevoProducto.categoria || categorias[0]?.nombre || 'General',
        precio,
        stock,
      },
    ]);
    setNuevoProducto({ nombre: '', categoria: categorias[0]?.nombre || 'Tortas', precio: '', stock: '' });
    alert('Producto agregado correctamente.');
  };

  const editarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    const stockActual = producto ? Number(producto.stock || 0) : 0;
    const input = window.prompt('Nuevo stock', String(stockActual));
    if (input === null) return;

    const nuevoStock = Number(input);
    if (Number.isNaN(nuevoStock) || nuevoStock < 0) {
      alert('El stock debe ser un número válido mayor o igual a 0.');
      return;
    }

    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, stock: nuevoStock } : p)));
  };

  const eliminarProducto = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const avanzarEstadoOrden = (id) => {
    setOrdenes((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = estadoOrdenes.indexOf(o.estado);
        const next = idx < estadoOrdenes.length - 1 ? estadoOrdenes[idx + 1] : o.estado;
        return { ...o, estado: next };
      }),
    );
  };

  const guardarPerfil = () => {
    if (perfil.nuevaPassword || perfil.confirmarPassword || perfil.passwordActual) {
      if (!perfil.passwordActual || !perfil.nuevaPassword || !perfil.confirmarPassword) return;
      if (perfil.nuevaPassword !== perfil.confirmarPassword) return;
    }
    alert('Perfil actualizado correctamente');
    setPerfil((prev) => ({ ...prev, passwordActual: '', nuevaPassword: '', confirmarPassword: '' }));
  };

  const renderUsuarios = () => (
    <>
      <div className="admin-header">
        <div>
          <h2>Gestión de Usuarios y Roles</h2>
          <p className="admin-subtitle">Administra cuentas, roles y estado operativo de cada usuario.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input className="admin-input" placeholder="Nombre" value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario((p) => ({ ...p, nombre: e.target.value }))} />
        <input className="admin-input" placeholder="Email" value={nuevoUsuario.email} onChange={(e) => setNuevoUsuario((p) => ({ ...p, email: e.target.value }))} />
        <select className="admin-select" value={nuevoUsuario.rol} onChange={(e) => setNuevoUsuario((p) => ({ ...p, rol: e.target.value }))}>
          <option>Administrador</option>
          <option>Operador</option>
          <option>Cliente</option>
        </select>
        <button className="admin-btn admin-btn-primary" onClick={agregarUsuario}>Crear usuario</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <select className="admin-select" value={u.rol} onChange={(e) => cambiarRolUsuario(u.id, e.target.value)}>
                    <option>Administrador</option>
                    <option>Operador</option>
                    <option>Cliente</option>
                  </select>
                </td>
                <td><span className={`tag ${u.estado}`}>{u.estado}</span></td>
                <td className="inline-actions">
                  <button className="admin-btn admin-btn-warning" onClick={() => toggleEstadoUsuario(u.id)}>
                    {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                  </button>
                  <button className="admin-btn admin-btn-danger" onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderReportes = () => (
    <>
      <div className="admin-header">
        <div>
          <h2>Reportes Operacionales</h2>
          <p className="admin-subtitle">KPIs clave del negocio para decisiones administrativas.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><h4>Ventas Totales</h4><p>${reportes.ventasTotales.toLocaleString()} CLP</p></div>
        <div className="kpi-card"><h4>Órdenes Activas</h4><p>{reportes.ordenesActivas}</p></div>
        <div className="kpi-card"><h4>Productos Stock Bajo</h4><p>{reportes.stockBajo}</p></div>
        <div className="kpi-card"><h4>Ticket Promedio</h4><p>${reportes.ticketPromedio.toLocaleString()} CLP</p></div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr><th>Periodo</th><th>Órdenes</th><th>Ventas</th><th>Conversión</th></tr>
          </thead>
          <tbody>
            <tr><td>Diario</td><td>24</td><td>$450.000</td><td>3.4%</td></tr>
            <tr><td>Semanal</td><td>138</td><td>$2.750.000</td><td>4.1%</td></tr>
            <tr><td>Mensual</td><td>620</td><td>$11.300.000</td><td>4.8%</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const renderPerfil = () => (
    <>
      <div className="admin-header">
        <div>
          <h2>Perfil de Administrador</h2>
          <p className="admin-subtitle">Actualiza tus datos personales y ajustes de seguridad.</p>
        </div>
      </div>

      <div className="profile-grid">
        <input className="admin-input" placeholder="Nombre" value={perfil.nombre} onChange={(e) => setPerfil((p) => ({ ...p, nombre: e.target.value }))} />
        <input className="admin-input" placeholder="Email" value={perfil.email} onChange={(e) => setPerfil((p) => ({ ...p, email: e.target.value }))} />
        <input className="admin-input" placeholder="Teléfono" value={perfil.telefono} onChange={(e) => setPerfil((p) => ({ ...p, telefono: e.target.value }))} />
      </div>

      <div className="admin-toolbar" style={{ marginTop: '12px' }}>
        <input className="admin-input" type="password" placeholder="Contraseña actual" value={perfil.passwordActual} onChange={(e) => setPerfil((p) => ({ ...p, passwordActual: e.target.value }))} />
        <input className="admin-input" type="password" placeholder="Nueva contraseña" value={perfil.nuevaPassword} onChange={(e) => setPerfil((p) => ({ ...p, nuevaPassword: e.target.value }))} />
        <input className="admin-input" type="password" placeholder="Confirmar nueva contraseña" value={perfil.confirmarPassword} onChange={(e) => setPerfil((p) => ({ ...p, confirmarPassword: e.target.value }))} />
      </div>

      <button className="admin-btn admin-btn-primary" onClick={guardarPerfil}>Guardar cambios</button>
    </>
  );

  const renderCategorias = () => (
    <>
      <div className="admin-header">
        <div>
          <h2>Gestión de Categorías</h2>
          <p className="admin-subtitle">Crea y organiza categorías para navegación eficiente en la tienda.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input className="admin-input" placeholder="Nueva categoría" value={nuevoNombreCategoria} onChange={(e) => setNuevoNombreCategoria(e.target.value)} />
        <button className="admin-btn admin-btn-primary" onClick={agregarCategoria}>Agregar categoría</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Nombre</th><th>Acciones</th></tr></thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td className="inline-actions">
                  <button className="admin-btn admin-btn-warning" onClick={() => editarCategoria(c.id)}>Renombrar</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => eliminarCategoria(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderProductos = () => (
    <>
      <div className="admin-header">
        <div>
          <h2>Administración de Productos</h2>
          <p className="admin-subtitle">Gestiona inventario y detalles de productos disponibles.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input className="admin-input" placeholder="Nombre producto" value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto((p) => ({ ...p, nombre: e.target.value }))} />
        <select className="admin-select" value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto((p) => ({ ...p, categoria: e.target.value }))}>
          {categorias.map((c) => <option key={c.id}>{c.nombre}</option>)}
        </select>
        <input className="admin-input" type="number" placeholder="Precio" value={nuevoProducto.precio} onChange={(e) => setNuevoProducto((p) => ({ ...p, precio: e.target.value }))} />
        <input className="admin-input" type="number" placeholder="Stock" value={nuevoProducto.stock} onChange={(e) => setNuevoProducto((p) => ({ ...p, stock: e.target.value }))} />
        <button className="admin-btn admin-btn-primary" onClick={agregarProducto}>Crear producto</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${p.precio.toLocaleString()} CLP</td>
                <td>{p.stock}</td>
                <td className="inline-actions">
                  <button className="admin-btn admin-btn-warning" onClick={() => editarProducto(p.id)}>Editar stock</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderOrdenes = () => (
    <>
      <div className="admin-header">
        <div>
          <h2>Gestión y Seguimiento de Órdenes</h2>
          <p className="admin-subtitle">Control de estado operativo de las compras.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <select className="admin-select" value={filtroOrden} onChange={(e) => setFiltroOrden(e.target.value)}>
          <option value="todos">Todos los estados</option>
          {estadoOrdenes.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {ordenesFiltradas.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.cliente}</td>
                <td>${o.total.toLocaleString()} CLP</td>
                <td>{o.fecha}</td>
                <td><span className={`tag ${o.estado}`}>{o.estado}</span></td>
                <td>
                  <button className="admin-btn admin-btn-success" onClick={() => avanzarEstadoOrden(o.id)}>Avanzar estado</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTienda = () => (
    <>
      <div className="admin-header">
        <div>
          <h2>Tienda en Tiempo Real</h2>
          <p className="admin-subtitle">Monitoreo en vivo de operación comercial y alertas públicas.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><h4>Visitantes Activos</h4><p>86</p></div>
        <div className="kpi-card"><h4>Carritos Abiertos</h4><p>31</p></div>
        <div className="kpi-card"><h4>Pedidos Hoy</h4><p>{ordenes.length}</p></div>
        <div className="kpi-card"><h4>Ingresos Hoy</h4><p>${ordenes.reduce((acc, o) => acc + o.total, 0).toLocaleString()} CLP</p></div>
      </div>

      <h3>Alertas de inventario</h3>
      <div className="alert-list">
        {productos.filter((p) => p.stock <= 10).map((p) => (
          <div className="alert-item" key={p.id}>
            <strong>{p.nombre}</strong> con stock crítico: {p.stock} unidades.
          </div>
        ))}
      </div>
    </>
  );

  const totalStock = useMemo(
    () => productos.reduce((acc, p) => acc + Number(p.stock || 0), 0),
    [productos],
  );

  const productosCriticos = useMemo(
    () => productos.filter((p) => Number(p.stock || 0) <= 10),
    [productos],
  );

  const promedioStock = useMemo(() => {
    if (!productos.length) return 0;
    return Math.round(totalStock / productos.length);
  }, [productos, totalStock]);

  const renderStock = () => (
    <>
      <div className="admin-header">
        <div>
          <h2>Panel de Stock</h2>
          <p className="admin-subtitle">Vista detallada y profesional del inventario actual.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Stock Total</h4>
          <p>{totalStock}</p>
        </div>
        <div className="kpi-card">
          <h4>Productos Activos</h4>
          <p>{productos.length}</p>
        </div>
        <div className="kpi-card">
          <h4>Stock Crítico</h4>
          <p>{productosCriticos.length}</p>
        </div>
        <div className="kpi-card">
          <h4>Promedio por Producto</h4>
          <p>{promedioStock}</p>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              const stock = Number(p.stock || 0);
              const estado = stock <= 10 ? 'Crítico' : stock <= 25 ? 'Bajo' : 'Óptimo';
              return (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${Number(p.precio || 0).toLocaleString()} CLP</td>
                  <td>{stock}</td>
                  <td>
                    <span className={`tag ${stock <= 10 ? 'pendiente' : stock <= 25 ? 'preparacion' : 'entregado'}`}>
                      {estado}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="admin-toolbar" style={{ justifyContent: 'flex-end' }}>
        <Link to="/admin" className="admin-btn admin-btn-primary">Volver al Dashboard</Link>
      </div>
    </>
  );

  const renderContenido = () => {
    switch (seccionActiva) {
      case 'usuarios':
        return renderUsuarios();
      case 'reportes':
        return renderReportes();
      case 'perfil':
        return renderPerfil();
      case 'categorias':
        return renderCategorias();
      case 'productos':
        return renderProductos();
      case 'stock':
        return renderStock();
      case 'ordenes':
        return renderOrdenes();
      case 'tienda':
        return renderTienda();
      default:
        return <h2>Sección no encontrada</h2>;
    }
  };

  return (
    <div className="admin-container">
      <Link to="/admin" className="back-link">← Volver al Dashboard</Link>
      <div className="admin-content-wrapper">
        {renderContenido()}
      </div>
    </div>
  );
};

export default AdminPanel;
