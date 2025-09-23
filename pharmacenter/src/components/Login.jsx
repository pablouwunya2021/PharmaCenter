import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Si ya hay sesión, no muestres el login
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) navigate('/', { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Por favor ingresa un correo válido';

    if (!formData.password.trim()) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Limpiar errores anteriores

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: formData.email,
          contrasena: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        // Guardar el token y el usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-update'));
        alert(`¡Bienvenido ${data.user?.nombre || ''}!`);
        // 👉 Siempre regresar al Home. El botón "Inventario" en el Header llevará al panel admin si el rol es admin
        navigate('/', { replace: true });
      } else {
        setErrors({ general: data.message || 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setErrors({ general: 'Error de conexión. Verifica que el servidor esté funcionando.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4ebfa',
        fontFamily: 'Montserrat, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        style={{
          backgroundColor: '#d1b3f0',
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 
            style={{
              color: '#5c3c92',
              fontWeight: '300',
              fontSize: '28px',
              margin: '0 0 10px 0'
            }}
          >
            Login Administrativo
          </h2>
          <p style={{ color: '#70589a', fontWeight: '100', fontSize: '16px', margin: 0 }}>
            Farmacia Bethesda
          </p>
        </div>

        {/* (Opcional) Credenciales demo */}
        <div 
          style={{
            backgroundColor: '#e8f5e8',
            border: '1px solid #4caf50',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          <strong style={{ color: '#2e7d32' }}>Credenciales de prueba:</strong>
          <br />
          <strong>Admin:</strong> admin@pharmacenter.com / admin123
          <br />
          <strong>Usuario:</strong> ana.torres@email.com / ana123
        </div>

        {/* Errores generales */}
        {errors.general && (
          <div 
            style={{
              backgroundColor: '#ffebee',
              border: '1px solid #e57373',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}
          >
            {errors.general}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              style={{
                width: '100%',
                padding: '15px',
                border: errors.email ? '2px solid #e57373' : '2px solid transparent',
                borderRadius: '10px',
                backgroundColor: errors.email ? '#ffebee' : '#c6a0f0',
                color: '#5c3c92',
                fontSize: '16px',
                fontFamily: 'Montserrat, sans-serif',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => { e.target.style.backgroundColor = '#b896e8'; }}
              onBlur={(e) => { e.target.style.backgroundColor = errors.email ? '#ffebee' : '#c6a0f0'; }}
            />
            {errors.email && (
              <p style={{ color: '#c62828', fontSize: '12px', margin: '5px 0 0 0' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '25px' }}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              style={{
                width: '100%',
                padding: '15px',
                border: errors.password ? '2px solid #e57373' : '2px solid transparent',
                borderRadius: '10px',
                backgroundColor: errors.password ? '#ffebee' : '#c6a0f0',
                color: '#5c3c92',
                fontSize: '16px',
                fontFamily: 'Montserrat, sans-serif',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => { e.target.style.backgroundColor = '#b896e8'; }}
              onBlur={(e) => { e.target.style.backgroundColor = errors.password ? '#ffebee' : '#c6a0f0'; }}
            />
            {errors.password && (
              <p style={{ color: '#c62828', fontSize: '12px', margin: '5px 0 0 0' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: isLoading ? '#9e9e9e' : '#5c3c92',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <p style={{ color: '#70589a', fontSize: '14px', margin: 0 }}>
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#5c3c92',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px'
              }}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
