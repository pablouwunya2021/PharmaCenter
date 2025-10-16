import React, { useState } from "react";
import "../styles/Inventory.css"; // Reutilizamos las animaciones y estilos base

const AdsManager = () => {
  const [ads, setAds] = useState([
    {
      idpublicidad: 1,
      titulo: "Descuento Medicamentos Básicos",
      descripcion: "15% de descuento en medicamentos esenciales",
      tipo_publicidad: "descuento",
      fecha_inicio: "2025-10-01",
      fecha_fin: "2025-10-31",
      descuento_porcentaje: 15.0,
      codigo_promocional: "BASICOS15",
      activo: true,
      posicion: 1,
      imagen_url: "https://via.placeholder.com/120x70.png?text=Promo+1",
      url_enlace: "https://pharmacenter.com/promos/basicos",
    },
    {
      idpublicidad: 2,
      titulo: "Campaña Vacunación",
      descripcion: "Campaña informativa de vacunación gratuita",
      tipo_publicidad: "informativa",
      fecha_inicio: "2025-09-15",
      fecha_fin: "2025-12-31",
      activo: true,
      posicion: 2,
      imagen_url: "https://via.placeholder.com/120x70.png?text=Vacunas",
    },
  ]);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo_publicidad: "banner",
    fecha_inicio: "",
    fecha_fin: "",
    descuento_porcentaje: "",
    codigo_promocional: "",
    imagen_url: "",
    url_enlace: "",
    activo: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const nuevo = {
      idpublicidad: ads.length + 1,
      ...form,
      posicion: ads.length + 1,
    };
    setAds((prev) => [...prev, nuevo]);
    setForm({
      titulo: "",
      descripcion: "",
      tipo_publicidad: "banner",
      fecha_inicio: "",
      fecha_fin: "",
      descuento_porcentaje: "",
      codigo_promocional: "",
      imagen_url: "",
      url_enlace: "",
      activo: true,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta publicidad?")) {
      setAds((prev) => prev.filter((a) => a.idpublicidad !== id));
    }
  };

  const toggleActivo = (id) => {
    setAds((prev) =>
      prev.map((a) =>
        a.idpublicidad === id ? { ...a, activo: !a.activo } : a
      )
    );
  };

  return (
    <div className="inventory-page">
      <div className="card add-med-form" style={{ animation: "fadeIn 0.4s ease" }}>
        <h2>Agregar Nueva Publicidad</h2>
        <form onSubmit={handleAdd}>
          <input
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            style={{ resize: "none" }}
          />
          <select
            name="tipo_publicidad"
            value={form.tipo_publicidad}
            onChange={handleChange}
          >
            <option value="banner">Banner</option>
            <option value="promocion">Promoción</option>
            <option value="descuento">Descuento</option>
            <option value="oferta_especial">Oferta Especial</option>
            <option value="evento">Evento</option>
            <option value="informativa">Informativa</option>
          </select>

          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
          />
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
          />

          <input
            name="descuento_porcentaje"
            type="number"
            placeholder="% Descuento"
            value={form.descuento_porcentaje}
            onChange={handleChange}
          />
          <input
            name="codigo_promocional"
            placeholder="Código Promocional"
            value={form.codigo_promocional}
            onChange={handleChange}
          />

          <input
            name="imagen_url"
            placeholder="URL de la imagen"
            value={form.imagen_url}
            onChange={handleChange}
          />
          <input
            name="url_enlace"
            placeholder="URL del enlace"
            value={form.url_enlace}
            onChange={handleChange}
          />

          <label>
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />{" "}
            Activo
          </label>

          <button type="submit">Guardar Publicidad</button>
        </form>
      </div>

      <div className="card" style={{ animation: "fadeInUp 0.4s ease" }}>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Descuento</th>
              <th>Activo</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((a) => (
              <tr key={a.idpublicidad}>
                <td>{a.idpublicidad}</td>
                <td title={a.descripcion}>{a.titulo}</td>
                <td>{a.tipo_publicidad}</td>
                <td>{a.fecha_inicio}</td>
                <td>{a.fecha_fin}</td>
                <td>
                  {a.descuento_porcentaje ? `${a.descuento_porcentaje}%` : "—"}
                </td>
                <td>
                  <button
                    onClick={() => toggleActivo(a.idpublicidad)}
                    style={{
                      background: a.activo ? "#2ecc71" : "#bbb",
                      border: "none",
                      color: "#fff",
                      borderRadius: 8,
                      padding: "5px 10px",
                      cursor: "pointer",
                      transition: "background 0.2s ease, transform 0.1s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = a.activo
                        ? "#27ae60"
                        : "#999")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = a.activo
                        ? "#2ecc71"
                        : "#bbb")
                    }
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.96)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {a.activo ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td>
                  {a.imagen_url ? (
                    <img
                      src={a.imagen_url}
                      alt={a.titulo}
                      style={{
                        width: 80,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 8,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => handleDelete(a.idpublicidad)}
                    style={{
                      backgroundColor: "#e03131",
                      border: "none",
                      color: "#fff",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "background-color .2s ease, transform .1s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#c92a2a")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e03131")
                    }
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.96)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdsManager;

