import React, { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  const addToCart = (product) => {
    const simulatedCart = cartItems.map((item) => ({ ...item }));

    const existingIndex = simulatedCart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      const currentQuantity = simulatedCart[existingIndex].cantidad;
      const newQuantity = currentQuantity + product.cantidad;

      if (newQuantity > 9) {
        alert('❌ Solo puedes agregar hasta 9 unidades de este producto.');
        return;
      }

      simulatedCart[existingIndex].cantidad = newQuantity;
    } else {
      if (product.cantidad > 9) {
        alert('❌ Solo puedes agregar hasta 9 unidades de este producto.');
        return;
      }

      simulatedCart.push({ ...product });
    }

    const newTotal = calculateTotal(simulatedCart);

    if (newTotal > 999) {
      alert('❌ Has alcanzado el límite de $999. No puedes agregar más productos.');
      return;
    }

    setCartItems(simulatedCart);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const total = calculateTotal(cartItems);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
