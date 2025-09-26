import React from 'react';
import { useNavigate } from 'react-router-dom';

const UsersCrud = () => {
  const navigate = useNavigate();

  return (
    <section style={{ padding: 20 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: '#4a2c75' }}>CRUD de Usuarios</h2>
          <p style={{ margin: 0, color: '#6b5b95' }}>Página de administración para crear, listar, editar y eliminar usuarios (placeholder).</p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/users/create')}
            style={{ background: '#6b46c1', color: '#fff', border: 0, padding: '10px 14px', borderRadius: 8 }}
          >
            + Nuevo usuario
          </button>
        </div>
      </header>

      <main>
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
          <p style={{ color: '#6b5b95' }}>Aquí irá la tabla/listado de usuarios. Aún no implementado.</p>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e6e6f2', background: '#fff' }}>Editar (placeholder)</button>
            <button style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ffe6e6', background: '#fff', color: '#c53030' }}>Eliminar (placeholder)</button>
          </div>
        </div>
      </main>
    </section>
  );
};

export default UsersCrud;
