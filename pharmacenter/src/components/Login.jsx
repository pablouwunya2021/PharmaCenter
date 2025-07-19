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
    // Limpiar errores cuando el usuario empieza a escribir
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
    
    try {
      // Simular llamada a la API
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

      if (data.success) {
        // Login exitoso
        alert('¡Inicio de sesión exitoso!');
        navigate('/'); // Redirigir al home
      } else {
        setErrors({ general: data.message || 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f4ebfa' }}>
      {/* Contenedor principal */}
      <div className="w-full max-w-md">
        {/* Tarjeta de login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-purple-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl text-white"
                style={{ backgroundColor: '#5c3c92' }}
              >
                🏥
              </div>
            </div>
            <h1 
              className="text-3xl font-light mb-2"
              style={{ color: '#5c3c92', fontFamily: 'Montserrat, sans-serif' }}
            >
              PharmaCenter
            </h1>
            <p className="text-gray-600 font-light">
              Acceso Administrativo
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Campo de Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: '#5c3c92' }}
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.email 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-purple-200 focus:ring-purple-200'
                }`}
                placeholder="tu@email.com"
                style={{ borderColor: errors.email ? '#ef4444' : '#d1b3f0' }}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Campo de Contraseña */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
                style={{ color: '#5c3c92' }}
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.password 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-purple-200 focus:ring-purple-200'
                }`}
                placeholder="Tu contraseña"
                style={{ borderColor: errors.password ? '#ef4444' : '#d1b3f0' }}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Checkbox Recordarme */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-purple-300 text-purple-600 focus:ring-purple-200"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Recordarme
                </span>
              </label>
              <button
                type="button"
                className="text-sm hover:underline"
                style={{ color: '#5c3c92' }}
                onClick={() => alert('Funcionalidad en desarrollo')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de Iniciar Sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg transform hover:scale-105'
              }`}
              style={{ 
                backgroundColor: '#5c3c92',
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="font-medium hover:underline"
                style={{ color: '#5c3c92' }}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Sistema seguro protegido con encriptación SSL
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
