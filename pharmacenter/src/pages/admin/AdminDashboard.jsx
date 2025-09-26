import React from "react";
import { useNavigate } from "react-router-dom";

const cardStyle = {
  display:'flex', alignItems:'center', gap:14,
  padding:'18px 20px', borderRadius:16, border:0,
  background:'#fff', cursor:'pointer', textAlign:'left',
  boxShadow:'0 10px 25px rgba(92,60,146,.18)', width:'100%'
};

const iconStyle = {
  width:44, height:44, borderRadius:12, display:'grid', placeItems:'center',
  color:'#fff', background:'linear-gradient(135deg,#8e6bff,#caa9ff)'
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h1 style={{ color:'#4a2c75', fontWeight:800, marginBottom:8 }}>Bienvenido al Panel</h1>
      <p style={{ color:'#6b5b95', marginBottom:18 }}>Selecciona una opción para continuar.</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {/* Inventario */}
        <button type="button" onClick={() => navigate('/admin/inventory')} style={cardStyle}>
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

        {/* Usuarios */}
        <button type="button" onClick={() => navigate('/admin/users')} style={cardStyle}>
          <span style={iconStyle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 11c1.933 0 3.5-1.567 3.5-3.5S17.933 4 16 4s-3.5 1.567-3.5 3.5S14.067 11 16 11zm-8 0c1.933 0 3.5-1.567 3.5-3.5S9.933 4 8 4 4.5 5.567 4.5 7.5 6.067 11 8 11zm0 2c-2.667 0-8 1.333-8 4v1h10v-1c0-1.333.667-2.333 1.667-3.167C10.6 12.9 9.3 13 8 13zm8 0c-.836 0-1.63.083-2.356.235C15.49 14.208 16 15.263 16 16.5v1.5h8v-1c0-2.667-5.333-4-8-4z"/>
            </svg>
          </span>
          <div>
            <div style={{ fontWeight:800, color:'#3b2a63' }}>Usuarios</div>
            <div style={{ color:'#6b5b95', fontSize:14 }}>Crear, listar, editar y eliminar (placeholder)</div>
          </div>
          <span style={{ marginLeft:'auto', color:'#5c3c92', fontWeight:900, fontSize:20 }}>→</span>
        </button>
      </div>
    </section>
  );
};

export default AdminDashboard;
