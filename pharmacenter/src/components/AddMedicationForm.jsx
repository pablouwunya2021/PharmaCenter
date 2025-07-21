import React, { useState } from 'react'

const API = 'http://localhost:3000'

const AddMedicationForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    nombre: '',
    cantidadInventario: '',
    fechaVencimiento: '',
    precio: '',
    costo: '',
    proveedor: '',
    imagenUrl: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/api/medicamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) {
        return alert(data.error || 'Error al crear medicamento')
      }
      setForm({
        nombre: '',
        cantidadInventario: '',
        fechaVencimiento: '',
        precio: '',
        costo: '',
        proveedor: '',
        imagenUrl: ''
      })
      onAdd()
    } catch (err) {
      console.error(err)
      alert('Error al conectar con el servidor')
    }
  }

  return (
    <div className="card add-med-form">
      <h2>Agregar Nuevo Medicamento</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="cantidadInventario"
          type="number"
          placeholder="Cantidad Inventario"
          value={form.cantidadInventario}
          onChange={handleChange}
          required
        />
        <input
          name="fechaVencimiento"
          type="date"
          value={form.fechaVencimiento}
          onChange={handleChange}
          required
        />
        <input
          name="precio"
          type="number"
          step="0.01"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          required
        />
        <input
          name="costo"
          type="number"
          step="0.01"
          placeholder="Costo"
          value={form.costo}
          onChange={handleChange}
          required
        />
        <input
          name="proveedor"
          placeholder="Proveedor"
          value={form.proveedor}
          onChange={handleChange}
          required
        />
        <input
          name="imagenUrl"
          placeholder="URL de la imagen"
          value={form.imagenUrl}
          onChange={handleChange}
        />
        <button type="submit">Guardar</button>
      </form>
    </div>
  )
}

export default AddMedicationForm
