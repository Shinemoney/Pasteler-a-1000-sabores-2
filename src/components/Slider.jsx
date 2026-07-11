import React, { useState } from 'react';

const Slider = () => {
  const [indice, setIndice] = useState(0);

  const slides = [
    { texto: 'Nuevos Lanzamientos', desc: 'Descubre los últimos productos.' },
    { texto: 'Ofertas Especiales', desc: 'Descuentos en tortas seleccionadas.' },
    { texto: 'Pastelería 1000 Sabores', desc: 'Calidad y tradición en tu mesa.' },
  ];

  return (
    <div style={styles.container}>
      <button
        type="button"
        aria-label="Slide anterior"
        style={{ ...styles.arrow, left: '14px' }}
        onClick={() => setIndice((i) => (i === 0 ? slides.length - 1 : i - 1))}
      >
        ❮
      </button>

      <div style={styles.content}>
        <h2 style={styles.title}>{slides[indice].texto}</h2>
        <p style={styles.desc}>{slides[indice].desc}</p>
      </div>

      <button
        type="button"
        aria-label="Slide siguiente"
        style={{ ...styles.arrow, right: '14px' }}
        onClick={() => setIndice((i) => (i === slides.length - 1 ? 0 : i + 1))}
      >
        ❯
      </button>

      <div style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <span
            key={i}
            style={{
              ...styles.dot,
              color: i === indice ? '#5D4037' : '#b9b9b9',
              transform: i === indice ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            ●
          </span>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: 'min(620px, 90%)',
    minHeight: '200px',
    background:
      'linear-gradient(135deg, rgba(255,248,241,0.98) 0%, rgba(244,226,210,0.95) 100%)',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 14px 30px rgba(84, 48, 31, 0.18)',
    border: '2px solid #f29ac2',
    padding: '0 52px',
  },
  content: {
    textAlign: 'center',
    color: '#3b2618',
    maxWidth: '620px',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
    lineHeight: 1.1,
  },
  desc: {
    margin: 0,
    fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
    color: '#5d4037',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.95)',
    border: '1px solid #c8a48a',
    color: '#5D4037',
    fontSize: '2rem',
    lineHeight: 1,
    cursor: 'pointer',
    width: '42px',
    height: '42px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(84, 48, 31, 0.22)',
    zIndex: 2,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
  },
  dot: {
    fontSize: '1.05rem',
    transition: 'all .2s ease',
  },
};

export default Slider;
