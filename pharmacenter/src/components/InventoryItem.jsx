import React from 'react'

const InventoryItem = ({ item }) => {
  // Obs.: pg convierte nombres a minúsculas sin camelCase
  const {
    nombre,
    cantidadinventario,
    fechavencimiento,
    precio,
    costo,
    proveedor,
    imagenurl
  } = item

  const fecha = new Date(fechavencimiento)
  const precioNum = Number(precio)
  const costoNum  = Number(costo)

  return (
    <tr>
      <td>{nombre}</td>
      <td>{cantidadinventario}</td>
      <td>
        {!isNaN(fecha) 
          ? fecha.toLocaleDateString()
          : 'Fecha inválida'}
      </td>
      <td>
        { isNaN(precioNum)
          ? precio
          : `$${precioNum.toFixed(2)}` }
      </td>
      <td>
        { isNaN(costoNum)
          ? costo
          : `$${costoNum.toFixed(2)}` }
      </td>
      <td>{proveedor}</td>
      <td>
        { imagenurl
          ? <img src={imagenurl} alt={nombre} />
          : '—'
        }
      </td>
    </tr>
  )
}

export default InventoryItem