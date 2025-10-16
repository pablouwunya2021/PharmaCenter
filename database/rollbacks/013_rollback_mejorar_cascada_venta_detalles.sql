-- Rollback: 013_rollback_mejorar_cascada_venta_detalles
-- Description: Revertir CASCADE DELETE en venta_medicamento
-- Date: 2025-10-15

-- ============================================
-- MIGRATION DOWN
-- ============================================

-- 1. Eliminar constraint con CASCADE
ALTER TABLE venta_medicamento DROP CONSTRAINT IF EXISTS venta_medicamento_idventa_fkey;

-- 2. Recrear constraint sin CASCADE
ALTER TABLE venta_medicamento 
ADD CONSTRAINT venta_medicamento_idventa_fkey 
FOREIGN KEY (idventa) REFERENCES venta(idventa);
