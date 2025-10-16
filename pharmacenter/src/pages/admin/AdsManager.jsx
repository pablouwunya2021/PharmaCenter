import React, { useEffect, useState, useCallback } from "react";
import "../styles/AdsManager.css";

const API = "http://localhost:3000";

const AdsManager = () => {
  const [ads, setAds] = useState([]);
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

  // 🔹 Cargar todas las publicidades
  const fetchAds = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/publicidad`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al obtener publicidad");
      setAds(data.data || []);
    } catch (err) {
      console.error("Error al cargar publicidad:", err);
      setAds([]);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // 🔹 Manejar cambios del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // 🔹 Crear nueva publicidad
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/publicidad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar publicidad");

      alert("Publicidad creada correctamente ✅");
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
      fetchAds();
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  };

  // 🔹 Eliminar publicidad
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta publicidad?")) return;
    try {
      const res = await fetch(`${API}/api/publicidad/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar publicidad");
      fetchAds();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar publicidad");
    }
  };

  // 🔹 Cambiar estado Activo
  const toggleActivo = async (id, currentState) => {
    try {
      const res = await fetch(`${API}/api/publicidad/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !currentState }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchAds();
    } catch (err) {
      alert("Error al actualizar estado");
    }
  };

  return (
    <div className="ads-page">
      <div className="ads-card">
        <h2>Agregar Nueva Publicidad</h2>
        <form onSubmit={handleAdd} className="ads-form">
          <div className="form-row">
            <input
              name="titulo"
              placeholder="Título"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              rows={2}
              style={{ flex: 2 }}
            />
            <select
              name="tipo_publicidad"
              value={form.tipo_publicidad}
              onChange={handleChange}
              style={{ flex: 1 }}
            >
              <option value="banner">Banner</option>
              <option value="promocion">Promoción</option>
              <option value="descuento">Descuento</option>
              <option value="oferta_especial">Oferta Especial</option>
              <option value="evento">Evento</option>
              <option value="informativa">Informativa</option>
            </select>
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="ads-active">
            <label>
              <input
                type="checkbox"
                name="activo"
                checked={form.activo}
                onChange={handleChange}
              />{" "}
              Activo
            </label>
          </div>

          <button type="submit">Guardar Publicidad</button>
        </form>
      </div>

      {/* Tabla */}
      <div className="ads-card">
        <table className="ads-table">
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
                <td>{a.fecha_inicio?.slice(0, 10)}</td>
                <td>{a.fecha_fin?.slice(0, 10)}</td>
                <td>{a.descuento_porcentaje || "—"}</td>
                <td>
                  <button
                    onClick={() => toggleActivo(a.idpublicidad, a.activo)}
                    style={{
                      background: a.activo ? "#2ecc71" : "#bbb",
                      border: "none",
                      color: "#fff",
                      borderRadius: 8,
                      padding: "5px 10px",
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
                        width: 80,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 8,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <button
                    className="ads-btn-delete"
                    onClick={() => handleDelete(a.idpublicidad)}
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

