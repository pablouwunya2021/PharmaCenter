import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CartButton.css';

const CartButton = () => {
  const navigate = useNavigate();

  return (
    <div className="cart-button-container">
      <button 
        className="cart-button" 
        onClick={() => navigate('/cart')}
        aria-label="Ver carrito de compras"
      >
        🛒
      </button>
    </div>
  );
};

export default CartButton;