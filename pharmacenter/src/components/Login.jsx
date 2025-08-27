import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo válido';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Temporal: Verificación de credenciales hardcodeadas
    if (formData.email === 'pharma@gmail.com' && formData.password === 'hola123') {
      // Simulamos el almacenamiento de un token dummy
      localStorage.setItem('token', 'dummy_token');
      alert('¡Inicio de sesión exitoso!');
      navigate('/inventory');
    } else {
      setErrors({ general: 'Credenciales incorrectas' });
    }

    /* Comentado temporalmente: Llamada a la API original
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: formData.email,
          contrasena: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // ✅ Aquí guardamos el token JWT recibido en localStorage o sessionStorage
        localStorage.setItem('token', data.token);

        alert('¡Inicio de sesión exitoso!');
        // Aquí podrías navegar a la ruta protegida
        navigate('/inventory');
      } else {
        // En caso de error, mostramos el mensaje que venga del backend o uno por defecto
        setErrors({ general: data.message || 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
    }
    */

    setIsLoading(false); // Movido fuera del finally para que funcione con la lógica temporal
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

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Error general */}
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

          {/* Campo Email */}
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
              onFocus={(e) => {
                e.target.style.backgroundColor = '#b896e8';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = errors.email ? '#ffebee' : '#c6a0f0';
              }}
            />
            {errors.email && (
              <p style={{ color: '#c62828', fontSize: '12px', margin: '5px 0 0 0' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
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
              onFocus={(e) => {
                e.target.style.backgroundColor = '#b896e8';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = errors.password ? '#ffebee' : '#c6a0f0';
              }}
            />
            {errors.password && (
              <p style={{ color: '#c62828', fontSize: '12px', margin: '5px 0 0 0' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Botón de Login */}
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
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#4a2c75';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#5c3c92';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span 
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}
                ></span>
                Iniciando sesión...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
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

      {/* CSS para animación del spinner */}
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