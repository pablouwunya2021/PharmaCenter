import React, { useEffect, useState, useCallback } from "react";
import "../../styles/AdsManager.css";

const API = "http://localhost:3000";


const AUTO_FILL_MISSING = true; // <-- cambia a false si quieres obligar al usuario

// Helpers de fechas
const todayStr = () => new Date().toISOString().slice(0, 10);
const addDays = (dateStr, days) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

// ✅ Helper robusto para convertir lo que venga del backend a boolean real
// true  -> true, "true", "t", "1", 1, "yes", "y", "si", "sí"
// false -> false, "false", "f", "0", 0, "no", "n", "", null, undefined
const asBool = (v) => {
  if (v === true) return true;
  if (v === false) return false;
  if (v === 1) return true;
  if (v === 0) return false;
  if (v == null) return false; // null/undefined -> false
  const s = String(v).trim().toLowerCase();
  if (["true", "t", "1", "yes", "y", "si", "sí"].includes(s)) return true;
  if (["false", "f", "0", "no", "n", "", "null", "undefined"].includes(s)) return false;
  return false; // fallback seguro
};

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

  // ================== FETCH ==================
  const fetchAds = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/publicidad?all=true`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al obtener publicidad");

      // ✅ Normaliza ID y ACTIVO sin importar el formato del backend
      const rows = (data.data || []).map((r) => {
        const id = r.idpublicidad ?? r.id_publicidad ?? r.id;
        const rawActivo = r.activo ?? r.estado ?? r.enabled ?? r.is_active ?? r.activa;
        return {
          ...r,
          idpublicidad: id,
          activo: asBool(rawActivo),
        };
      });

      setAds(rows);
    } catch (err) {
      console.error("Error al cargar publicidad:", err);
      setAds([]);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // ================== FORM ==================
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // usar checked para booleanos
    }));
  };

  // ================== CREAR ==================
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!AUTO_FILL_MISSING) {
      if (!form.titulo.trim()) {
        alert("Debe ingresar un título");
        return;
      }
      if (!form.fecha_inicio) {
        alert("Debe ingresar una fecha de inicio");
        return;
      }
      if (!form.fecha_fin) {
        alert("Debe ingresar una fecha de fin");
        return;
      }
    }

    const titulo = AUTO_FILL_MISSING
      ? form.titulo?.trim() || "Sin título"
      : form.titulo.trim();

    let fecha_inicio = form.fecha_inicio;
    let fecha_fin = form.fecha_fin;

    if (AUTO_FILL_MISSING) {
      if (!fecha_inicio) fecha_inicio = todayStr();
      if (!fecha_fin) fecha_fin = addDays(fecha_inicio, 30);
    }

    const payload = {
      titulo,
      descripcion: AUTO_FILL_MISSING ? form.descripcion ?? " " : form.descripcion,
      tipo_publicidad: form.tipo_publicidad || "banner",
      imagen_url: AUTO_FILL_MISSING ? form.imagen_url ?? " " : form.imagen_url,
      fecha_inicio,
      fecha_fin,
      activo: Boolean(form.activo),
      url_enlace: AUTO_FILL_MISSING ? form.url_enlace ?? " " : form.url_enlace,
      codigo_promocional: AUTO_FILL_MISSING
        ? form.codigo_promocional ?? " "
        : form.codigo_promocional,
      descuento_porcentaje:
        form.descuento_porcentaje === "" || form.descuento_porcentaje === undefined
          ? null
          : Number(form.descuento_porcentaje),
    };

    try {
      const res = await fetch(`${API}/api/publicidad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      console.error("Error al guardar publicidad:", err);
      alert(`Error al guardar publicidad: ${err.message || "Servidor no disponible"}`);
    }
  };

  // ================== ELIMINAR ==================
  const handleDelete = async (id) => {
    const validId = id ?? ads.find((x) => x.idpublicidad || x.id_publicidad)?.idpublicidad;
    if (!validId || isNaN(Number(validId))) {
      alert("ID inválido para eliminar publicidad");
      return;
    }

    if (!window.confirm("¿Seguro que deseas eliminar esta publicidad?")) return;

    try {
      const res = await fetch(`${API}/api/publicidad/${validId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar publicidad");

      alert("Publicidad eliminada correctamente ✅");
      fetchAds();
    } catch (err) {
      console.error("Error al eliminar publicidad:", err);
      alert("Error al eliminar publicidad");
    }
  };

  // ================== UI ==================
  return (
    <div className="ads-page">
      {/* ---------- Formulario ---------- */}
      <div className="ads-card">
        <h2>Agregar Nueva Publicidad</h2>
        <form onSubmit={handleAdd} className="ads-form">
          <div className="form-row">
            <input
              name="titulo"
              placeholder="Título"
              value={form.titulo}
              onChange={handleChange}
              required={!AUTO_FILL_MISSING}
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
              required={!AUTO_FILL_MISSING}
            />
            <input
              type="date"
              name="fecha_fin"
              value={form.fecha_fin}
              onChange={handleChange}
              required={!AUTO_FILL_MISSING}
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

          {/* Checkbox Activo */}
          <div className="ads-active">
            <label style={{ cursor: "pointer", userSelect: "none" }}>
              <input
                type="checkbox"
                name="activo"
                checked={form.activo}
                onChange={handleChange}
                style={{ marginRight: 8 }}
              />
              {form.activo ? "Activo" : "Inactivo"}
            </label>
          </div>

          <button type="submit">Guardar Publicidad</button>
        </form>
      </div>

      {/* ---------- Tabla ---------- */}
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
            {ads.map((a) => {
              const rowId = a.idpublicidad ?? a.id_publicidad;

              return (
                <tr key={rowId}>
                  <td>{rowId}</td>
                  <td title={a.descripcion || ""}>{a.titulo}</td>
                  <td>{a.tipo_publicidad}</td>
                  <td>{a.fecha_inicio ? a.fecha_inicio.slice(0, 10) : "—"}</td>
                  <td>{a.fecha_fin ? a.fecha_fin.slice(0, 10) : "—"}</td>
                  <td>{a.descuento_porcentaje ?? "—"}</td>

                  {/* Activo solo visual (badge) */}
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "12px",
                        fontWeight: 600,
                        color: "#fff",
                        backgroundColor: a.activo ? "#2ecc71" : "#b0b0b0",
                        minWidth: 80,
                        textAlign: "center",
                      }}
                    >
                      {a.activo ? "Activo" : "Inactivo"}
                    </span>
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
                      onClick={() => handleDelete(rowId)}
                    >
                      🗑 Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdsManager;

