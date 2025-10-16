-- Rollback: 012_rollback_mejorar_restricciones_venta_usuario
-- Description: Revertir restricción RESTRICT en venta-usuario
-- Date: 2025-10-15

-- ============================================
-- MIGRATION DOWN
-- ============================================

-- 1. Eliminar constraint con RESTRICT
ALTER TABLE venta DROP CONSTRAINT IF EXISTS venta_idusuario_fkey;

-- 2. Recrear constraint sin restricción específica
ALTER TABLE venta 
ADD CONSTRAINT venta_idusuario_fkey 
FOREIGN KEY (idusuario) REFERENCES usuario(idusuario);
