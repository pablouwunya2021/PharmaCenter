import React from 'react'
import InventoryItem from './InventoryItem'

const InventoryList = ({ items, onChanged }) => (
  <table className="inventory-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Cantidad</th>
        <th>Vencimiento</th>
        <th>Precio</th>
        <th>Costo</th>
        <th>Proveedor</th>
        <th>Imagen</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <InventoryItem
          key={item.idmedicamento || item.idMedicamento || item.nombre}
          item={item}
          onChanged={onChanged}
        />
      ))}
    </tbody>
  </table>
)

export default InventoryList
