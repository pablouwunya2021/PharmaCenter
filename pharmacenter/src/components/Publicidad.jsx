import React from 'react';
import ad1 from '../assets/ad1.jpg';
import ad2 from '../assets/ad2.jpg';
import ad3 from '../assets/ad3.jpg';

function Publicidad() {
  // Array estático de publicidad con imágenes importadas
  const anuncios = [
    { id: 1, imagen: ad1 },
    { id: 2, imagen: ad2 },
    { id: 3, imagen: ad3 }
  ];

  const moveCarousel = (direction) => {
    const carousel = document.getElementById('pubCarousel');
    const scrollAmount = carousel.clientWidth;
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="catalog" style={{ marginTop: '30px', fontFamily: 'Montserrat, sans-serif' }}>
      <h2>Ofertas Especiales</h2>
      <div className="catalog-container">
        <button className="catalog-btn prev" onClick={() => moveCarousel(-1)}>&#10094;</button>
        <div className="catalog-carousel" id="pubCarousel">
          {anuncios.map((anuncio) => (
            <div className="card" key={anuncio.id} style={{ position: 'relative' }}>
              <img 
                src={anuncio.imagen} 
                alt="Publicidad"
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  filter: 'brightness(0.95)'
                }}
              />
            </div>
          ))}
        </div>
        <button className="catalog-btn next" onClick={() => moveCarousel(1)}>&#10094;</button>
      </div>
    </section>
  );
}

export default Publicidad;