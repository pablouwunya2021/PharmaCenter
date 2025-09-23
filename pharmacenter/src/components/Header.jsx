import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import CartButton from './CartButton';
import './Header.css';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const readUserFromStorage = () => {
    const token = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (token && u) {
      try { setUser(JSON.parse(u)); }
      catch { localStorage.removeItem('user'); setUser(null); }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // carga inicial
    readUserFromStorage();
    // reactividad: cambios de sesión
    const onStorage = () => readUserFromStorage();
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-update', onStorage); // dispara este evento tras login/logout
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-update', onStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // notificar a otros componentes que cambió la sesión
    window.dispatchEvent(new Event('auth-update'));
    navigate('/');
    alert('Sesión cerrada exitosamente');
  };

  const isAuthenticated = !!localStorage.getItem('token') && !!user;
  const isAdmin = user?.rol === 'admin';

  return (
    <header className="header">
      <button id="openSidebar">&#9776;</button>

      <h1 style={{ margin: 0 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Farmacia Bethesda
        </Link>
      </h1>

      {/* Navegación central */}
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {isAuthenticated && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `nav-pill ${isActive ? 'active' : ''}`
            }
            style={{
              textDecoration: 'none',
              color: 'inherit',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.14)'
            }}
          >
            Acceso a Panel
          </NavLink>
        )}
        <CartButton />
      </nav>

      {/* Sección usuario */}
      <div className="header-user-section">
        {isAuthenticated ? (
          <div className="header-user-info">
            <span className="header-user-name">
              Hola, {user?.nombre}{' '}
              {isAdmin && <span className="header-admin-badge">ADMIN</span>}
            </span>
            <button onClick={handleLogout} className="header-logout-btn">
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="header-auth-buttons">
            <Link to="/login" className="header-login-btn">Iniciar Sesión</Link>
            <Link to="/signup" className="header-signup-btn">Registrarse</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
