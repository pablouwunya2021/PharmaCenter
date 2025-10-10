import React from 'react';
import { useCart } from '../context/CartContext';

const AddToCartButton = ({ med }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    const cantidadDisponible = med.cantidadinventario ?? med.cantidadInventario ?? 0;
    if (cantidadDisponible <= 0) {
      alert('Producto sin stock disponible');
      return;
    }

    const productoParaCarrito = {
      id: med.idmedicamento ?? med.idMedicamento ?? med.id,
      nombre: med.nombre,
      precio: Number(med.precio) || 0,
      cantidad: 1,
      imagenUrl: med.imagenurl ?? med.imagenUrl,
      cantidadInventario: cantidadDisponible,
    };

    addToCart(productoParaCarrito);
    alert(`✅ Agregado al carrito: 1 x ${med.nombre}`);
  };

  return (
    <button onClick={handleAdd} className="btn btn--primary">
      Agregar
    </button>
  );
};

export default AddToCartButton;
