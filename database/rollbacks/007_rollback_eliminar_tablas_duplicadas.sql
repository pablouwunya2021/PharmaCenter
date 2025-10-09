-- Rollback: 007_rollback_eliminar_tablas_duplicadas
-- Description: No hay rollback para esta migración porque estamos eliminando tablas vacías
-- Date: 2025-10-08
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION DOWN - NO HAY ROLLBACK
-- ============================================

-- Esta migración no tiene rollback porque:
-- 1. Las tablas eliminadas estaban vacías
-- 2. Eran duplicados no deseados
-- 3. El esquema correcto ya existe (Usuario, Medicamento, Venta)

-- Si necesitas recrear las tablas duplicadas (no recomendado), 
-- consulta el archivo 001_initial_schema.sql

SELECT 'No hay rollback para esta migración - las tablas eliminadas estaban vacías' AS mensaje;
