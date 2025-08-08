// src/components/ProductoCard.jsx
import { useState } from 'react';
import '../styles/compra.css';

function ProductoCard({ producto }) {
  const [cantidad, setCantidad] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cantidad < 1) {
      alert("Debes ingresar al menos una unidad");
      return;
    }

    alert(`¡Compra confirmada: ${cantidad} x ${producto.nombre}!`);
  };

  const imagenURL = producto.imagenUrl?.trim()
    ? producto.imagenUrl
    : 'https://cdn-icons-png.flaticon.com/512/10809/10809585.png';

  return (
    <div className="product-card-container">
      <div className="product-card">
        <div className="product-card-content">
          
          <div className="product-card-image-section">
            <img src={imagenURL} alt={producto.nombre} className="product-image" />
          </div>

          <div className="product-card-info-section">
            <h2 className="product-title">{producto.nombre}</h2>
            <p className="product-provider">Proveedor: {producto.proveedor}</p>
            <p className="product-price"><strong>Precio:</strong> ${producto.precio.toFixed(2)}</p>
            <p className="product-stock">
              <strong>Disponible:</strong> {producto.cantidadInventario > 0 ? producto.cantidadInventario : 'Cantidad no disponible'}
            </p>

            <form onSubmit={handleSubmit} className="product-form">
              <label className="form-label">
                Cantidad a comprar:
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={e => setCantidad(Number(e.target.value))}
                  className="form-input"
                />
              </label>
              <button type="submit" className="form-button">
                Confirmar Compra
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductoCard;
