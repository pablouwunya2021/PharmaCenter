import React, { useState } from 'react'

const API = 'http://localhost:3000'

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
  const [localNombre, setLocalNombre] = useState(nombre)

  const fecha = new Date(fechavencimiento)
  const precioNum = Number(precio)
  const costoNum = Number(costo)

  const toCamelPayload = (nuevoNombre) => ({
    nombre: nuevoNombre,
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

  const updateNombre = async (nuevoNombre) => {
    let res, data
    try {
      res = await fetch(`${API}/api/medicamentos/${idmedicamento}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre })
      })
      data = await res.json().catch(() => ({}))
      console.log('PATCH rename response:', res.status, data)
      if (res.ok) return true
    } catch (e) {
      console.warn('PATCH fallo, probamos PUT', e)
    }

    try {
      res = await fetch(`${API}/api/medicamentos/${idmedicamento}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toCamelPayload(nuevoNombre))
      })
      data = await res.json().catch(() => ({}))
      console.log('PUT full update response:', res.status, data)
      return res.ok
    } catch (e) {
      console.error('PUT error:', e)
      return false
    }
  }

  const handleRename = async () => {
    const nuevoNombre = window.prompt('Nuevo nombre del medicamento:', localNombre)
    if (nuevoNombre === null) return
    const trimmed = nuevoNombre.trim()
    if (!trimmed || trimmed === localNombre) return
    if (!idmedicamento) return alert('No se encuentra el ID del medicamento.')
    try {
      setRenaming(true)
      setLocalNombre(trimmed) // actualización optimista
      const ok = await updateNombre(trimmed)
      if (!ok) {
        setLocalNombre(nombre) // revertir si falla
        return alert('No se pudo renombrar. Revisa la consola (F12) para detalles.')
      }
      if (typeof onChanged === 'function') onChanged()
    } finally {
      setRenaming(false)
    }
  }

  return (
    <tr>
      <td>{localNombre}</td>
      <td>{cantidadinventario}</td>
      <td>{!isNaN(fecha) ? fecha.toLocaleDateString() : 'Fecha inválida'}</td>
      <td>{isNaN(precioNum) ? precio : `$${precioNum.toFixed(2)}`}</td>
      <td>{isNaN(costoNum) ? costo : `$${costoNum.toFixed(2)}`}</td>
      <td>{proveedor}</td>
      <td>{imagenurl ? <img src={imagenurl} alt={nombre} /> : '—'}</td>
      <td>
        <button onClick={handleRename} disabled={renaming}>
          {renaming ? 'Guardando…' : 'Renombrar'}
        </button>
      </td>
    </tr>
  )
}

export default InventoryItem