import React, { useState, useEffect, useCallback } from 'react'
import InventoryTable from '../components/InventoryTable'
import AddMedicationForm from '../components/AddMedicationForm'
import '../styles/Inventory.css'
import Header from '../components/Header'

const Inventory = () => {
  const [items, setItems] = useState([])

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/medicamentos')
      if (!res.ok) throw new Error(res.status)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error cargando inventario:', err)
    }
  }, [])

  useEffect(fetchItems, [fetchItems])

  return (
      <>
       <div className="inventory-page">
          <InventoryTable items={items} />
          <AddMedicationForm onAdd={fetchItems} />
      </div>
      </>
  )
}

export default Inventory