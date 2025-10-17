import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const UsersCrud = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Cargar usuarios (SIN TOKEN)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/usuarios/public/list`);

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();
      setUsers(data.success ? data.data : []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario (SIN TOKEN)
  const handleDelete = async (userId, userName, userRole) => {
    // Prevenir eliminación de administradores desde el frontend también
    if (userRole === 'admin') {
      alert('No puedes eliminar usuarios administradores.');
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar al usuario "${userName}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(userId);

      const response = await fetch(`${API_BASE}/api/usuarios/public/delete/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar usuario');
      }

      // Actualizar lista de usuarios
      setUsers(users.filter(u => u.idusuario !== userId));
      alert('Usuario eliminado exitosamente');
    } catch (err) {
      alert(`Error al eliminar usuario: ${err.message}`);
      console.error('Error deleting user:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para obtener badge de rol
  const getRoleBadge = (rol) => {
    const isAdmin = rol === 'admin';
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        background: isAdmin ? '#dbeafe' : '#f3e8ff',
        color: isAdmin ? '#1e40af' : '#6b21a8'
      }}>
        {isAdmin ? '👑 Admin' : '👤 Usuario'}
      </span>
    );
  };

  if (loading) {
    return (
      <section style={{ padding: 20 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 300,
          color: '#6b5b95'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
            <div>Cargando usuarios...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: 20 }}>
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#4a2c75', marginBottom: 8 }}>
            Gestión de Usuarios
          </h2>
          <p style={{ margin: 0, color: '#6b5b95', fontSize: 14 }}>
            {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''} en el sistema
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            style={{ 
              background: '#fff',
              color: '#6b46c1', 
              border: '2px solid #6b46c1',
              padding: '10px 18px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            ← Volver al Panel
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/users/create')}
            style={{ 
              background: '#6b46c1',
              color: '#fff',
              border: 0,
              padding: '10px 18px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            + Nuevo Usuario
          </button>
        </div>
      </header>

      {/* Advertencia de seguridad */}
      <div style={{
        padding: 16,
        background: '#fee2e2',
        border: '2px solid #ef4444',
        borderRadius: 12,
        marginBottom: 20,
        color: '#991b1b'
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 16 }}>
          ⚠️ ADVERTENCIA DE SEGURIDAD
        </div>
        <div style={{ fontSize: 14 }}>
          Este endpoint NO tiene protección JWT. Cualquiera puede acceder y eliminar usuarios. 
          <strong> Solo usar en desarrollo. DEBE ser eliminado en producción.</strong>
        </div>
      </div>

      {error && (
        <div style={{
          padding: 16,
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: 12,
          color: '#c00',
          marginBottom: 20
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!error && users.length === 0 && (
        <div style={{
          padding: 40,
          background: '#fff',
          borderRadius: 12,
          textAlign: 'center',
          color: '#6b5b95'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            No hay usuarios registrados
          </div>
          <div style={{ fontSize: 14 }}>
            Crea el primer usuario para comenzar
          </div>
        </div>
      )}

      {!error && users.length > 0 && (
        <div style={{ 
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          {/* Tabla de usuarios */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff'
                }}>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 600 }}>Nombre</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 600 }}>Correo</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 600 }}>Rol</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 600 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const isAdmin = user.rol === 'admin';
                  return (
                    <tr 
                      key={user.idusuario}
                      style={{ 
                        borderBottom: '1px solid #e6e6f2',
                        background: index % 2 === 0 ? '#fff' : '#fafafa',
                        transition: 'background 0.2s'
                      }}
                    >
                      <td style={{ padding: '16px 20px', color: '#6b5b95', fontWeight: 600 }}>
                        #{user.idusuario}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#3b2a63', fontWeight: 500 }}>
                        {user.nombre}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#6b5b95' }}>
                        {user.correo}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {getRoleBadge(user.rol)}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          <button
                            onClick={() => navigate(`/admin/users/edit/${user.idusuario}`)}
                            disabled={deletingId === user.idusuario}
                            style={{
                              padding: '8px 16px',
                              borderRadius: 8,
                              border: '1px solid #e6e6f2',
                              background: '#fff',
                              color: '#6b46c1',
                              cursor: 'pointer',
                              fontWeight: 500,
                              transition: 'all 0.2s',
                              opacity: deletingId === user.idusuario ? 0.5 : 1
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(user.idusuario, user.nombre, user.rol)}
                            disabled={deletingId === user.idusuario || isAdmin}
                            style={{
                              padding: '8px 16px',
                              borderRadius: 8,
                              border: '1px solid #ffe6e6',
                              background: deletingId === user.idusuario ? '#fcc' : '#fff',
                              color: isAdmin ? '#9ca3af' : '#c53030',
                              cursor: (deletingId === user.idusuario || isAdmin) ? 'not-allowed' : 'pointer',
                              fontWeight: 500,
                              transition: 'all 0.2s',
                              opacity: (deletingId === user.idusuario || isAdmin) ? 0.5 : 1
                            }}
                            title={isAdmin ? 'No se pueden eliminar administradores' : 'Eliminar usuario'}
                          >
                            {deletingId === user.idusuario ? '⏳ Eliminando...' : 
                             isAdmin ? '🔒 Protegido' : '🗑️ Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer con información */}
          <div style={{
            padding: 16,
            background: '#fafafa',
            borderTop: '1px solid #e6e6f2',
            fontSize: 14,
            color: '#6b5b95',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              Total de usuarios: <strong>{users.length}</strong>
            </div>
            <div>
              Administradores: <strong>{users.filter(u => u.rol === 'admin').length}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Información importante */}
      <div style={{
        marginTop: 20,
        padding: 16,
        background: '#fef3cd',
        border: '1px solid #fbbf24',
        borderRadius: 12,
        fontSize: 14,
        color: '#92400e'
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>
          ℹ️ Información Importante
        </div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Los usuarios administradores NO pueden ser eliminados</li>
          <li>La eliminación de usuarios es permanente y no se puede deshacer</li>
          <li>Los usuarios regulares pueden ser eliminados sin restricciones</li>
        </ul>
      </div>
    </section>
  );
};

export default UsersCrud;
