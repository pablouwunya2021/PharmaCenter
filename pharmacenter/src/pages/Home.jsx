import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Carousel from '../components/Carousel'
import Catalogo from '../components/Catalogo'
import Publicidad from '../components/Publicidad'
// IMPORTA tu componente de Ofertas Especiales si existe:
import OfertasEspeciales from '../components/OfertasEspeciales'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Sidebar />
          <div className="overlay" id="overlay"></div>
          <Header />
          <main className="main-content" id="content">
            <Carousel />
            <Catalogo />
            <Publicidad />
            {/* Aquí va el componente de Ofertas Especiales */}
            <OfertasEspeciales />
            {/* Botón SOLO después de ofertas, NO fijo */}
            <div className="boton-redes-sociales-estatico">
              <a
                href="https://linktr.ee/dra.gabrielaarguello"
                className="boton-personalizado"
                target="_blank"
                rel="noopener noreferrer"
              >
                Redes Sociales
              </a>
            </div>
          </main>
        </>
      )}
    </>
  )
}

export default Home