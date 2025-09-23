import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartButton from './CartButton';
import './Header.css'; 

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
      <div className="header-user-section">
        {isAuthenticated() ? (
          <>
            {/* Información del usuario */}
            <div className="header-user-info">
              <span className="header-user-name">
                Hola, {user.nombre}
                {isAdmin() && (
                  <span className="header-admin-badge">
                    ADMIN
                  </span>
                )}
              </span>
              
              <button
                onClick={handleLogout}
                className="header-logout-btn"
              >
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Usuario no autenticado */}
            <div className="header-auth-buttons">
              <Link
                to="/login"
                className="header-login-btn"
              >
                Iniciar Sesión
              </Link>

              <Link
                to="/signup"
                className="header-signup-btn"
              >
                Registrarse
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;