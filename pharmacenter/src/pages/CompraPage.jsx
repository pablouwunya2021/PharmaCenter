import { useEffect, useState } from 'react';
import ProductoCard from '../components/ProductoCard';
import FondoCompra from '../assets/fondocompra.webp'; // Asegúrate de que exista
import '../styles/compra.css';

function CompraPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fakeProductos = [
      {
        id: 1,
        nombre: "Paracetamol",
        cantidadInventario: 100,
        precio: 3.50,
        proveedor: "Farfasa",
        imagenUrl: "https://walmartgt.vtexassets.com/arquivos/ids/322244/Ibuprofeno-Mk-600-Mg-50-Tabletas-1-32817.jpg"
      },
    ];

    setTimeout(() => setProductos(fakeProductos), 200);
  }, []);

  return (
    <div 
      className="compra-page"
      style={{
        backgroundImage: `url(${FondoCompra})`,
      }}
    >
      <div className="compra-overlay">
        {productos.map(p => (
          <ProductoCard key={p.id} producto={p} />
        ))}
      </div>
    </div>
  );
}

export default CompraPage;
