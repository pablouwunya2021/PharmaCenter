// src/components/ClearCartButton.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const ClearCartButton = () => {
  const { clearCart } = useCart();

  return <button onClick={clearCart}>Vaciar Carrito</button>;
};

export default ClearCartButton;
