// src/pages/CompraPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard';

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
        setProducto(data);
      } catch (err) {
        setError(err.message);
      }
    }

    cargarProducto();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!producto) return <p>Cargando...</p>;

  return (
  <>
    <main style={{ padding: '2rem' }}>
      <ProductoCard producto={producto} />
    </main>
  </>
);

}

export default CompraPage;
