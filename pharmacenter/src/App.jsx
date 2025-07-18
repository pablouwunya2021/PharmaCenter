import React, { useEffect, useState } from 'react'
import Loader from './components/Loader'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Carousel from './components/Carousel'
import Catalogo from './components/Catalogo'
import Publicidad from './components/Publicidad';
import BotonPersonalizado from './components/BotonPersonalizado';

function App() {
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
            <BotonPersonalizado 
              texto="Redes Sociales" 
              url="https://linktr.ee/dra.gabrielaarguello"
              style={{ width: '100%', textAlign: 'center' }} 
            />
          </main>
        </>
      )}
    </>
  )
}

export default App
