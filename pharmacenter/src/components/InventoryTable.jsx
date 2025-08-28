import React from 'react'
import InventoryItem from './InventoryItem'

const InventoryTable = ({ items, onChanged }) => {
  return (
    <div className="card">
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
          {items.map(item => (
            <InventoryItem
              key={item.idmedicamento || item.nombre}
              item={item}
              onChanged={onChanged}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InventoryTable