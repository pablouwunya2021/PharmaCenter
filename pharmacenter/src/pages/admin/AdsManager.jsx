import React, { useState } from "react";

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
    <section style={{ padding: 20 }}>
      <h1 style={{ color: "#4a2c75", fontWeight: 800, marginBottom: 10 }}>
        Gestión de Publicidad
      </h1>

      {/* FORMULARIO */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: 25,
        }}
      >
        <h2 style={{ marginBottom: 10, color: "#5c3c92" }}>Añadir Nueva Publicidad</h2>
        <form
          onSubmit={handleAdd}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <input
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            required
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

          <label style={{ gridColumn: "1 / 3" }}>
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />{" "}
            Activo
          </label>

          <button
            type="submit"
            style={{
              gridColumn: "1 / 3",
              background: "#5c3c92",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Añadir Publicidad
          </button>
        </form>
      </div>

      {/* TABLA */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#ede7f6", color: "#4a2c75" }}>
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
                <td>{a.titulo}</td>
                <td>{a.tipo_publicidad}</td>
                <td>{a.fecha_inicio}</td>
                <td>{a.fecha_fin}</td>
                <td>{a.descuento_porcentaje ? `${a.descuento_porcentaje}%` : "—"}</td>
                <td>
                  <button
                    onClick={() => toggleActivo(a.idpublicidad)}
                    style={{
                      background: a.activo ? "#28a745" : "#aaa",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
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
                        width: 100,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(a.idpublicidad)}
                    style={{
                      background: "#e03131",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdsManager;
