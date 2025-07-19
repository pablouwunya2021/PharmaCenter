// src/components/CartItem.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const CartItem = React.forwardRef(({ item }, ref) => {
  const { removeFromCart } = useCart();

  return (
    <div ref={ref} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
      <h4>{item.nombre}</h4>
      <p>Precio: ${item.precio}</p>
      <p>Cantidad: {item.cantidad}</p>
      <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
    </div>
  );
});

export default CartItem;
