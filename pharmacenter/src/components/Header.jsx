import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import CartButton from './CartButton';
import './Header.css';
import logo from '../assets/logo.png';
import SearchBar from './SearchBar'; 

function Header() {
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

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
    readUserFromStorage();
    const onStorage = () => readUserFromStorage();
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-update', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-update', onStorage);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        !event.target.closest('.user-toggle-btn')
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsUserMenuOpen(false);
    window.dispatchEvent(new Event('auth-update'));
    navigate('/');
    alert('Sesión cerrada exitosamente');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
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
      
      <SearchBar />

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

      <div className="header-right">
        {isAuthenticated ? (
          <>
            {/* Botón toggle para móvil */}
            <button
              className="user-toggle-btn"
              onClick={toggleUserMenu}
              aria-label="Menú de usuario"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {/* Desktop */}
            <div className="header-user-info desktop-only">
              <span className="header-user-name">
                Hola, {user?.nombre}{' '}
                {isAdmin && <span className="header-admin-badge">ADMIN</span>}
              </span>
              <button onClick={handleLogout} className="header-logout-btn">
                Cerrar Sesión
              </button>
            </div>

            {/* Móvil */}
            <div
              ref={userMenuRef}
              className={`user-menu-mobile ${isUserMenuOpen ? 'open' : ''}`}
            >
              <div className="user-menu-wrapper">
                <div className="user-menu-header">
                  <div className="user-info-mobile">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <div className="user-details">
                      <span className="user-greeting">Hola, {user?.nombre}</span>
                      {isAdmin && (
                        <span className="header-admin-badge">ADMIN</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="user-menu-close"
                    onClick={closeUserMenu}
                    aria-label="Cerrar menú"
                  >
                    ✕
                  </button>
                </div>

                <div className="user-menu-content">
                  <button onClick={handleLogout} className="user-menu-logout">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              </div>

              <div className="user-menu-overlay" onClick={closeUserMenu}></div>
            </div>
          </>
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