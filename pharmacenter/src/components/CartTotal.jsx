// src/components/CartTotal.jsx
import React from 'react';
import ClearCartButton from './ClearCartButton';
import { Link } from "react-router-dom";

const CartTotal = ({ total }) => {
  return (
    <div className="summary-section summary-center">
      <h3>Total</h3>
      <p className="summary-amount">${total.toFixed(2)}</p>
      <div style={{ marginTop: 12 }}>
        <ClearCartButton />
      </div>
    </div>
  );
};

export default CartTotal;
