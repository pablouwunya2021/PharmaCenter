import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartButton from './CartButton';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay usuario logueado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    alert('Sesión cerrada exitosamente');
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token') && !!user;
  };

  const isAdmin = () => {
    return user && user.rol === 'admin';
  };

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

      {/* Navegación central */}
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {isAuthenticated() && (
          <Link 
            to="/inventory" 
            style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            Inventario
          </Link>
        )}
        
        <CartButton />
      </nav>

      {/* Sección de usuario */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {isAuthenticated() ? (
          <>
            {/* Información del usuario */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              color: 'white',
              fontSize: '14px'
            }}>
              <span>
                Hola, {user.nombre}
                {isAdmin() && (
                  <span style={{ 
                    backgroundColor: '#ff9800', 
                    padding: '2px 6px', 
                    borderRadius: '10px', 
                    fontSize: '10px',
                    marginLeft: '5px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    ADMIN
                  </span>
                )}
              </span>
              
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#b71c1c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}
              >
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Usuario no autenticado */}
            <Link
              to="/login"
              style={{
                color: 'white',
                textDecoration: 'none',
                border: '1px solid white',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#5c3c92';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Iniciar Sesión
            </Link>

            <Link
              to="/signup"
              style={{
                backgroundColor: 'white',
                color: '#5c3c92',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;