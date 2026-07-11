import React, { useEffect, useMemo, useState } from 'react';

const AUTO_PLAY_MS = 3500;

const Slider = () => {
  const slides = useMemo(
    () => [
      {
        titulo: 'Nuevos Lanzamientos',
        descripcion: 'Descubre sabores recién horneados para cada ocasión.',
        imagen: '/1image.jpeg',
      },
      {
        titulo: 'Ofertas Especiales',
        descripcion: 'Aprovecha descuentos semanales en tortas seleccionadas.',
        imagen: '/4image.jpeg',
      },
      {
        titulo: 'Pastelería 1000 Sabores',
        descripcion: 'Calidad, tradición y dulzura en cada bocado.',
        imagen: '/8image.jpeg',
      },
      {
        titulo: 'Pedidos Personalizados',
        descripcion: 'Diseñamos tu pastel ideal para cumpleaños y eventos.',
        imagen: '/12image.jpeg',
      },
      {
        titulo: 'Entrega Rápida',
        descripcion: 'Recibe tus postres favoritos frescos y a tiempo.',
        imagen: '/16image.jpeg',
      },
    ],
    []
  );

  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndice((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, AUTO_PLAY_MS);

    return () => clearInterval(timer);
  }, [slides.length]);

  const irAnterior = () => {
    setIndice((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const irSiguiente = () => {
    setIndice((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="slider">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${indice * 100}%)` }}
      >
        {slides.map((slide) => (
          <article className="slider-slide" key={slide.titulo}>
            <img className="slider-image" src={slide.imagen} alt={slide.titulo} />
            <div className="slider-overlay">
              <h2>{slide.titulo}</h2>
              <p>{slide.descripcion}</p>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        aria-label="Slide anterior"
        className="slider-arrow slider-arrow-left"
        onClick={irAnterior}
      >
        ❮
      </button>

      <button
        type="button"
        aria-label="Slide siguiente"
        className="slider-arrow slider-arrow-right"
        onClick={irSiguiente}
      >
        ❯
      </button>

      <div className="slider-dots">
        {slides.map((_, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            className={`slider-dot ${i === indice ? 'active' : ''}`}
            aria-label={`Ir al slide ${i + 1}`}
            onClick={() => setIndice(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
