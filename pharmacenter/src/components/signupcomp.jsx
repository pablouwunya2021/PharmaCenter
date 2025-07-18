import { useState } from 'react';

const SignupComp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Datos del formulario:', formData);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Crear Cuenta</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre de Usuario
          </label>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Tu nombre de usuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Correo Electrónico
          </label>
          <input
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Tu contraseña"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirmar Contraseña
          </label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Confirma tu contraseña"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default SignupComp;