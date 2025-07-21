import React from 'react'
import InventoryItem from './InventoryItem'

const InventoryList = ({ items }) => (
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
      </tr>
    </thead>
    <tbody>
      {items.map(item => (
        <InventoryItem key={item.idMedicamento} item={item} />
      ))}
    </tbody>
  </table>
)

export default InventoryList
