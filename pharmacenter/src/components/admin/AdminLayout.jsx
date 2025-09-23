import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const IconBox = ({ color = '#7c56c6' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="4" fill={color} fillOpacity="0.18"/>
    <path d="M7 12h10M7 8h10M7 16h10" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconInventory = ({ color = '#7c56c6' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 3v4M16 3v4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconLogout = ({ color = '#fff' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M16 17l5-5-5-5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminLayout = () => {
  const [logoutHover, setLogoutHover] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 12,
    textDecoration: 'none',
    color: isActive ? '#5c3c92' : '#ffffffee',
    background: isActive ? 'linear-gradient(90deg,#ffffff,#ffffff22)' : 'transparent',
    boxShadow: isActive ? '0 8px 20px rgba(92,60,146,0.12)' : 'none',
    border: isActive ? '1px solid rgba(0,0,0,0.04)' : '1px solid transparent',
    transition: 'all .18s ease-in-out',
    fontWeight: isActive ? 600 : 500,
  });

  const asideStyle = {
    background: 'linear-gradient(160deg,#c7a8f4,#a78be2)',
    padding: '22px 16px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100vh',
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'100vh', background:'#f4ebfa', fontFamily:'Montserrat, sans-serif' }}>
      <aside style={asideStyle}>
        <div>
          <div style={{ fontSize:20, fontWeight:700, marginBottom:18 }}>Admin · Bethesda</div>

          <nav style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <NavLink to="/admin" end style={linkStyle}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.18)' }}>
                  <IconBox color="#6e49b3" />
                </div>
                <div>Dashboard</div>
              </div>
            </NavLink>

            <NavLink to="/admin/inventory" style={linkStyle}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.12)' }}>
                  <IconInventory color="#6e49b3" />
                </div>
                <div>Inventario</div>
              </div>
            </NavLink>
          </nav>
        </div>

        <div style={{ marginTop:18 }}>
          <button
            onClick={logout}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            style={{
              width:'100%',
              padding:'12px 14px',
              borderRadius:12,
              border: logoutHover ? '1px solid rgba(255,110,110,0.18)' : '1px solid rgba(255,255,255,0.14)',
              background: logoutHover ? 'linear-gradient(90deg, rgba(255,110,110,0.12), rgba(255,90,90,0.06))' : 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
              color:'#fff',
              cursor:'pointer',
              display:'flex',
              gap:10,
              alignItems:'center',
              justifyContent:'center',
              boxShadow: logoutHover ? '0 8px 20px rgba(255,110,110,0.06)' : '0 6px 18px rgba(0,0,0,0.06)',
              transition:'transform .12s ease, box-shadow .12s ease, background .12s ease, border .12s ease'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'translateY(1px)'}
            onMouseUp={e => e.currentTarget.style.transform = 'none'}
          >
            <IconLogout color={logoutHover ? '#ff6b6b' : undefined} />
            <span style={{ fontWeight:600 }}>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main>
        <div style={{ height:60, background:'rgba(209,179,240,.65)', display:'flex', alignItems:'center', padding:'0 22px', position:'sticky', top:0 }}>
          <span style={{ color:'#4a2c75', fontWeight:600 }}>Panel Administrativo</span>
        </div>
        <div style={{ padding:24 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
