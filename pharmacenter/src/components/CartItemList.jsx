// src/components/CartItemsList.jsx
import React from 'react';
import CartItem from './CartItem';

const CartItemsList = ({ items, lastItemRef }) => {
  return (
    <div style={{ flex: 2 }}>
      {items.map((item, index) => (
        <CartItem
          key={item.id}
          item={item}
          ref={index === items.length - 1 ? lastItemRef : null}
        />
      ))}
    </div>
  );
};

export default CartItemsList;
