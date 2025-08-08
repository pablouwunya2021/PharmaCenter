import React, { useRef, useEffect } from 'react'
import compraBg          from '../assets/compra.png'
import '../styles/Cart.css'
import { useCart }       from '../context/CartContext'
import CartItemList      from '../components/CartItemList'
import CartTotal         from '../components/CartTotal'
import ClearCartButton   from '../components/ClearCartButton'
import { Link }          from 'react-router-dom'

const Cart = () => {
  const { cartItems, total } = useCart()
  const lastItemRef = useRef(null)

  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [cartItems])

  return (
    <main
      className="cart-page"
      style={{
        backgroundImage: `url(${compraBg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="cart-container">
        <h2 className="cart-title">Carrito de Compras</h2>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">🛒 Tu carrito está vacío.</p>
            <Link to="/">
              <button className="empty-button">Volver al catálogo</button>
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <section className="items-section">
              <CartItemList items={cartItems} lastItemRef={lastItemRef} />
            </section>
            <aside className="summary-section">
              <CartTotal total={total} />
              <ClearCartButton />
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default Cart
