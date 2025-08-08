import React, { useRef, useEffect } from 'react'
import compraBg from '../assets/compra.png'
import { useCart } from '../context/CartContext'
import CartItemList from '../components/CartItemList'
import CartTotal from '../components/CartTotal'
import ClearCartButton from '../components/ClearCartButton'
import { Link } from 'react-router-dom'

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
      className="relative px-4 pt-16 min-h-[calc(100vh-64px)] overflow-hidden"
      style={{
        backgroundImage: `url(${compraBg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div
        className="absolute top-16 inset-0 bg-cover bg-center bg-no-repeat scale-[1.05] blur-md -z-10"
        style={{
          backgroundImage: `url(${compraBg})`
        }}
      ></div>

      <div className="relative z-10 max-w-[90vw] mx-auto bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl text-[#333] text-center mb-8 tracking-wide">
          Carrito de Compras
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-[#333] mb-6">🛒 Tu carrito está vacío.</p>
            <Link to="/">
              <button className="bg-[#d62828] text-white px-6 py-3 rounded-2xl transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                Volver al catálogo
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
            <section className="flex flex-col gap-4">
              <CartItemList items={cartItems} lastItemRef={lastItemRef} />
            </section>
            <aside className="bg-white p-6 rounded-2xl shadow-md">
              <CartTotal total={total} />
              <ClearCartButton />
            </aside>
          </div>
        )}
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        {cartItems.length === 0 ? (
          <Link to="/">
            <button className="bg-yellow-400 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-105 hover:shadow-xl transition-transform">
              🛒
            </button>
          </Link>
        ) : (
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="bg-yellow-400 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-105 hover:shadow-xl transition-transform"
          >
            🛒
          </button>
        )}
      </div>
    </main>
  )
}

export default Cart