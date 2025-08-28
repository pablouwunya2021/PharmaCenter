import React, { useState, useEffect, useCallback } from 'react'
import InventoryTable from '../components/InventoryTable'
import AddMedicationForm from '../components/AddMedicationForm'
import '../styles/Inventory.css'
import Header from '../components/Header'

const API = 'http://localhost:3000'

const Inventory = () => {
  const [items, setItems] = useState([])

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/medicamentos`)
      if (!res.ok) throw new Error(res.status)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error cargando inventario:', err)
      setItems([])
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return (
    <>
      
      <div className="inventory-page">
        {/* SOLO una tabla */}
        <InventoryTable items={items} onChanged={fetchItems} />
        {}
        <AddMedicationForm onAdd={fetchItems} />
      </div>
    </>
  )
}

export default Inventory