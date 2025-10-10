// src/components/ProductoCard.jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/compra.css';

function ProductoCard({ producto }) {
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (cantidad < 1) {
      alert('Debes ingresar al menos una unidad');
      return;
    }

    if (producto.cantidadInventario !== undefined && producto.cantidadInventario <= 0) {
      alert('Producto sin stock disponible');
      return;
    }

    const productoParaCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio) || 0,
      cantidad: Number(cantidad),
      imagenUrl: producto.imagenUrl,
      cantidadInventario: producto.cantidadInventario,
    };

    addToCart(productoParaCarrito);
    alert(`✅ Agregado al carrito: ${cantidad} x ${producto.nombre}`);
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

            <form onSubmit={handleAddToCart} className="product-form">
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
                Agregar al carrito
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductoCard;
