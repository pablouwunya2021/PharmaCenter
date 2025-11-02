// src/components/CartTotal.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ClearCartButton from './ClearCartButton';

const CartTotal = ({ total }) => {
  return (
    <div className="summary-section summary-center">
      <h3>Total</h3>
      <p className="summary-amount">${total.toFixed(2)}</p>

      <div
  style={{
    display: 'flex',
    gap: 12,
    marginTop: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',   // 👈 centra horizontalmente
    alignItems: 'center'         // 👈 opcional: alinea vertical
  }}
>
  <ClearCartButton />
  <Link to="/facturacion" style={{ textDecoration: 'none' }}>
    <button type="button" className="checkout-btn" aria-label="Ir a facturación">
      Ir a Facturación
    </button>
  </Link>
</div>

    </div>
  );
};

export default CartTotal;