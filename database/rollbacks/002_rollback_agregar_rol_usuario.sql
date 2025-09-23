-- Rollback: 002_agregar_rol_usuario
-- Description: Rollback for agregar rol usuario
-- Date: 2025-09-23

-- ============================================
-- ROLLBACK (REVERTIR CAMBIOS)
-- ============================================

-- Eliminar constraint único
ALTER TABLE Usuario DROP CONSTRAINT IF EXISTS usuario_correo_unique;

-- Eliminar columna rol
ALTER TABLE Usuario DROP COLUMN IF EXISTS rol;

-- Eliminar usuario admin
DELETE FROM Usuario WHERE correo = 'admin@pharmacenter.com';