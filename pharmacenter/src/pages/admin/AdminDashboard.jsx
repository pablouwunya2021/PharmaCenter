import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Ajusta esta ruta según tu estructura

const cardStyle = {
  display:'flex', alignItems:'center', gap:14,
  padding:'18px 20px', borderRadius:16, border:0,
  background:'#fff', cursor:'pointer', textAlign:'left',
  boxShadow:'0 10px 25px rgba(92,60,146,.18)', width:'100%'
};

const cardStyleDisabled = {
  ...cardStyle,
  background:'#f8f9fa',
  cursor:'not-allowed',
  opacity: 0.6,
  boxShadow:'0 5px 15px rgba(92,60,146,.08)'
};

const iconStyle = {
  width:44, height:44, borderRadius:12, display:'grid', placeItems:'center',
  color:'#fff', background:'linear-gradient(135deg,#8e6bff,#caa9ff)'
};

const iconStyleDisabled = {
  ...iconStyle,
  background:'linear-gradient(135deg,#9ca3af,#d1d5db)'
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin } = useAuth();

  const handleUserManagementClick = () => {
    if (isAdmin()) {
      navigate('/admin/users');
    } else {
      alert('Acceso denegado: Solo los administradores pueden gestionar usuarios.');
    }
  };

  // Si está cargando, mostrar loading
  if (isLoading) {
    return (
      <section>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          color: '#6b5b95'
        }}>
          Cargando...
        </div>
      </section>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    navigate('/login');
    return null;
  }

  const userIsAdmin = isAdmin();

  return (
    <section>
      <h1 
        style={{ 
          color:'#4a2c75', 
          fontWeight:800, 
          marginBottom: 8,
          cursor:'pointer',
          textDecoration:'none',
          transition:'color 0.2s ease'
        }}
        onClick={() => navigate('/')}
        onMouseEnter={(e) => e.target.style.color = '#6b21a8'}
        onMouseLeave={(e) => e.target.style.color = '#4a2c75'}
        title="Ir al inicio"
      >
        Bienvenido al Panel
      </h1>
      <p style={{ color:'#6b5b95', marginBottom:18 }}>
        Hola {user.nombre}, selecciona una opción para continuar.
        {!userIsAdmin && (
          <span style={{ fontSize: 14, fontStyle: 'italic' }}>
            {" "}(Algunas opciones requieren permisos de administrador)
          </span>
        )}
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {/* Inventario - Disponible para todos */}
        <button 
          type="button" 
          onClick={() => navigate('/admin/inventory')} 
          style={cardStyle}
        >
          <span style={iconStyle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 7l9-4 9 4v10l-9 4-9-4V7zm9 2l-7-3.111V16l7 3.111L19 16V5.889L12 9z"/>
            </svg>
          </span>
          <div>
            <div style={{ fontWeight:800, color:'#3b2a63' }}>Inventario</div>
            <div style={{ color:'#6b5b95', fontSize:14 }}>Gestiona productos, stock y precios</div>
          </div>
          <span style={{ marginLeft:'auto', color:'#5c3c92', fontWeight:900, fontSize:20 }}>→</span>
        </button>

        {/* Usuarios - Solo para administradores */}
        <button 
          type="button" 
          onClick={handleUserManagementClick}
          style={userIsAdmin ? cardStyle : cardStyleDisabled}
          disabled={!userIsAdmin}
          title={!userIsAdmin ? "Requiere permisos de administrador" : "Gestionar usuarios"}
        >
          <span style={userIsAdmin ? iconStyle : iconStyleDisabled}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 11c1.933 0 3.5-1.567 3.5-3.5S17.933 4 16 4s-3.5 1.567-3.5 3.5S14.067 11 16 11zm-8 0c1.933 0 3.5-1.567 3.5-3.5S9.933 4 8 4 4.5 5.567 4.5 7.5 6.067 11 8 11zm0 2c-2.667 0-8 1.333-8 4v1h10v-1c0-1.333.667-2.333 1.667-3.167C10.6 12.9 9.3 13 8 13zm8 0c-.836 0-1.63.083-2.356.235C15.49 14.208 16 15.263 16 16.5v1.5h8v-1c0-2.667-5.333-4-8-4z"/>
            </svg>
          </span>
          <div>
            <div style={{ fontWeight:800, color: userIsAdmin ? '#3b2a63' : '#9ca3af' }}>
              Usuarios
              {!userIsAdmin && (
                <span style={{ 
                  fontSize: 12, 
                  fontWeight: 400, 
                  color: '#ef4444',
                  marginLeft: 8
                }}>
                  Solo Admin
                </span>
              )}
            </div>
            <div style={{ color: userIsAdmin ? '#6b5b95' : '#9ca3af', fontSize:14 }}>
              {userIsAdmin 
                ? 'Crear, listar, editar y eliminar usuarios' 
                : 'Requiere permisos de administrador'
              }
            </div>
          </div>
          <span style={{ 
            marginLeft:'auto', 
            color: userIsAdmin ? '#5c3c92' : '#9ca3af', 
            fontWeight:900, 
            fontSize:20 
          }}>
            {userIsAdmin ? '→' : '🔒'}
          </span>
        </button>

        {/* Reportes - Solo para administradores */}
        {userIsAdmin && (
          <button 
            type="button" 
            onClick={() => navigate('/admin/reports')} 
            style={cardStyle}
          >
            <span style={iconStyle}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </span>
            <div>
              <div style={{ fontWeight:800, color:'#3b2a63' }}>
                Reportes
                <span style={{ 
                  fontSize: 12, 
                  fontWeight: 400, 
                  color: '#10b981',
                  marginLeft: 8
                }}>
                  Admin
                </span>
              </div>
              <div style={{ color:'#6b5b95', fontSize:14 }}>Estadísticas y reportes del sistema</div>
            </div>
            <span style={{ marginLeft:'auto', color:'#5c3c92', fontWeight:900, fontSize:20 }}>→</span>
          </button>
        )}
      </div>

      {/* Información para usuarios no admin */}
      {!userIsAdmin && (
        <div style={{
          marginTop: 24,
          padding: 16,
          background: '#fef3cd',
          border: '1px solid #fbbf24',
          borderRadius: 12,
          color: '#92400e'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Acceso Limitado
          </div>
          <div style={{ fontSize: 14 }}>
            Tu cuenta ({user.rol}) tiene permisos limitados. Contacta a un administrador si necesitas acceso a funciones adicionales.
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;