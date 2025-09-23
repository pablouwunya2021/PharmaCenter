import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const SignupComp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validaciones cliente
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

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

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerido';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      setServerMessage('');

      // Llamada al backend actualizada
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.username,
          correo: formData.email,
          contrasena: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Error desde backend
        setServerMessage(data.message || 'Error al crear usuario');
      } else {
        // Éxito - el backend ya devuelve un token automáticamente
        if (data.success && data.token) {
          // Guardar token y datos del usuario
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          setServerMessage(`¡Usuario creado exitosamente! Bienvenido ${data.user.nombre}`);
          
          // Redirigir después de 1.5 segundos
          setTimeout(() => {
            if (data.user.rol === 'admin') {
              navigate('/inventory');
            } else {
              navigate('/');
            }
          }, 1500);
        } else {
          setServerMessage('Usuario creado exitosamente. Ahora puedes iniciar sesión.');
          setTimeout(() => navigate('/login'), 1500);
        }
      }
    } catch (err) {
      console.error('Error en signup:', err);
      setServerMessage('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2 className="signup-title">Crear Usuario</h2>

        {/* Información sobre registro */}
        <div 
          style={{
            backgroundColor: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#1976d2'
          }}
        >
          <strong>Información:</strong> Los nuevos usuarios se registran con rol de usuario normal. Solo los administradores pueden crear otros administradores.
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="Nombre de usuario"
            />
            {errors.username && <div className="error-message"><span>⚠️</span>{errors.username}</div>}
          </div>

          <div className="form-group">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Correo electrónico"
            />
            {errors.email && <div className="error-message"><span>⚠️</span>{errors.email}</div>}
          </div>

          <div className="form-group">
            <div className="password-container">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`form-input password-input ${errors.password ? 'error' : ''}`}
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <div className="error-message"><span>⚠️</span>{errors.password}</div>}
          </div>

          <div className="form-group">
            <div className="password-container">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input password-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirmar contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && <div className="error-message"><span>⚠️</span>{errors.confirmPassword}</div>}
          </div>

          {/* Mensaje del backend */}
          {serverMessage && (
            <div 
              className="server-message"
              style={{
                backgroundColor: serverMessage.includes('exitosamente') ? '#e8f5e8' : '#ffebee',
                border: serverMessage.includes('exitosamente') ? '1px solid #4caf50' : '1px solid #e57373',
                color: serverMessage.includes('exitosamente') ? '#2e7d32' : '#c62828',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}
            >
              {serverMessage}
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Usuario'}
          </button>
        </form>

        {/* Link al login */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#5c3c92',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupComp;