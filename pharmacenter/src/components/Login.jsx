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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4ebfa] font-sans flex items-center justify-center p-5">
      <div className="bg-[#d1b3f0] w-full max-w-md p-10 rounded-2xl shadow-xl relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[#5c3c92] font-light text-2xl mb-2">Login Administrativo</h2>
          <p className="text-[#70589a] font-thin text-base m-0">Farmacia Bethesda</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-400 text-red-800 px-4 py-3 rounded mb-5 text-sm">
              {errors.general}
            </div>
          )}

          {/* Campo Email */}
          <div className="mb-5">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className={`w-full p-4 rounded-xl text-[#5c3c92] text-base font-sans outline-none transition-all border-2 ${
                errors.email
                  ? 'border-[#e57373] bg-red-50'
                  : 'border-transparent bg-[#c6a0f0] focus:bg-[#b896e8]'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              autoComplete="username"
            />
            {errors.email && (
              <p className="text-[#c62828] text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="mb-6">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className={`w-full p-4 rounded-xl text-[#5c3c92] text-base font-sans outline-none transition-all border-2 ${
                errors.password
                  ? 'border-[#e57373] bg-red-50'
                  : 'border-transparent bg-[#c6a0f0] focus:bg-[#b896e8]'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-[#c62828] text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Botón de Login */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-4 rounded-xl text-white font-medium text-base font-sans transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#5c3c92] hover:bg-[#4a2c75] active:translate-y-0.5'
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                ></span>
                Iniciando sesión...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[#70589a] text-sm m-0">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="bg-none border-none text-[#5c3c92] underline cursor-pointer font-sans text-sm p-0"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              type="button"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>

      {/* Prueba Tailwind - Clase Notoria */}
      <div className="bg-red-500">
        Prueba Tailwind
      </div>
    </div>
  );
};

export default Login;
