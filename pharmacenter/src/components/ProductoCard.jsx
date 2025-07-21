// src/components/ProductoCard.jsx
import { useState } from 'react';

function ProductoCard({ producto }) {
  const [cantidad, setCantidad] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Vas a comprar ${cantidad} unidad(es) de ${producto.nombre}`);
  };

  const precio = isNaN(producto.precio)
    ? 'Precio no disponible'
    : `$${Number(producto.precio).toFixed(2)}`;

  const cantidadTexto = producto.cantidadinventario > 0
    ? `${producto.cantidadinventario} unidades disponibles`
    : 'Cantidad no disponible';

  const imagenURL = producto.imagenurl?.trim()
    ? producto.imagenurl
    : 'https://cdn-icons-png.freepik.com/512/10809/10809585.png';

  return (
    <div style={{
      display: 'flex',
      maxWidth: '900px',
      margin: '0 auto',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Imagen */}
      <div style={{ flex: 1, padding: '1rem', background: '#eee' }}>
        <img src={imagenURL} alt={producto.nombre} style={{ maxWidth: '100%', borderRadius: '8px' }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: '1.5rem' }}>
        <h2 style={{ color: '#5e35b1' }}>{producto.nombre ?? 'Sin nombre'}</h2>
        <p>{producto.proveedor ?? 'Sin proveedor'}</p>
        <p><strong>Precio:</strong> {precio}</p>
        <p><strong>Disponible:</strong> {cantidadTexto}</p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Cantidad a comprar:
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={e => setCantidad(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', marginBottom: '1rem' }}
            />
          </label>
          <button style={{
            padding: '0.7rem',
            width: '100%',
            background: '#5e35b1',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Confirmar Compra
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductoCard;
