import React, { useState } from 'react'

const API = 'http://localhost:3000' // ajusta si tu backend usa otra URL

const InventoryItem = ({ item, onChanged }) => {
  const {
    idmedicamento,
    nombre,
    cantidadinventario,
    fechavencimiento,
    precio,
    costo,
    proveedor,
    imagenurl
  } = item

  const [renaming, setRenaming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [localNombre, setLocalNombre] = useState(nombre)

  const fechaLegible = (() => {
    try {
      const d = new Date(fechavencimiento)
      return isNaN(d) ? String(fechavencimiento) : d.toLocaleDateString()
    } catch {
      return String(fechavencimiento)
    }
  })()

  /* ---------- RENOMBRAR ---------- */
  const handleRename = async () => {
    const nuevoNombre = window.prompt('Nuevo nombre del medicamento:', localNombre)
    if (nuevoNombre == null) return
    const trimmed = nuevoNombre.trim()
    if (!trimmed || trimmed === localNombre) return

    try {
      setRenaming(true)
      // intentamos PATCH (si tu API no soporta, hacemos PUT con todo el payload)
      const patch = await fetch(`${API}/api/medicamentos/${idmedicamento}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: trimmed })
      })

      if (!patch.ok) {
        // fallback PUT si el backend no tiene PATCH
        const put = await fetch(`${API}/api/medicamentos/${idmedicamento}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: trimmed,
            cantidadInventario: cantidadinventario,
            fechaVencimiento:
              typeof fechavencimiento === 'string'
                ? fechavencimiento.slice(0, 10)
                : new Date(fechavencimiento).toISOString().slice(0, 10),
            precio,
            costo,
            proveedor,
            imagenUrl: imagenurl
          })
        })
        if (!put.ok) throw new Error('PUT falló')
      }

      setLocalNombre(trimmed)
      onChanged?.()
    } catch (e) {
      console.error(e)
      alert('No se pudo renombrar este medicamento.')
    } finally {
      setRenaming(false)
    }
  }

  /* ---------- ELIMINAR ---------- */
  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar "${localNombre}" del inventario?`)) return
    try {
      setDeleting(true)
      const res = await fetch(`${API}/api/medicamentos/${idmedicamento}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} ${txt}`)
      }
      onChanged?.() // recargar lista en el padre
    } catch (e) {
      console.error(e)
      alert('No se pudo eliminar este medicamento.')
    } finally {
      setDeleting(false)
    }
  }

  /* ---------- estilos de los botones ---------- */
  const btn = {
    border: 'none',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color .2s ease, transform .1s ease',
    marginRight: 10
  }

  return (
    <tr>
      <td>{localNombre}</td>
      <td>{cantidadinventario}</td>
      <td>{fechaLegible}</td>
      <td>{Number.isFinite(+precio) ? `$${(+precio).toFixed(2)}` : precio}</td>
      <td>{Number.isFinite(+costo) ? `$${(+costo).toFixed(2)}` : costo}</td>
      <td>{proveedor}</td>
      <td>
        {imagenurl ? (
          <img
            src={imagenurl}
            alt={localNombre}
            style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 8 }}
          />
        ) : (
          '—'
        )}
      </td>

      {/* ACCIONES */}
      <td className="actions-cell">
        <button
          onClick={handleRename}
          disabled={renaming || deleting}
          style={{ ...btn, backgroundColor: renaming ? '#9c7fd1' : '#7d5ba6' }}
          onMouseOver={(e) => !renaming && !deleting && (e.currentTarget.style.backgroundColor = '#6b4e91')}
          onMouseOut={(e) => !renaming && !deleting && (e.currentTarget.style.backgroundColor = '#7d5ba6')}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {renaming ? 'Guardando…' : '✏️ Renombrar'}
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting || renaming}
          style={{ ...btn, backgroundColor: deleting ? '#a33939' : '#e03131' }}
          onMouseOver={(e) => !deleting && !renaming && (e.currentTarget.style.backgroundColor = '#c92a2a')}
          onMouseOut={(e) => !deleting && !renaming && (e.currentTarget.style.backgroundColor = '#e03131')}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {deleting ? 'Eliminando…' : '🗑 Eliminar'}
        </button>
      </td>
    </tr>
  )
}

export default InventoryItem
