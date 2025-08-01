import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Catalogo() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/medicamentos')
      .then(res => res.json())
      .then(data => {
        setMedicamentos(data);
        setLoading(false);
      })
      .catch(() => {
        setMedicamentos([]);
        setLoading(false);
      });
  }, []);

  const moveCarousel = (direction) => {
    const catalog = document.getElementById('medCatalog');
    const scrollAmount = catalog.clientWidth;
    catalog.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="catalog" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <h2>Medicamentos Disponibles</h2>
      {loading && <div className="loading-meds">Cargando medicamentos...</div>}
      <div className="catalog-container">
        <button className="catalog-btn prev" onClick={() => moveCarousel(-1)}>&#10094;</button>
        <div className="catalog-carousel" id="medCatalog">
          {medicamentos.map((med, idx) => (
            <div className="card" key={idx}>
              <img 
                src={med.imagenurl} 
                alt={med.nombre} 
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <h3>{med.nombre}</h3>
              <p>Cantidad: {med.cantidadinventario}</p>
              <p>Precio: ${med.precio}</p>
              <p>Proveedor: {med.proveedor}</p>
              <Link to={`/compra/${med.idmedicamento}`} className="btn-comprar">
                Comprar
              </Link>
            </div>
          ))}
        </div>
        <button className="catalog-btn next" onClick={() => moveCarousel(1)}>&#10095;</button>
      </div>
    </section>
  );
}

export default Catalogo;
