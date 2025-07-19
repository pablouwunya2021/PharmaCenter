// src/components/CartTotal.jsx
import React from 'react';

const CartTotal = ({ total }) => {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <h3>Total</h3>
      <p style={{ fontSize: '24px' }}>${total.toFixed(2)}</p>
    </div>
  );
};

export default CartTotal;
