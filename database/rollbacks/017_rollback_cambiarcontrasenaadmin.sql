-- Rollback: 017_cambiarcontrasenaadmin
-- Description: Rollback for cambiarcontrasenaadmin
-- Date: 2025-11-12
-- Author: PharmaCenter Team

-- ============================================
-- ROLLBACK (REVERTIR CAMBIOS)
-- ============================================

-- Rollback: Revertir cambio de contraseña del admin
-- Revierte a la contraseña anterior (admin123 hasheada)
UPDATE usuario 
SET contrasena = '$2b$10$orI2Sdif2aV.ONc.La8F5uWAxhrFwDlvZQ51ykHEMP7JD5e8Drymm',
    updated_at = CURRENT_TIMESTAMP
WHERE rol = 'admin' AND nombre = 'Administrador Sistema';

-- ============================================
-- NOTAS DE ROLLBACK
-- ============================================
-- ATENCIÓN:
-- 1. Este rollback puede causar pérdida de datos
-- 2. Asegúrate de hacer backup antes de ejecutar
-- 3. Verificar dependencias antes de eliminar objetos
-- 4. Testear el rollback en entorno de desarrollo

-- Remover registro de migración (esto se hace automáticamente por el script)