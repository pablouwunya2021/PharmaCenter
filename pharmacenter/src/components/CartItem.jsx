// src/components/CartItem.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const CartItem = React.forwardRef(({ item }, ref) => {
  const { removeFromCart } = useCart();

  return (
    <div ref={ref} className="cart-item">
      <div className="cart-item-info">
        <h4 className="cart-item-title">{item.nombre}</h4>
        <p className="cart-item-price">Precio: ${item.precio}</p>
        <p className="cart-item-qty">Cantidad: {item.cantidad}</p>
      </div>
      <div className="cart-item-actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => removeFromCart(item.id)}
          aria-label={`Eliminar ${item.nombre}`}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
});

export default CartItem;
