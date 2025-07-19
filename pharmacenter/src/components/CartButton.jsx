import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CartButton.css'; // Asegúrate de que el path sea correcto

const CartButton = () => {
  const navigate = useNavigate();

  return (
    <div className="cart-button-container">
      <button className="cart-button" onClick={() => navigate('/cart')}>
        🛒
      </button>
    </div>
  );
};

export default CartButton;

