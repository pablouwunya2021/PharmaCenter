import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../hooks/useSearch';
import './SearchBar.css';

function SearchBar() {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    isOpen,
    toggleSearch,
    closeSearch,
    clearSearch,
    hasResults,
  } = useSearch();

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Focus en el input cuando se abre en móvil
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        closeSearch();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeSearch]);

  // Manejar navegación a detalle del medicamento
  const handleResultClick = (medicamento) => {
    navigate(`/compra/${medicamento.idmedicamento}`);
    clearSearch();
  };

  // Manejar tecla Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(price);
  };

  return (
    <>
      {/* Botón de búsqueda para móvil */}
      <button
        className="search-toggle-btn"
        onClick={toggleSearch}
        aria-label="Buscar medicamentos"
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
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>

      {/* Contenedor principal de búsqueda */}
      <div
        ref={searchContainerRef}
        className={`search-bar-container ${isOpen ? 'open' : ''}`}
      >
        <div className="search-bar-wrapper">
          {/* Input de búsqueda */}
          <div className="search-input-group">
            <svg
              className="search-icon"
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
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>

            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Buscar medicamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Buscar medicamentos"
            />

            {searchTerm && (
              <button
                className="search-clear-btn"
                onClick={clearSearch}
                aria-label="Limpiar búsqueda"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}

            {/* Botón cerrar para móvil */}
            <button
              className="search-close-mobile"
              onClick={closeSearch}
              aria-label="Cerrar búsqueda"
            >
              ✕
            </button>
          </div>

          {/* Resultados de búsqueda */}
          {searchTerm && (
            <div className="search-results">
              {loading && (
                <div className="search-loading">
                  <div className="search-spinner"></div>
                  <span>Buscando...</span>
                </div>
              )}

              {error && (
                <div className="search-error">
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>Error: {error}</span>
                </div>
              )}

              {!loading && !error && !hasResults && (
                <div className="search-no-results">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <p>No se encontraron medicamentos</p>
                  <span>Intenta con otro término de búsqueda</span>
                </div>
              )}

              {!loading && !error && hasResults && (
                <div className="search-results-list">
                  {results.map((medicamento) => (
                    <div
                      key={medicamento.idmedicamento}
                      className="search-result-item"
                      onClick={() => handleResultClick(medicamento)}
                    >
                      <div className="result-image">
                        {medicamento.imagenurl ? (
                          <img
                            src={medicamento.imagenurl}
                            alt={medicamento.nombre}
                          />
                        ) : (
                          <div className="result-image-placeholder">
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
                              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                              <line x1="3" y1="6" x2="21" y2="6"></line>
                              <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="result-info">
                        <h4 className="result-name">{medicamento.nombre}</h4>
                        <p className="result-description">
                          {medicamento.descripcion?.substring(0, 80)}
                          {medicamento.descripcion?.length > 80 ? '...' : ''}
                        </p>
                        <div className="result-meta">
                          {medicamento.categoria && (
                            <span className="result-category">
                              {medicamento.categoria}
                            </span>
                          )}
                          <span className="result-price">
                            {formatPrice(medicamento.precio)}
                          </span>
                        </div>
                      </div>

                      <div className="result-arrow">
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
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Overlay para móvil */}
        <div className="search-overlay" onClick={closeSearch}></div>
      </div>
    </>
  );
}

export default SearchBar;