// src/components/ClearCartButton.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const ClearCartButton = () => {
  const { clearCart } = useCart();

  return (
    <button
      type="button"
      className="btn btn--danger btn--small"
      onClick={clearCart}
      aria-label="Vaciar carrito"
    >
      Vaciar Carrito
    </button>
  );
};

export default ClearCartButton;
