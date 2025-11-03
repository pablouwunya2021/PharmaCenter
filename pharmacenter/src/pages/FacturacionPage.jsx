import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FacturacionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    nit: "",
    ciudad: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre completo es requerido";
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^\d{8}$/.test(formData.telefono.trim())) {
      newErrors.telefono = "El teléfono debe tener 8 dígitos";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulación de guardado (puedes conectar con tu API aquí)
    setTimeout(() => {
      console.log("Datos de facturación:", formData);
      localStorage.setItem("facturaData", JSON.stringify(formData));
      
      alert("✅ Datos de facturación guardados correctamente");
      setIsLoading(false);
      
      // Aquí puedes redirigir a la página de confirmación o resumen
      // navigate("/confirmacion");
    }, 1000);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f4ebfa 0%, #e8dff5 100%)",
      padding: isMobile ? "1rem" : "2rem",
      fontFamily: "'Montserrat', sans-serif"
    },
    card: {
      maxWidth: "650px",
      margin: "0 auto",
      background: "white",
      borderRadius: isMobile ? "15px" : "20px",
      boxShadow: "0 10px 40px rgba(92, 60, 146, 0.15)",
      overflow: "hidden"
    },
    header: {
      background: "linear-gradient(135deg, #5c3c92 0%, #7b68a2 100%)",
      padding: isMobile ? "1.5rem 1rem" : "2rem",
      color: "white",
      textAlign: "center"
    },
    title: {
      margin: "0 0 0.5rem 0",
      fontSize: isMobile ? "1.5rem" : "2rem",
      fontWeight: "300",
      letterSpacing: "-0.5px"
    },
    subtitle: {
      margin: "0",
      fontSize: isMobile ? "0.85rem" : "0.95rem",
      opacity: "0.9",
      fontWeight: "100"
    },
    formContainer: {
      padding: isMobile ? "1.5rem 1rem" : "2.5rem"
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: isMobile ? "1rem" : "1.5rem",
      marginBottom: isMobile ? "1rem" : "1.5rem"
    },
    formRowDouble: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "1rem" : "1.5rem",
      marginBottom: isMobile ? "1rem" : "1.5rem"
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column"
    },
    label: {
      marginBottom: "0.5rem",
      color: "#5c3c92",
      fontWeight: "500",
      fontSize: isMobile ? "0.85rem" : "0.9rem",
      display: "flex",
      alignItems: "center",
      gap: "0.3rem"
    },
    required: {
      color: "#e91e63",
      fontSize: "1.1rem"
    },
    input: {
      padding: isMobile ? "0.75rem 0.9rem" : "0.9rem 1rem",
      border: "2px solid #e0d4f0",
      borderRadius: isMobile ? "8px" : "10px",
      fontSize: isMobile ? "0.95rem" : "1rem",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
      outline: "none",
      backgroundColor: "#fafafa"
    },
    inputError: {
      borderColor: "#e91e63"
    },
    inputFocus: {
      borderColor: "#7b68a2",
      backgroundColor: "white",
      boxShadow: "0 0 0 3px rgba(123, 104, 162, 0.1)"
    },
    errorText: {
      color: "#e91e63",
      fontSize: "0.85rem",
      marginTop: "0.4rem",
      display: "flex",
      alignItems: "center",
      gap: "0.3rem"
    },
    buttonContainer: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "0.8rem" : "1rem",
      marginTop: isMobile ? "1.5rem" : "2rem",
      paddingTop: isMobile ? "1rem" : "1.5rem",
      borderTop: "1px solid #e0d4f0"
    },
    button: {
      flex: isMobile ? "unset" : "1",
      width: isMobile ? "100%" : "auto",
      padding: isMobile ? "0.9rem 1.5rem" : "1rem 2rem",
      border: "none",
      borderRadius: isMobile ? "8px" : "10px",
      fontSize: isMobile ? "0.95rem" : "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem"
    },
    buttonPrimary: {
      background: "linear-gradient(135deg, #5c3c92 0%, #7b68a2 100%)",
      color: "white",
      boxShadow: "0 4px 15px rgba(92, 60, 146, 0.3)"
    },
    buttonSecondary: {
      background: "white",
      color: "#5c3c92",
      border: "2px solid #7b68a2"
    },
    infoBox: {
      background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
      border: "1px solid #4caf50",
      borderRadius: isMobile ? "8px" : "10px",
      padding: isMobile ? "0.9rem 1rem" : "1rem 1.2rem",
      marginBottom: isMobile ? "1rem" : "1.5rem",
      fontSize: isMobile ? "0.85rem" : "0.9rem",
      color: "#2e7d32",
      display: "flex",
      alignItems: "start",
      gap: "0.8rem"
    },
    iconWrapper: {
      fontSize: isMobile ? "1.1rem" : "1.3rem",
      marginTop: "0.1rem",
      flexShrink: 0
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Datos de Facturación</h1>
          <p style={styles.subtitle}>Complete la información para generar su factura</p>
        </div>

        {/* Form */}
        <div style={styles.formContainer}>
          {/* Info Box */}
          <div style={styles.infoBox}>
            <span style={styles.iconWrapper}>ℹ️</span>
            <div>
              <strong>Importante:</strong> Asegúrese de ingresar los datos correctamente. 
              Esta información será utilizada para generar su factura electrónica.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Nombre Completo */}
            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  👤 Nombre completo
                  <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Juan Carlos Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.nombre ? styles.inputError : {})
                  }}
                />
                {errors.nombre && (
                  <span style={styles.errorText}>
                    ⚠️ {errors.nombre}
                  </span>
                )}
              </div>
            </div>

            {/* Email y Teléfono */}
            <div style={styles.formRowDouble}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  📧 Correo electrónico
                  <span style={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : {})
                  }}
                />
                {errors.email && (
                  <span style={styles.errorText}>
                    ⚠️ {errors.email}
                  </span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  📱 Teléfono
                  <span style={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="12345678"
                  value={formData.telefono}
                  onChange={handleChange}
                  maxLength="8"
                  style={{
                    ...styles.input,
                    ...(errors.telefono ? styles.inputError : {})
                  }}
                />
                {errors.telefono && (
                  <span style={styles.errorText}>
                    ⚠️ {errors.telefono}
                  </span>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  📍 Dirección completa
                  <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Ej: Zona 10, Ciudad de Guatemala"
                  value={formData.direccion}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.direccion ? styles.inputError : {})
                  }}
                />
                {errors.direccion && (
                  <span style={styles.errorText}>
                    ⚠️ {errors.direccion}
                  </span>
                )}
              </div>
            </div>

            {/* NIT y Ciudad (Opcionales) */}
            <div style={styles.formRowDouble}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  🏢 NIT (opcional)
                </label>
                <input
                  type="text"
                  name="nit"
                  placeholder="12345678-9"
                  value={formData.nit}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  🌆 Ciudad (opcional)
                </label>
                <input
                  type="text"
                  name="ciudad"
                  placeholder="Guatemala"
                  value={formData.ciudad}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Botones */}
            <div style={styles.buttonContainer}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f4ebfa";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                ← Regresar
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer"
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(92, 60, 146, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(92, 60, 146, 0.3)";
                }}
              >
                {isLoading ? "Procesando..." : "Continuar →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FacturacionPage;
