import { useState, useEffect, useCallback } from 'react';

const useSearch = (apiUrl = '/api/medicamentos') => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [allMedicamentos, setAllMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar todos los medicamentos al montar el componente
  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Error al cargar los medicamentos');
        }
        const data = await response.json();
        setAllMedicamentos(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching medicamentos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, [apiUrl]);

  // Filtrar medicamentos basado en el término de búsqueda
  const filterMedicamentos = useCallback(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allMedicamentos.filter((med) => {
      // Buscar en nombre, descripción, categoría, etc.
      const nombre = med.nombre?.toLowerCase() || '';
      const descripcion = med.descripcion?.toLowerCase() || '';
      const categoria = med.categoria?.toLowerCase() || '';
      const laboratorio = med.laboratorio?.toLowerCase() || '';
      
      return (
        nombre.includes(term) ||
        descripcion.includes(term) ||
        categoria.includes(term) ||
        laboratorio.includes(term)
      );
    });

    setResults(filtered.slice(0, 10)); // Limitar a 10 resultados
  }, [searchTerm, allMedicamentos]);

  // Ejecutar filtrado cuando cambie el término de búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterMedicamentos();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [filterMedicamentos]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setIsOpen(false);
  }, []);

  // Toggle del panel de búsqueda (para móvil)
  const toggleSearch = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Cerrar búsqueda
  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    isOpen,
    toggleSearch,
    closeSearch,
    clearSearch,
    hasResults: results.length > 0,
  };
};

export default useSearch;