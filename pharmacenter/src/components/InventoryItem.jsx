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
  const [editingQuantity, setEditingQuantity] = useState(false)
  const [updatingQuantity, setUpdatingQuantity] = useState(false)
  const [localNombre, setLocalNombre] = useState(nombre)
  const [localQuantity, setLocalQuantity] = useState(cantidadinventario)
  const [tempQuantity, setTempQuantity] = useState(cantidadinventario)
  const [isRowHovered, setIsRowHovered] = useState(false)

  const fechaLegible = (() => {
    try {
      const d = new Date(fechavencimiento)
      return isNaN(d) ? String(fechavencimiento) : d.toLocaleDateString()
    } catch {
      return String(fechavencimiento)
    }
  })()

  const updateQuantity = async (newQuantity) => {
    if (newQuantity < 0) return // No permitir negativos
    
    try {
      setUpdatingQuantity(true)
      
      const response = await fetch(`${API}/api/medicamentos/${idmedicamento}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidadInventario: newQuantity })
      })

      if (!response.ok) {
        const putResponse = await fetch(`${API}/api/medicamentos/${idmedicamento}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: localNombre,
            cantidadInventario: newQuantity,
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
        if (!putResponse.ok) throw new Error('PUT falló')
      }

      setLocalQuantity(newQuantity)
      onChanged?.()
    } catch (e) {
      console.error(e)
      alert('No se pudo actualizar la cantidad.')
      setTempQuantity(localQuantity)
    } finally {
      setUpdatingQuantity(false)
    }
  }

  const handleQuantityChange = (increment) => {
    const newQuantity = Math.max(0, localQuantity + increment)
    updateQuantity(newQuantity)
  }

  const handleQuantityDoubleClick = () => {
    setEditingQuantity(true)
    setTempQuantity(localQuantity)
  }

  const handleQuantityInputChange = (e) => {
    const value = e.target.value
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setTempQuantity(value === '' ? 0 : parseInt(value))
    }
  }

  const handleQuantitySubmit = () => {
    const newQuantity = parseInt(tempQuantity) || 0
    if (newQuantity !== localQuantity) {
      updateQuantity(newQuantity)
    }
    setEditingQuantity(false)
  }

  const handleQuantityCancel = () => {
    setTempQuantity(localQuantity)
    setEditingQuantity(false)
  }

  const handleQuantityKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleQuantitySubmit()
    } else if (e.key === 'Escape') {
      handleQuantityCancel()
    }
  }

  const handleRename = async () => {
    const nuevoNombre = window.prompt('Nuevo nombre del medicamento:', localNombre)
    if (nuevoNombre == null) return
    const trimmed = nuevoNombre.trim()
    if (!trimmed || trimmed === localNombre) return

    try {
      setRenaming(true)
      const patch = await fetch(`${API}/api/medicamentos/${idmedicamento}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: trimmed })
      })

      if (!patch.ok) {
        const put = await fetch(`${API}/api/medicamentos/${idmedicamento}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: trimmed,
            cantidadInventario: localQuantity,
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
      onChanged?.()
    } catch (e) {
      console.error(e)
      alert('No se pudo eliminar este medicamento.')
    } finally {
      setDeleting(false)
    }
  }

  /* ---------- ESTILOS ---------- */
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

  const quantityControlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    position: 'relative'
  }

  const arrowButtonStyle = {
    background: '#70589a',
    color: 'white',
    border: 'none',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease'
  }

  const quantityInputStyle = {
    width: '80px',
    padding: '4px 8px',
    border: '2px solid #70589a',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '14px'
  }

  return (
    <tr 
      className="inventory-row"
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => setIsRowHovered(false)}
    >
      <td>{localNombre}</td>
      
      {/* COLUMNA DE CANTIDAD CON CONTROLES */}
      <td>
        {editingQuantity ? (
          <input
            type="text"
            value={tempQuantity}
            onChange={handleQuantityInputChange}
            onBlur={handleQuantitySubmit}
            onKeyDown={handleQuantityKeyDown}
            style={quantityInputStyle}
            autoFocus
            disabled={updatingQuantity}
          />
        ) : (
          <div className="quantity-control" style={quantityControlStyle}>
            <span 
              onDoubleClick={handleQuantityDoubleClick}
              style={{ 
                cursor: 'text', 
                minWidth: '30px', 
                textAlign: 'center',
                opacity: updatingQuantity ? 0.6 : 1
              }}
            >
              {updatingQuantity ? '...' : localQuantity}
            </span>
            
            {isRowHovered && !editingQuantity && (
              <div className="quantity-arrows" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={updatingQuantity || renaming || deleting}
                  style={{
                    ...arrowButtonStyle,
                    height: '18px',
                    fontSize: '10px'
                  }}
                  onMouseOver={(e) => !updatingQuantity && (e.target.style.backgroundColor = '#5a4178')}
                  onMouseOut={(e) => !updatingQuantity && (e.target.style.backgroundColor = '#70589a')}
                >
                  ▲
                </button>
                
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={updatingQuantity || renaming || deleting}
                  style={{
                    ...arrowButtonStyle,
                    height: '18px',
                    fontSize: '10px'
                  }}
                  onMouseOver={(e) => !updatingQuantity && (e.target.style.backgroundColor = '#5a4178')}
                  onMouseOut={(e) => !updatingQuantity && (e.target.style.backgroundColor = '#70589a')}
                >
                  ▼
                </button>
              </div>
            )}
          </div>
        )}
      </td>

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
          disabled={renaming || deleting || updatingQuantity}
          style={{ ...btn, backgroundColor: renaming ? '#9c7fd1' : '#7d5ba6' }}
          onMouseOver={(e) => !renaming && !deleting && !updatingQuantity && (e.currentTarget.style.backgroundColor = '#6b4e91')}
          onMouseOut={(e) => !renaming && !deleting && !updatingQuantity && (e.currentTarget.style.backgroundColor = '#7d5ba6')}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {renaming ? 'Guardando…' : '✏️ Renombrar'}
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting || renaming || updatingQuantity}
          style={{ ...btn, backgroundColor: deleting ? '#a33939' : '#e03131' }}
          onMouseOver={(e) => !deleting && !renaming && !updatingQuantity && (e.currentTarget.style.backgroundColor = '#c92a2a')}
          onMouseOut={(e) => !deleting && !renaming && !updatingQuantity && (e.currentTarget.style.backgroundColor = '#e03131')}
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