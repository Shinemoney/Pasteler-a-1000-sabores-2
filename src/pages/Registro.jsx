// src/pages/Registro.jsx
import React, { useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';

const fieldLabels = {
  nombre: 'Nombre',
  apellido: 'Apellido',
  fechaNacimiento: 'Fecha de Nacimiento',
  email: 'Correo Electrónico',
  password: 'Contraseña',
  emailDuoc: 'Correo Institucional (duoc.cl)',
  codigoDescuento: 'Código (FELICES50)',
  region: 'Región',
  comuna: 'Comuna',
  direccion: 'Dirección',
};

const initialFormState = {
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  email: '',
  password: '',
  emailDuoc: '',
  codigoDescuento: '',
  region: '',
  comuna: '',
  direccion: '',
};

const Registro = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');

  const { values, errors, handleChange, validate, setValues } = useFormValidation(
    initialFormState,
    fieldLabels
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedbackMessage('');
    setFeedbackType('');

    if (validate()) {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const exists = registeredUsers.some((u) => u.email.toLowerCase() === values.email.toLowerCase());

      if (exists) {
        setFeedbackMessage('Este correo ya está registrado.');
        setFeedbackType('error');
        return;
      }

      const newUser = {
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        password: values.password,
      };

      localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, newUser]));
      setFeedbackMessage('Registro completado con éxito.');
      setFeedbackType('success');
      setValues(initialFormState);
    }
  };

  const regiones = [
    'Región Metropolitana',
    'Valparaíso',
    'Biobío',
    'La Araucanía',
  ];

  const comunasPorRegion = {
    'Región Metropolitana': ['La Pintana', 'Puente Alto', 'San Bernardo', 'La Florida'],
    Valparaíso: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
    Biobío: ['Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chiguayante'],
    'La Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón'],
  };

  const fields = [
    { name: 'nombre', label: 'Nombre' },
    { name: 'apellido', label: 'Apellido' },
    { name: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date' },
    { name: 'email', label: 'Correo Electrónico' },
    { name: 'password', label: 'Contraseña', type: 'password' },
    { name: 'emailDuoc', label: 'Correo Institucional (duoc.cl)' },
    { name: 'codigoDescuento', label: 'Código (FELICES50)' },
    { name: 'region', label: 'Región', type: 'select' },
    { name: 'comuna', label: 'Comuna', type: 'select' },
    { name: 'direccion', label: 'Dirección' },
  ];

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm" style={{ maxWidth: '600px', margin: 'auto' }}>
        <h2 style={{ color: '#5D4037', fontFamily: 'Pacifico, cursive' }}>Registro</h2>

        {feedbackMessage && (
          <div
            className={`alert py-2 mt-2 ${feedbackType === 'error' ? 'alert-danger' : 'alert-success'}`}
            role="alert"
          >
            {feedbackMessage}
          </div>
        )}

        {fields.map((f) => (
          <div className="mb-2" key={f.name}>
            <label className="form-label">{f.label}</label>

            {f.name === 'region' ? (
              <select
                name={f.name}
                value={values[f.name]}
                className="form-control"
                style={errors[f.name] ? { border: '2px solid #ff0033' } : {}}
                onChange={handleChange}
              >
                <option value="">Selecciona una región</option>
                {regiones.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            ) : f.name === 'comuna' ? (
              <select
                name={f.name}
                value={values[f.name]}
                className="form-control"
                style={errors[f.name] ? { border: '2px solid #ff0033' } : {}}
                onChange={handleChange}
                disabled={!values.region}
              >
                <option value="">
                  {values.region ? 'Selecciona una comuna' : 'Primero selecciona una región'}
                </option>
                {(comunasPorRegion[values.region] || []).map((comuna) => (
                  <option key={comuna} value={comuna}>
                    {comuna}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={f.name}
                type={f.type || 'text'}
                value={values[f.name]}
                className="form-control"
                style={errors[f.name] ? { border: '2px solid #ff0033' } : {}}
                onChange={handleChange}
              />
            )}

            {errors[f.name] && (
              <div className="text-danger small">
                {f.name === 'password'
                  ? 'La contraseña es requerida (Mínimo 6 caracteres)'
                  : 'Este campo es obligatorio'}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="btn w-100 mt-3"
          style={{ backgroundColor: '#FFC0CB', color: '#5D4037', padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Registro;
