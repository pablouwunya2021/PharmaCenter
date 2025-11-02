import { useState } from "react";

function FacturacionPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos de facturación:", formData);
    alert("Formulario enviado. TODO: Guardar y generar factura");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Datos de Facturación</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        
        <input 
          type="text" 
          name="nombre" 
          placeholder="Nombre completo" 
          value={formData.nombre}
          onChange={handleChange}
        />
        
        <input 
          type="text" 
          name="direccion" 
          placeholder="Dirección" 
          value={formData.direccion}
          onChange={handleChange}
        />

        <input 
          type="text" 
          name="telefono" 
          placeholder="Teléfono" 
          value={formData.telefono}
          onChange={handleChange}
        />

        <input 
          type="email" 
          name="email" 
          placeholder="Correo electrónico" 
          value={formData.email}
          onChange={handleChange}
        />

        <button type="submit">Continuar</button>
      </form>
    </div>
  );
}

export default FacturacionPage;
