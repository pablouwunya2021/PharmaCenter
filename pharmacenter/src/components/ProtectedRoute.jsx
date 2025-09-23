import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // Verificar si hay token
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  
  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin, verificar el rol
  if (requireAdmin && userString) {
    try {
      const user = JSON.parse(userString);
      if (user.rol !== 'admin') {
        // Si no es admin, redirigir a una página de acceso denegado o al dashboard normal
        alert('Acceso denegado: Se requieren permisos de administrador');
        return <Navigate to="/inventory" replace />;
      }
    } catch (error) {
      console.error('Error al parsear datos del usuario:', error);
      // Si hay error, limpiar datos y redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  }

  // Si todo está bien, mostrar el componente
  return children;
};

export default ProtectedRoute;