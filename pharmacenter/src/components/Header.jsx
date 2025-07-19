import React from 'react'
import CartButton from './CartButton';

function Header() {
  return (
    <header className="header">
      <button id="openSidebar">&#9776;</button>
      <h1>Farmacia Bethesda</h1>
      <CartButton />

    </header>
  )
}

export default Header
