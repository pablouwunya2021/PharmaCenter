import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import CartButton from './CartButton';
import './Header.css';
import logo from '../assets/logo.png'; // Asegúrate de que la ruta sea correcta

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
      <div className="header-left">
        <div className="header-brand">
          <img src={logo} alt="Farmacia Bethesda" className="header-logo" />
          <Link to="/" className="header-title">
            Farmacia Bethesda
          </Link>
        </div>
      </div>

      {/* Navegación central */}
      <nav className="header-nav">
        {isAuthenticated && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `nav-pill ${isActive ? 'active' : ''}`
            }
          >
            Acceso a Panel
          </NavLink>
        )}
        <CartButton />
      </nav>

      {/* Sección usuario */}
      <div className="header-right">
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