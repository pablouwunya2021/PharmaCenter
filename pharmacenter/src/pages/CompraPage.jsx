import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard';
import FondoCompra from '../assets/fondocompra.webp';
import '../styles/compra.css';

function CompraPage() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarProducto() {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }

    cargarProducto();
  }, [id]);

  return (
    <div 
      className="compra-page"
      style={{
        backgroundImage: `url(${FondoCompra})`,
      }}
    >
      <div className="compra-overlay">
        {loading && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(124, 58, 237, 0.2)',
            textAlign: 'center',
            color: '#6d28d9',
            fontWeight: 600,
            fontSize: '1.1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e9d5ff',
              borderTop: '4px solid #7c3aed',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }}></div>
            Cargando medicamento...
          </div>
        )}
        
        {error && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(239, 68, 68, 0.2)',
            textAlign: 'center',
            color: '#dc2626',
            fontWeight: 600,
            fontSize: '1.1rem',
            maxWidth: '500px'
          }}>
            ❌ Error: {error}
          </div>
        )}
        
        {!loading && !error && producto && <ProductoCard producto={producto} />}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CompraPage;

