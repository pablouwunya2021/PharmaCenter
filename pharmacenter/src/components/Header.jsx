import React from 'react'
import { Link } from 'react-router-dom';
import CartButton from './CartButton';

function Header() {
  return (
    <header className="header">
      <button id="openSidebar">&#9776;</button>
      <h1 style={{ margin: 0 }}>
        <Link 
          to="/" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Farmacia Bethesda
        </Link>
      </h1>
      <CartButton />

    </header>
  )
}

export default Header
