-- Rollback: 014_rollback_agregar_usuario_a_notificacion
-- Description: Revertir relación entre notificacion y usuario
-- Date: 2025-10-15

-- ============================================
-- MIGRATION DOWN
-- ============================================

-- 1. Eliminar clave foránea
ALTER TABLE notificacion DROP CONSTRAINT IF EXISTS fk_notificacion_usuario;

-- 2. Eliminar columna
ALTER TABLE notificacion DROP COLUMN IF EXISTS idusuario;
