// src/components/ClearCartButton.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const ClearCartButton = () => {
  const { clearCart } = useCart();

  const handleClear = () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres vaciar el carrito? Esta acción no se puede deshacer.'
    );
    if (confirmed) {
      clearCart();
    }
  };

  return (
    <button
      type="button"
      className="btn btn--danger btn--small"
      onClick={handleClear}
      aria-label="Vaciar carrito"
    >
      Vaciar Carrito
    </button>
  );
};

export default ClearCartButton;

