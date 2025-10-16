-- Rollback: 010_rollback_agregar_cliente_fecha_a_venta
-- Description: Revertir cambios de cliente y fecha en venta
-- Date: 2025-10-15

-- ============================================
-- MIGRATION DOWN
-- ============================================

-- 1. Eliminar clave foránea
ALTER TABLE venta DROP CONSTRAINT IF EXISTS fk_venta_cliente;

-- 2. Eliminar columnas
ALTER TABLE venta DROP COLUMN IF EXISTS idcliente;
ALTER TABLE venta DROP COLUMN IF EXISTS fecha;
