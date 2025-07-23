import { useState } from 'react';

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const SignupComp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'El correo debe contener @';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerido';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Datos del formulario:', formData);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-96 p-8 bg-white bg-opacity-90 rounded-3xl shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">Crear Usuario</h2>
        
        <div className="space-y-4">
          <div>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-purple-50 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.username ? 'focus:ring-red-300 bg-red-50' : 'focus:ring-purple-300'
              }`}
              placeholder="Nombre de usuario"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-purple-50 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.email ? 'focus:ring-red-300 bg-red-50' : 'focus:ring-purple-300'
              }`}
              placeholder="Correo electrónico"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 bg-purple-50 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.password ? 'focus:ring-red-300 bg-red-50' : 'focus:ring-purple-300'
                }`}
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 bg-purple-50 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'focus:ring-red-300 bg-red-50' : 'focus:ring-purple-300'
                }`}
                placeholder="Confirmar contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200 font-medium mt-6"
          >
            Crear Usuario
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupComp;