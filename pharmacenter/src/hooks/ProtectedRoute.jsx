import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth'; // Tu hook existente

// Componente para proteger rutas que requieren estar logueado
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#6b5b95'
      }}>
        Verificando acceso...
      </div>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Componente para proteger rutas que requieren ser admin
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#6b5b95'
      }}>
        Verificando permisos...
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Componente para mostrar mensaje de acceso denegado
export const AccessDenied = ({ message = "No tienes permisos para acceder a esta sección." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px'
      }}>
        🔒
      </div>
      <h2 style={{
        color: '#ef4444',
        marginBottom: '8px'
      }}>
        Acceso Denegado
      </h2>
      <p style={{
        color: '#6b5b95',
        marginBottom: '24px',
        maxWidth: '400px'
      }}>
        {message}
      </p>
      <button
        onClick={() => window.history.back()}
        style={{
          padding: '12px 24px',
          backgroundColor: '#8e6bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Volver
      </button>
    </div>
  );
};