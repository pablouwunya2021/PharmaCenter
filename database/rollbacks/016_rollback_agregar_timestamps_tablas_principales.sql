-- Rollback: 016_rollback_agregar_timestamps_tablas_principales
-- Description: Revertir timestamps y triggers de auditoría
-- Date: 2025-10-15

-- ============================================
-- MIGRATION DOWN
-- ============================================

-- 1. Eliminar triggers
DROP TRIGGER IF EXISTS update_usuario_updated_at ON usuario;
DROP TRIGGER IF EXISTS update_medicamento_updated_at ON medicamento;

-- 2. Eliminar función
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 3. Eliminar columnas
ALTER TABLE usuario DROP COLUMN IF EXISTS created_at;
ALTER TABLE usuario DROP COLUMN IF EXISTS updated_at;
ALTER TABLE medicamento DROP COLUMN IF EXISTS created_at;
ALTER TABLE medicamento DROP COLUMN IF EXISTS updated_at;
ALTER TABLE venta DROP COLUMN IF EXISTS created_at;
