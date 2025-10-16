-- Rollback: 009_rollback_agregar_relacion_medicamento_proveedor
-- Description: Revertir relación entre medicamento y proveedores
-- Date: 2025-10-15

-- ============================================
-- MIGRATION DOWN
-- ============================================

-- 1. Agregar columna proveedor antigua
ALTER TABLE medicamento ADD COLUMN proveedor VARCHAR(100);

-- 2. Migrar datos de vuelta
UPDATE medicamento SET proveedor = (
  SELECT nombre FROM proveedores WHERE idproveedor = medicamento.idproveedor
);

-- 3. Hacer NOT NULL la columna proveedor
ALTER TABLE medicamento ALTER COLUMN proveedor SET NOT NULL;

-- 4. Eliminar clave foránea
ALTER TABLE medicamento DROP CONSTRAINT IF EXISTS fk_medicamento_proveedor;

-- 5. Eliminar columna idproveedor
ALTER TABLE medicamento DROP COLUMN idproveedor;
