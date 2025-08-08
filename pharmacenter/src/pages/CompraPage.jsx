import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard';
import FondoCompra from '../assets/fondocompra.webp';
import '../styles/compra.css';

function CompraPage() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarProducto() {
      try {
        const res = await fetch(`http://localhost:3000/api/medicamentos/${id}`);
        if (!res.ok) throw new Error('No se pudo obtener el medicamento');

        const data = await res.json();

        const productoAdaptado = {
          id: data.idmedicamento,
          nombre: data.nombre,
          cantidadInventario: data.cantidadinventario,
          precio: Number(data.precio),
          proveedor: data.proveedor,
          imagenUrl: data.imagenurl,
        };

        setProducto(productoAdaptado);
      } catch (err) {
        setError(err.message);
      }
    }

    cargarProducto();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!producto) return <p>Cargando medicamento...</p>;

  return (
    <div 
      className="compra-page"
      style={{
        backgroundImage: `url(${FondoCompra})`,
      }}
    >
      <div className="compra-overlay">
        <ProductoCard producto={producto} />
      </div>
    </div>
  );
}

export default CompraPage;

