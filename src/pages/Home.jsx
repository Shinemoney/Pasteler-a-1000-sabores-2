import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from '../components/Slider';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [mostrarHorario, setMostrarHorario] = useState(false);

  return (
    <div className="home-container">
      <div className="home-layout">
        {/* Lateral izquierdo: acciones */}
        <aside className="home-sidebar-acciones">
          <button className="home-card-accion" onClick={() => navigate('/catalogo')}>
            Ver catálogo
          </button>

          <button className="home-card-accion" onClick={() => setMostrarHorario(true)}>
            Ver Horario
          </button>

          <button className="home-card-accion card-admin" onClick={() => navigate('/admin-login')}>
             Admin
          </button>
        </aside>

        <section className="home-main-placeholder">
          <div className="home-slider-center">
            <Slider />
          </div>
        </section>
      </div>

      {/* Modal de Horario */}
      {mostrarHorario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setMostrarHorario(false)}>X</button>
            <h2>Horario de Atención</h2>
            <p>Lunes a Viernes: 09:00 - 19:00</p>
            <p>Sábados: 10:00 - 18:00</p>
            <p>Domingos: Cerrado</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;