import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; 
import { AuthProvider, AuthContext } from './context/AuthContext.jsx'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Registro from './pages/Registro';
import Contacto from './pages/Contacto';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard'; // Importamos el Dashboard
import VistaProductosPorCategoria from './pages/VistaProductosPorCategoria'; 
import Ofertas from './pages/Ofertas'; 
import Categorias from './pages/Categorias'; 
import Nosotros from './pages/Nosotros'; 
import Blog from './pages/Blog'; 
import BlogDetalle from './pages/BlogDetalle';
import DetalleProducto from './pages/DetalleProducto';
import Catalogo from './pages/Catalogo';
import AdminPanel from './pages/AdminPanel';
import CompraResultado from './pages/CompraResultado';

// Componente para proteger la ruta de administración
const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useContext(AuthContext);
  return isAdmin ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <CartProvider>
          <div style={{ backgroundColor: '#FFF5E1', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/compra-resultado/:estado" element={<CompraResultado />} />
                
                {/* Ruta protegida del AdminDashboard */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/productos" element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/admin/productos/:seccion" element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/categoria/:nombreCategoria" element={<VistaProductosPorCategoria />} />
                <Route path="/ofertas" element={<Ofertas />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetalle />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/admin/:seccion" element={
                <ProtectedRoute>
                <AdminPanel />
                </ProtectedRoute>
                  } />
              </Routes>
            </div>
            
            <Footer />
          </div>
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;