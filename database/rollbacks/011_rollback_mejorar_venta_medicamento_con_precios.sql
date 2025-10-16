-- Rollback: 011_rollback_mejorar_venta_medicamento_con_precios
-- Description: Revertir cambios de precios en venta_medicamento
-- Date: 2025-10-15

-- ============================================
-- MIGRATION DOWN
-- ============================================

-- 1. Eliminar columnas
ALTER TABLE venta_medicamento DROP COLUMN IF EXISTS subtotal;
ALTER TABLE venta_medicamento DROP COLUMN IF EXISTS precio_unitario;
