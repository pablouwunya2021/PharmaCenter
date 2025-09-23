import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h1 style={{ color:'#4a2c75', fontWeight:800, marginBottom:8 }}>Bienvenido al Panel</h1>
      <p style={{ color:'#6b5b95', marginBottom:18 }}>Selecciona una opción para continuar.</p>

      <button
        type="button"
        onClick={() => navigate('/admin/inventory')}
        style={{
          display:'flex', alignItems:'center', gap:14,
          padding:'18px 20px', borderRadius:16, border:0,
          background:'#fff', cursor:'pointer', textAlign:'left',
          boxShadow:'0 10px 25px rgba(92,60,146,.18)'
        }}
      >
        <span style={{ width:44, height:44, borderRadius:12, display:'grid', placeItems:'center',
                       color:'#fff', background:'linear-gradient(135deg,#8e6bff,#caa9ff)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 7l9-4 9 4v10l-9 4-9-4V7zm9 2l-7-3.111V16l7 3.111L19 16V5.889L12 9z" fill="currentColor"/>
          </svg>
        </span>
        <div>
          <div style={{ fontWeight:800, color:'#3b2a63' }}>Inventario</div>
          <div style={{ color:'#6b5b95', fontSize:14 }}>Gestiona productos, stock y precios</div>
        </div>
        <span style={{ marginLeft:'auto', color:'#5c3c92', fontWeight:900, fontSize:20 }}>→</span>
      </button>
    </section>
  );
};

export default AdminDashboard;
